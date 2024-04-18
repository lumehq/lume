import { ColumnRouteSearch } from "@lume/types";
import { Column } from "@lume/ui";
import { TOPICS, cn } from "@lume/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const Route = createFileRoute("/interests")({
  validateSearch: (search: Record<string, string>): ColumnRouteSearch => {
    return {
      account: search.account,
      label: search.label,
      name: search.name,
    };
  },
  component: Screen,
});

function Screen() {
  const { t } = useTranslation();
  const { label, name, redirect } = Route.useSearch();
  const { ark } = Route.useRouteContext();

  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isDone, setIsDone] = useState(false);

  const router = useRouter();

  const toggleHashtag = (item: string) => {
    const arr = hashtags.includes(item)
      ? hashtags.filter((i) => i !== item)
      : [...hashtags, item];
    setHashtags(arr);
  };

  const toggleAll = (item: string[]) => {
    const sets = new Set([...hashtags, ...item]);
    setHashtags([...sets]);
  };

  const submit = async () => {
    try {
      if (isDone) {
        return router.history.push(redirect);
      }

      const eventId = await ark.set_interest(undefined, undefined, hashtags);
      if (eventId) {
        setIsDone(true);
        toast.success("Interest has been updated successfully.");
      }
    } catch (e) {
      toast.error(String(e));
    }
  };

  return (
    <Column.Root>
      <Column.Header label={label} name={name} />
      <Column.Content>
        <div className="sticky left-0 top-0 flex h-16 w-full items-center justify-between border-b border-neutral-100 bg-white px-3 dark:border-neutral-900 dark:bg-black">
          <div className="flex flex-1 flex-col">
            <h3 className="font-semibold">Interests</h3>
            <p className="text-sm leading-tight text-neutral-700 dark:text-neutral-300">
              Pick things you'd like to see.
            </p>
          </div>
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-8 w-20 items-center justify-center rounded-full bg-blue-500 px-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isDone ? t("global.back") : t("global.update")}
          </button>
        </div>
        <div className="flex w-full flex-col p-3">
          <div className="flex flex-col gap-8">
            {TOPICS.map((topic) => (
              <div key={topic.title} className="flex flex-col gap-4">
                <div className="flex w-full items-center justify-between">
                  <div className="inline-flex items-center gap-2.5">
                    <img
                      src={topic.icon}
                      alt={topic.title}
                      className="size-8 rounded-lg object-cover"
                    />
                    <h3 className="text-lg font-semibold">{topic.title}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleAll(topic.content)}
                    className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {t("interests.followAll")}
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {topic.content.map((hashtag) => (
                    <button
                      key={hashtag}
                      type="button"
                      onClick={() => toggleHashtag(hashtag)}
                      className={cn(
                        "inline-flex items-center rounded-full border border-transparent bg-neutral-100 px-2 py-1 text-sm font-medium dark:bg-neutral-900",
                        hashtags.includes(hashtag)
                          ? "border-blue-500 text-blue-500"
                          : "",
                      )}
                    >
                      {hashtag}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Column.Content>
    </Column.Root>
  );
}
