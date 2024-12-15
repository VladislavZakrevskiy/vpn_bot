import { Spinner } from "@telegram-apps/telegram-ui";

export const PageLoader = () => {
	return (
		<div className="w-screen h-screen flex justify-center items-center">
			<Spinner size="l" />
		</div>
	);
};
