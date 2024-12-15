import { lazy } from "react";

export const LazySettingsPage = lazy(async () => await import("./SettingsPage"));
