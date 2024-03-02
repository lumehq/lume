import { Ark, ArkContext } from "@lume/ark";
import { PropsWithChildren, useMemo } from "react";

export const ArkProvider = ({ children }: PropsWithChildren<object>) => {
  const ark = useMemo(() => new Ark(), []);
  return <ArkContext.Provider value={ark}>{children}</ArkContext.Provider>;
};
