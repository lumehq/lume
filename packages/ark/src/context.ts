import { createContext } from "react";
import { type Ark } from "./ark";

export const ArkContext = createContext<Ark | null>(undefined);
