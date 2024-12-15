import { Suspense } from "react";
import { AppRouter } from "./providers/router";
import { PageLoader } from "@/widgets/PageLoader";
import "./index.css";

const App = () => {
	return (
		<div>
			<Suspense fallback={<PageLoader />}>
				<AppRouter />
			</Suspense>
		</div>
	);
};

export default App;
