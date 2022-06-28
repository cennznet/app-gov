const { join } = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"),
		join(__dirname, "./libs/components/**/*.{js,ts,jsx,tsx}"),
		join(__dirname, "./libs/assets/**/*.svg"),
	],
	theme: {
		fontFamily: {
			display: ["apotek", "sans-serif"],
			body: ["gopher", "sans-serif"],
		},

		extend: {
			colors: {
				hero: "#9847FF",
				mid: "#E4D1FF",
				light: "#F5ECFF",
				dark: "#430B8A",
			},
			fontFamily: {
				sans: ["gopher", ...defaultTheme.fontFamily.sans],
			},
			boxShadow: {
				"sharp": "4px 4px 0px 0px",
				"sharp-2": "2px 2px 0px 0px",
			},
		},
	},
	plugins: [],
};
