import { FC, ReactNode } from "react";
import { AppRoot } from "@telegram-apps/telegram-ui";

interface ThemeProviderProps {
	children?: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
	return <AppRoot>{children}</AppRoot>;
};
