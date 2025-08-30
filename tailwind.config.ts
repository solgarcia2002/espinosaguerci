import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"        
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          negro: "#000000",
          blanco: "#ffffff",
          gris: {
            50: "#fafafa",
            100: "#f5f5f5",
            200: "#e5e5e5",
            300: "#d4d4d4",
            400: "#a3a3a3",
            500: "#737373",
            600: "#525252",
            700: "#404040",
            800: "#262626",
            900: "#171717"
          },
          rojo: "#d73c3c"
        }
      },
      fontFamily: {
        brand: ["Inter", "Montserrat", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 8px 30px rgba(0,0,0,0.06)"
      }
    }
  },
  plugins: []
};
export default config;
