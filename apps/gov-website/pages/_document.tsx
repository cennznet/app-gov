import { Html, Head, Main, NextScript } from "next/document";
import { FC } from "react";

const NextDocument: FC = () => {
	return (
		<Html>
			<Head>
				<meta name="description" content="CENNZnet Governance" />
				<link
					rel="stylesheet"
					type="text/css"
					href="https://use.typekit.net/sxj0edc.css"
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default NextDocument;
