import { FC, ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserActions } from "../model/slice/userSlice";
import { useAppSelector } from "@/shared/lib/hooks";
import { tg } from "@/shared/consts/tg";
import { TgUser } from "../model/types/User";
import { USER_ACCESS_TOKEN } from "@/shared/consts/localStorage";
import { Spinner } from "@telegram-apps/telegram-ui";

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const { setTGUser, setTGInitData } = useUserActions();
	const { tgInitData } = useAppSelector((state) => state.user);
	const nav = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		const authUser = async () => {
			try {
				setIsLoading(true);

				if (tgInitData) {
					setIsLoading(false);
					setIsAuth(true);
					return;
				}
				const params = new URLSearchParams(tg.initData);
				const initDataObj: Record<string, string> = {};
				for (const [key, value] of params.entries()) {
					initDataObj[key] = value;
				}
				const hash = initDataObj.hash as string;

				setTGInitData(initDataObj);
				setTGUser(JSON.parse(initDataObj.user || "{}") as TgUser);

				delete initDataObj.hash;
				const dataCheckString = Object.keys(initDataObj)
					.sort()
					.map((key) => `${key}=${initDataObj[key]}`)
					.join("\n");

				const res = await axios.post(import.meta.env.VITE_API + "/auth/hash", { dataCheckString });
				const calculatedHash = res.data as {
					hash: string;
					access_token: string;
					refresh_token: string;
				};

				if (calculatedHash.hash === hash) {
					setIsLoading(false);
					localStorage.setItem(USER_ACCESS_TOKEN, calculatedHash.access_token);
					setIsAuth(true);
				} else {
					setIsLoading(false);
					setIsAuth(false);
					nav("/not-auth");
				}
			} catch (e) {
				alert(e);
				setIsLoading(false);
				setIsAuth(false);
				nav("/not-auth");
			}
		};
		authUser();
	}, []);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center w-screen h-screen">
				<Spinner size="m" />
			</div>
		);
	}

	if (isAuth) {
		return children;
	}
};
