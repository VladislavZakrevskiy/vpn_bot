import { PayloadAction } from "@reduxjs/toolkit";
import { TgUser, User, UserSchema } from "../types/User";
import { buildSlice } from "@/shared/lib/store/buildSlice";

const initialState: UserSchema = {
	_inited: false,
	tgUser: null,
	tgInitData: null,
	user: null,
};

const userSlice = buildSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
		},
		setTGUser: (state, action: PayloadAction<TgUser>) => {
			state.tgUser = action.payload;
		},
		setTGInitData: (state, action: PayloadAction<Record<string, string>>) => {
			state.tgInitData = action.payload;
		},
	},
});

export const { reducer: UserReducer, actions: UserActions, useActions: useUserActions } = userSlice;
