const { join } = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"),
		join(__dirname, "../../libs/web/components/**/*.{js,ts,jsx,tsx}"),
		join(__dirname, "../../libs/web/vectors/**/*.svg"),
	],
	theme: {
		extend: {
			colors: {
				hero: "#9847FF",
				mid: "#E4D1FF",
				light: "#F5ECFF",
				dark: "#430B8A",
			},
			fontFamily: {
				sans: ["gopher", ...defaultTheme.fontFamily.sans],
				display: ["apotek", "sans-serif"],
				body: ["gopher", "sans-serif"],
			},
			boxShadow: {
				"sharp": "4px 4px 0px 0px",
				"sharp-2": "2px 2px 0px 0px",
				"sharp-7": "7px 7px 0px 0px",
			},
		},

		fluidType: {
			settings: {
				fontSizeMin: 0.875, // 0.875rem === 14px
				fontSizeMax: 1, // 1rem === 16px
				ratioMin: 1, // Multiplicator Min
				ratioMax: 1.2, // Multiplicator Max
				screenMin: 20, // 20rem === 320px
				screenMax: 96, // 96rem === 1536px
				unit: "rem", // default is rem but it's also possible to use 'px'
				prefix: "", // set a prefix to use it alongside the default font sizes
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-fluid-type"),
	],
};
