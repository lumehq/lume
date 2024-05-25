import { NostrEvent } from "@lume/types";

export function dedupEvents(nostrEvents: NostrEvent[], nsfw: boolean = false) {
  const seens = new Set<string>();
  const events = nostrEvents.filter((event) => {
    const eTags = event.tags.filter((el) => el[0] === "e");
    const ids = eTags.map((item) => item[1]);
    const isDup = ids.some((id) => seens.has(id));

    // Add found ids to seen list
    for (const id of ids) {
      seens.add(id);
    }

    // Filter NSFW event
    if (nsfw) {
      const wTags = event.tags.filter((t) => t[0] === "content-warning");
      const isLewd = wTags.length > 0;

      return !isDup && !isLewd;
    }

    // Filter duplicate event
    return !isDup;
  });

  return events;
}
