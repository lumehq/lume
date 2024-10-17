import { appColumns } from "@/commons";
import { Column, Spinner } from "@/components";
import { LumeWindow } from "@/system";
import type { ColumnEvent, LumeColumn } from "@/types";
import { ArrowLeft, ArrowRight, Plus, StackPlus } from "@phosphor-icons/react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useStore } from "@tanstack/react-store";
import { listen } from "@tauri-apps/api/event";
import { resolveResource } from "@tauri-apps/api/path";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { readTextFile } from "@tauri-apps/plugin-fs";
import useEmblaCarousel from "embla-carousel-react";
import { nanoid } from "nanoid";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useLayoutEffect,
	useState,
} from "react";
import { createPortal } from "react-dom";
import { useDebouncedCallback } from "use-debounce";

export const Route = createLazyFileRoute("/_layout/")({
	component: Screen,
});

function Screen() {
	const columns = useStore(appColumns, (state) => state);

	const [emblaRef, emblaApi] = useEmblaCarousel({
		watchDrag: false,
		loop: false,
	});

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev(true);
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext(true);
	}, [emblaApi]);

	const emitScrollEvent = useCallback(() => {
		getCurrentWindow().emit("column_scroll", {});
	}, []);

	const add = useDebouncedCallback((column: LumeColumn) => {
		column.label = `${column.label}-${nanoid()}`; // update col label
		appColumns.setState((prev) => [column, ...prev]);

		if (emblaApi) {
			emblaApi.scrollTo(0, true);
		}
	}, 150);

	const remove = useDebouncedCallback((label: string) => {
		appColumns.setState((prev) => prev.filter((t) => t.label !== label));
	}, 150);

	const move = useDebouncedCallback(
		(label: string, direction: "left" | "right") => {
			const newCols = [...columns];

			const col = newCols.find((el) => el.label === label);
			const colIndex = newCols.findIndex((el) => el.label === label);

			newCols.splice(colIndex, 1);

			if (direction === "left") newCols.splice(colIndex - 1, 0, col);
			if (direction === "right") newCols.splice(colIndex + 1, 0, col);

			appColumns.setState(() => newCols);
		},
		150,
	);

	const update = useDebouncedCallback((label: string, title: string) => {
		const currentColIndex = columns.findIndex((col) => col.label === label);

		const updatedCol = Object.assign({}, columns[currentColIndex]);
		updatedCol.name = title;

		const newCols = columns.slice();
		newCols[currentColIndex] = updatedCol;

		appColumns.setState(() => newCols);
	}, 150);

	const reset = useDebouncedCallback(() => appColumns.setState(() => []), 150);

	const handleKeyDown = useDebouncedCallback((event) => {
		if (event.defaultPrevented) return;

		switch (event.code) {
			case "ArrowLeft":
				if (emblaApi) emblaApi.scrollPrev();
				break;
			case "ArrowRight":
				if (emblaApi) emblaApi.scrollNext();
				break;
			default:
				break;
		}

		event.preventDefault();
	}, 150);

	useEffect(() => {
		if (emblaApi) {
			emblaApi.on("scroll", emitScrollEvent);
			emblaApi.on("slidesChanged", emitScrollEvent);
		}

		return () => {
			emblaApi?.off("scroll", emitScrollEvent);
			emblaApi?.off("slidesChanged", emitScrollEvent);
		};
	}, [emblaApi, emitScrollEvent]);

	// Listen for keyboard event
	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	// Listen for columns event
	useEffect(() => {
		const unlisten = listen<ColumnEvent>("columns", (data) => {
			if (data.payload.type === "reset") reset();
			if (data.payload.type === "add") add(data.payload.column);
			if (data.payload.type === "remove") remove(data.payload.label);
			if (data.payload.type === "move")
				move(data.payload.label, data.payload.direction);
			if (data.payload.type === "set_title")
				update(data.payload.label, data.payload.title);
		});

		return () => {
			unlisten.then((f) => f());
		};
	}, []);

	useEffect(() => {
		async function getSystemColumns() {
			const systemPath = "resources/columns.json";
			const resourcePath = await resolveResource(systemPath);
			const resourceFile = await readTextFile(resourcePath);
			const cols: LumeColumn[] = JSON.parse(resourceFile);

			appColumns.setState(() => cols.filter((col) => col.default));
		}

		if (!columns.length) {
			const prevColumns = window.localStorage.getItem("columns");

			if (!prevColumns) {
				getSystemColumns();
			} else {
				const parsed: LumeColumn[] = JSON.parse(prevColumns);
				appColumns.setState(() => parsed);
			}
		} else {
			window.localStorage.setItem("columns", JSON.stringify(columns));
		}
	}, [columns.length]);

	return (
		<div className="size-full">
			<div ref={emblaRef} className="overflow-hidden size-full">
				<div className="flex size-full">
					{!columns ? (
						<div className="size-full flex items-center justify-center">
							<Spinner />
						</div>
					) : (
						columns.map((column) => (
							<Column key={column.label} column={column} />
						))
					)}
					<div className="shrink-0 p-2 h-full w-[440px]">
						<div className="size-full flex items-center justify-center">
							<button
								type="button"
								onClick={() => LumeWindow.openLaunchpad()}
								className="inline-flex items-center justify-center gap-1 rounded-full text-sm font-medium h-8 w-max pl-2 pr-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
							>
								<Plus className="size-4" />
								Add Column
							</button>
						</div>
					</div>
				</div>
			</div>
			<Toolbar>
				<button
					type="button"
					onClick={() => LumeWindow.openLaunchpad()}
					className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<StackPlus className="size-4" />
				</button>
				<button
					type="button"
					onClick={() => scrollPrev()}
					className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowLeft className="size-4" />
				</button>
				<button
					type="button"
					onClick={() => scrollNext()}
					className="inline-flex items-center justify-center rounded-full size-7 hover:bg-black/5 dark:hover:bg-white/5"
				>
					<ArrowRight className="size-4" />
				</button>
			</Toolbar>
		</div>
	);
}

function Toolbar({ children }: { children: ReactNode[] }) {
	const [domReady, setDomReady] = useState(false);

	useLayoutEffect(() => {
		setDomReady(true);
	}, []);

	return domReady ? (
		// @ts-ignore, react bug ???
		createPortal(children, document.getElementById("toolbar"))
	) : (
		<></>
	);
}

/*
function Screen() {
  const context = Route.useRouteContext()
  const navigate = Route.useNavigate()

  const currentDate = useMemo(
    () =>
      new Date().toLocaleString('default', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      }),
    [],
  )

  const [accounts, setAccounts] = useState([])
  const [value, setValue] = useState('')
  const [autoLogin, setAutoLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()

  const showContextMenu = useCallback(
    async (e: React.MouseEvent, account: string) => {
      e.stopPropagation()

      const menuItems = await Promise.all([
        MenuItem.new({
          text: 'Reset password',
          enabled: !account.includes('_nostrconnect'),
          // @ts-ignore, this is tanstack router bug
          action: () => navigate({ to: '/reset', search: { account } }),
        }),
        MenuItem.new({
          text: 'Delete account',
          action: async () => await deleteAccount(account),
        }),
      ])

      const menu = await Menu.new({
        items: menuItems,
      })

      await menu.popup().catch((e) => console.error(e))
    },
    [],
  )

  const deleteAccount = async (account: string) => {
    const res = await commands.deleteAccount(account)

    if (res.status === 'ok') {
      setAccounts((prev) => prev.filter((item) => item !== account))
    }
  }

  const selectAccount = (account: string) => {
    setValue(account)

    if (account.includes('_nostrconnect')) {
      setAutoLogin(true)
    }
  }

  const loginWith = () => {
    startTransition(async () => {
      const res = await commands.login(value, password)

      if (res.status === 'ok') {
        const settings = await commands.getUserSettings()

        if (settings.status === 'ok') {
          appSettings.setState(() => settings.data)
        }

        const status = await commands.isAccountSync(res.data)

        if (status) {
          navigate({
            to: '/$account/home',
            // @ts-ignore, this is tanstack router bug
            params: { account: res.data },
            replace: true,
          })
        } else {
          navigate({
            to: '/loading',
            // @ts-ignore, this is tanstack router bug
            search: { account: res.data },
            replace: true,
          })
        }
      } else {
        await message(res.error, { title: 'Login', kind: 'error' })
        return
      }
    })
  }

  useEffect(() => {
    if (autoLogin) {
      loginWith()
    }
  }, [autoLogin, value])

  useEffect(() => {
    setAccounts(context.accounts)
  }, [context.accounts])

  return (
    <div
      data-tauri-drag-region
      className="relative size-full flex items-center justify-center"
    >
      <div className="w-[320px] flex flex-col gap-8">
        <div className="flex flex-col gap-1 text-center">
          <h3 className="leading-tight text-neutral-700 dark:text-neutral-300">
            {currentDate}
          </h3>
          <h1 className="leading-tight text-xl font-semibold">Welcome back!</h1>
        </div>
        <Frame
          className="flex flex-col w-full divide-y divide-neutral-100 dark:divide-white/5 rounded-xl overflow-hidden"
          shadow
        >
          {accounts.map((account) => (
            <div
              key={account}
              onClick={() => selectAccount(account)}
              onKeyDown={() => selectAccount(account)}
              className="group flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5 p-3"
            >
              <User.Provider pubkey={account.replace('_nostrconnect', '')}>
                <User.Root className="flex-1 flex items-center gap-2.5">
                  <User.Avatar className="rounded-full size-10" />
                  {value === account && !value.includes('_nostrconnect') ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') loginWith()
                        }}
                        disabled={isPending}
                        placeholder="Password"
                        className="px-3 rounded-full w-full h-10 bg-transparent border border-neutral-200 dark:border-neutral-500 focus:border-blue-500 focus:outline-none placeholder:text-neutral-400"
                      />
                    </div>
                  ) : (
                    <div className="inline-flex flex-col items-start">
                      <div className="inline-flex items-center gap-1.5">
                        <User.Name className="max-w-[6rem] truncate font-medium leading-tight" />
                        {account.includes('_nostrconnect') ? (
                          <div className="text-[8px] border border-blue-500 text-blue-500 px-1.5 rounded-full">
                            Nostr Connect
                          </div>
                        ) : null}
                      </div>
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {displayNpub(account.replace('_nostrconnect', ''), 16)}
                      </span>
                    </div>
                  )}
                </User.Root>
              </User.Provider>
              <div className="inline-flex items-center justify-center size-8 shrink-0">
                {value === account ? (
                  isPending ? (
                    <Spinner />
                  ) : (
                    <button
                      type="button"
                      onClick={() => loginWith()}
                      className="rounded-full size-10 inline-flex items-center justify-center"
                    >
                      <ArrowRight className="size-5" />
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={(e) => showContextMenu(e, account)}
                    className="rounded-full size-10 hidden group-hover:inline-flex items-center justify-center"
                  >
                    <DotsThree className="size-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          <a
            href="/new"
            className="flex items-center justify-between hover:bg-black/5 dark:hover:bg-white/5"
          >
            <div className="flex items-center gap-2.5 p-3">
              <div className="inline-flex items-center justify-center rounded-full size-10 bg-neutral-200 dark:bg-white/10">
                <Plus className="size-5" />
              </div>
              <span className="truncate text-sm font-medium leading-tight">
                New account
              </span>
            </div>
          </a>
        </Frame>
      </div>
      <div className="absolute bottom-2 right-2">
        <a
          href="/bootstrap-relays"
          className="h-8 w-max text-xs px-3 inline-flex items-center justify-center gap-1.5 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-full"
        >
          <GearSix className="size-4" />
          Manage Relays
        </a>
      </div>
    </div>
  )
}
*/
