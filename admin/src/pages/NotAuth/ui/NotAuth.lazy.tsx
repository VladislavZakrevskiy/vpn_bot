import { lazy } from "react";

export const LazyNotAuth = lazy(async () => await import("./NotAuth"));
