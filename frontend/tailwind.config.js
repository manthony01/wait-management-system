/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("daisyui"),
    require("@tailwindcss/typography"),
  ],
  theme: {
    extend: {
      colors: {
        light: {
          accent1: "#E1ECF9",
          accent2: "#FF936C",
          accent3: "#7878C1",
          accent4: "#C387C2",
          background: "#FFFFFE",
          buttonPrimary: "#3061A0",
          buttonSecondary: "#3061A0",
          foreground: "#F3F3F3",
          textPrimary: "#000000",
          textSecondary: "#333333",
          warning: "#ffcc00",
          danger: "#cc3300",
        },
        dark: {
          accent1: "#f4254e",
          accent2: "#e9ba00",
          accent3: "#009ccf",
          accent4: "#00bec3",
          background: "#1E1E1E",
          buttonPrimary: "#4C4C4C",
          buttonSecondary: "#666666",
          foreground: "#333333",
          textPrimary: "#FFFFFF",
          textSecondary: "#CCCCCC",
        },
      },
      backgroundImage: {
        "dinner-pattern": "url('/src/assets/home-dinner.jpg')",
      },
    },
  },
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
