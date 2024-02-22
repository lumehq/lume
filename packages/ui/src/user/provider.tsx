import { useArk } from "@lume/ark";
import { Metadata } from "@lume/types";
import { useQuery } from "@tanstack/react-query";
import { ReactNode, createContext, useContext } from "react";

const UserContext = createContext<{ pubkey: string; profile: Metadata }>(null);

export function UserProvider({
  pubkey,
  children,
  embed,
}: {
  pubkey: string;
  children: ReactNode;
  embed?: string;
}) {
  const ark = useArk();
  const { data: profile } = useQuery({
    queryKey: ["user", pubkey],
    queryFn: async () => {
      if (embed) return JSON.parse(embed) as Metadata;
      try {
        const profile: Metadata = await ark.get_profile(pubkey);
        return profile;
      } catch (e) {
        throw new Error(e);
      }
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    retry: 2,
  });

  return (
    <UserContext.Provider value={{ pubkey, profile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  return context;
}
