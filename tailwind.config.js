/** @type {import('tailwindcss').Config} */
export const content = [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
];
export const theme = {
    extend: {
        colors: {
            uptickBlue: "#477BFF",
            uptickWhite: "#FFFFFF",
            uptickNavy: "#000523",
        },
        fontFamily: {
            raleway: ["Raleway", "sans-serif"],
        },
        borderRadius: {
            uptick: "8px",
        },
    },
};
export const plugins = [];
