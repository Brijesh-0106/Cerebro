import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        colors: {
            'blue': 'rgb(112, 184, 255)',
            'orange': 'rgb(251, 173, 96)',
        },
        extend: {
            keyframes: {
                shimmer: {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(100%)" },
                },
            },
            animation: {
                shimmer: "shimmer 1.5s infinite linear",
            },
        },
    },
    plugins: [],
};

export default config;
