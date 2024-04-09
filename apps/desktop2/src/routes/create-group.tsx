import { CheckCircleIcon } from "@lume/icons";
import { ColumnRouteSearch } from "@lume/types";
import { Column, User } from "@lume/ui";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/create-group")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  loader: async ({ context }) => {
    const ark = context.ark;
    const contacts = await ark.get_contact_list();
    return contacts;
  },
  component: Screen,
});

function Screen() {
  const contacts = Route.useLoaderData();

  const { ark } = Route.useRouteContext();
  const { label, name } = Route.useSearch();

  const [title, setTitle] = useState<string>("Just a new group");
  const [users, setUsers] = useState<Array<string>>([]);
  const [isDone, setIsDone] = useState(false);

  const toggleUser = (pubkey: string) => {
    const arr = users.includes(pubkey)
      ? users.filter((i) => i !== pubkey)
      : [...users, pubkey];
    setUsers(arr);
  };

  const submit = async () => {
    try {
      if (isDone) return history.back();

      const groups = await ark.set_nstore(
        `lume_group_${label}`,
        JSON.stringify(users),
      );

      if (groups) setIsDone(true);
    } catch (e) {
      toast.error(e);
    }
  };

  return (
    <Column.Root>
      <Column.Header label={label} name={name} />
      <Column.Content>
        <div className="flex flex-col gap-5 p-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-medium">
              Name
            </label>
            <input
              name="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nostrichs..."
              className="h-11 rounded-lg border-transparent bg-neutral-100 px-3 placeholder:text-neutral-600 focus:border-blue-500 focus:ring focus:ring-blue-200 dark:bg-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-blue-800"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="inline-flex items-center justify-between">
              <span className="font-medium">Pick user</span>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">{`${users.length} / ∞`}</span>
            </div>
            <div className="flex flex-col gap-2">
              {contacts.map((item: string) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleUser(item)}
                  className="inline-flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                >
                  <User.Provider pubkey={item}>
                    <User.Root className="flex items-center gap-2.5">
                      <User.Avatar className="size-10 rounded-full object-cover" />
                      <div className="flex flex-col items-start">
                        <User.Name className="font-medium" />
                        <User.NIP05 className="text-neutral-700 dark:text-neutral-300" />
                      </div>
                    </User.Root>
                  </User.Provider>
                  {users.includes(item) ? (
                    <CheckCircleIcon className="size-5 text-teal-500" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="fixed z-10 flex items-center justify-center w-full bottom-3">
          <button
            type="button"
            onClick={submit}
            disabled={users.length < 1}
            className="inline-flex items-center justify-center px-4 font-medium text-white transform bg-blue-500 rounded-full active:translate-y-1 w-36 h-11 hover:bg-blue-600 focus:outline-none disabled:cursor-not-allowed"
          >
            {isDone ? "Back" : "Update"}
          </button>
        </div>
      </Column.Content>
    </Column.Root>
  );
}
