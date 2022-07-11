import type { NextPage } from "next";

import { Header, Layout } from "@app-gov/web/components";

const Home: NextPage = () => {
	return (
		<Layout.PageWrapper>
			<Header />
		</Layout.PageWrapper>
	);
};

export default Home;
