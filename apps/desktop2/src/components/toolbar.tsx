import { ReactNode } from "@tanstack/react-router";
import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Toolbar({ children }: { children: ReactNode }) {
  const [domReady, setDomReady] = useState(false);

  useLayoutEffect(() => {
    setDomReady(true);
  }, []);

  return domReady
    ? createPortal(children, document.getElementById("toolbar"))
    : null;
}
