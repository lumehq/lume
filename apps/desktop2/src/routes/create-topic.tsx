import { CheckCircleIcon } from "@lume/icons";
import type { ColumnRouteSearch, Topic } from "@lume/types";
import { Spinner } from "@lume/ui";
import { TOPICS } from "@lume/utils";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/create-topic")({
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
  const { label, redirect } = Route.useSearch();
  const { ark } = Route.useRouteContext();

  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = Route.useNavigate();

  const toggleTopic = (topic: Topic) => {
    setTopics((prev) =>
      prev.find((item) => item.title === topic.title)
        ? prev.filter((i) => i.title !== topic.title)
        : [...prev, topic],
    );
  };

  const submit = async () => {
    try {
      setIsLoading(true);

      const key = `lume_topic_${label}`;
      const createTopic = await ark.set_nstore(key, JSON.stringify(topics));

      if (createTopic) {
        return navigate({ to: redirect });
      }
    } catch (e) {
      setIsLoading(false);
      toast.error(String(e));
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="text-center flex flex-col items-center justify-center">
        <h1 className="text-2xl font-serif font-medium">
          What are your interests?
        </h1>
        <p className="leading-tight text-neutral-700 dark:text-neutral-300">
          Add some topics you want to focus on.
        </p>
      </div>
      <div className="w-4/5 max-w-full flex flex-col gap-3">
        <div className="w-full h-9 shrink-0 flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-lg px-3">
          <span className="text-sm font-medium">Added: {topics.length}</span>
        </div>
        <div className="overflow-y-auto scrollbar-none p-2 shrink-0 w-full h-[450px] bg-black/5 dark:bg-white/5 backdrop-blur-lg rounded-xl">
          <div className="flex flex-col gap-3">
            {TOPICS.map((topic) => (
              <button
                key={topic.title}
                onClick={() => toggleTopic(topic)}
                className="h-11 px-3 flex items-center justify-between bg-white dark:bg-black/20 backdrop-blur-lg border border-transparent hover:border-blue-500 rounded-lg shadow-primary dark:ring-1 ring-neutral-800/50"
              >
                <div className="inline-flex items-center gap-1">
                  <div>{topic.icon}</div>
                  <div className="text-sm font-medium">
                    <span>{topic.title}</span>
                    <span className="ml-1 italic text-neutral-400 dark:text-neutral-600 font-normal">
                      {topic.content.length} hashtags
                    </span>
                  </div>
                </div>
                {topics.find((item) => item.title === topic.title) ? (
                  <CheckCircleIcon className="text-teal-500 size-4" />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => submit()}
        disabled={isLoading || topics.length < 1}
        className="inline-flex items-center justify-center w-36 rounded-full h-9 bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? <Spinner /> : "Confirm"}
      </button>
    </div>
  );
}
