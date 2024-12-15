import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UserReducer } from "@/entities/User";
import { rtkApi } from "@/shared/api/rtkApi";

export const createReduxStore = () => {
	const rootReducers = combineReducers({
		user: UserReducer,
		[rtkApi.reducerPath]: rtkApi.reducer,
	});

	const store = configureStore({
		reducer: rootReducers,
		devTools: __IS_DEV__,
		middleware: (getDefaultMiddleware) => getDefaultMiddleware({}).concat(rtkApi.middleware),
	});

	return store;
};

export type AppDispatch = ReturnType<typeof createReduxStore>["dispatch"];
export type AppState = ReturnType<ReturnType<typeof createReduxStore>["getState"]>;
