import { animation, keyframes } from "./tw/animations.cjs";
import { twHeight } from "./tw/heights.cjs";
import { twWidth } from "./tw/widths.cjs";
import typographyConf from "./tw/typography.cjs";
import twScrollBar from "tailwind-scrollbar";
import twTypography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const checkered =
  "linear-gradient(45deg, rgba(204, 204, 204, 0.5) 25%, transparent 25%), linear-gradient(135deg, rgba(204, 204, 204, 0.5) 25%, transparent 25%),linear-gradient(45deg, transparent 75%, rgba(204, 204, 204, 0.5) 75%),linear-gradient(135deg, transparent 75%, rgba(204, 204, 204, 0.5) 75%)!important";
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx,json}"],
  theme: {
    fontFamily: {
      arial: ["Arial"],
      dosis: ["Dosis", "Arial", "sans-serif"],
      lexend: ["Lexend", "Arial", "sans-serif"],
      motiva: ["Motiva Sans", "Arial", "sans-serif"],
      times: ["Times New Roman", "Arial", "sans-serif"],
      bernard: ["Bernard MT Condensed"],
    },
    extend: {
      screens: {
        "3xl": "1920px",
        "4xl": "2560px",
        "5xl": "3840px",
      },
      animation: animation,
      keyframes: keyframes,
      backgroundImage: {
        glossy:
          "linear-gradient(to bottom,rgba(255,255,255,.3),rgba(255,255,255,0) 50%,rgba(0,0,0,.12) 51%,rgba(0,0,0,.04))!important",
        stripe:
          "linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent)!important",
        "checkered-xs": checkered,
        "checkered-sm": checkered,
        "checkered-md": checkered,
        "checkered-lg": checkered,
        "checkered-xl": checkered,
        "checkered-2xl": checkered,
        "checkered-3xl": checkered,
        "checkered-4xl": checkered,
        "checkered-5xl": checkered,
      },
      backgroundSize: {
        stripe: "1rem 1rem",
        "checkered-xs": "14px 14px",
        "checkered-sm": "20px 20px",
        "checkered-md": "30px 30px",
        "checkered-lg": "40px 40px",
        "checkered-xl": "50px 50px",
        "checkered-2xl": "60px 60px",
        "checkered-3xl": "70px 70px",
        "checkered-4xl": "80px 80px",
        "checkered-5xl": "90px 90px",
      },
      backgroundPosition: {
        "checkered-xs": "0 0, 7px 0, 7px -7px, 0px 7px",
        "checkered-sm": "0 0, 10px 0, 10px -10px, 0px 10px",
        "checkered-md": "0 0, 15px 0, 15px -15px, 0px 15px",
        "checkered-lg": "0 0, 20px 0, 20px -20px, 0px 20px",
        "checkered-xl": "0 0, 25px 0, 25px -25px, 0px 25px",
        "checkered-2xl": "0 0, 30px 0, 30px -30px, 0px 30px",
        "checkered-3xl": "0 0, 35px 0, 35px -35px, 0px 35px",
        "checkered-4xl": "0 0, 40px 0, 40px -40px, 0px 40px",
        "checkered-5xl": "0 0, 45px 0, 45px -45px, 0px 45px",
      },
      colors: {
        primary: "hsl(var(--color-primary) / <alpha-value>)",
        secondary: "hsl(var(--color-secondary) / <alpha-value>)",
        accent: "hsl(var(--color-accent) / <alpha-value>)",

        background: "hsl(var(--color-background) / <alpha-value>)",
        "page-background": "hsl(var(--color-page-background) / <alpha-value>)",
        "background-accent":
          "hsl(var(--color-background-accent) / <alpha-value>)",
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",
        dark: "hsl(var(--color-dark) / <alpha-value>)",
        light: "hsl(var(--color-light) / <alpha-value>)",

        positive: "hsl(var(--color-positive) / <alpha-value>)",
        negative: "hsl(var(--color-negative) / <alpha-value>)",
        info: "hsl(var(--color-info) / <alpha-value>)",
        warning: "hsl(var(--color-warning) / <alpha-value>)",
      },
      height: twHeight,
      maxHeight: twHeight,
      minHeight: twHeight,
      width: twWidth,
      minWidth: twWidth,
      maxWidth: twWidth,
      typography: typographyConf,
    },
  },
  safelist: [
    {
      pattern:
        /-(primary|secondary|accent|dark|light|background|foreground|background-accent|page-background|positive|negative|info|warning)/,
    },
  ],
  plugins: [twScrollBar({ nocompatible: true }), twTypography],
};
