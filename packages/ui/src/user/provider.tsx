import { useProfile } from "@lume/ark";
import { Metadata } from "@lume/types";
import { ReactNode, createContext, useContext } from "react";

const UserContext = createContext<{
  pubkey: string;
  isError: boolean;
  isLoading: boolean;
  profile: Metadata;
}>(null);

export function UserProvider({
  pubkey,
  children,
}: {
  pubkey: string;
  children: ReactNode;
}) {
  const { isLoading, isError, profile } = useProfile(pubkey);

  return (
    <UserContext.Provider value={{ pubkey, isError, isLoading, profile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  return context;
}
