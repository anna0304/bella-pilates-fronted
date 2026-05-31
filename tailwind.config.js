/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      colors: {
        primary: "#C48B5B",
        primaryHover: "#B1794B",

        secondary: "#F6EFE8",
        background: "#F3E8DE",

        surface: "#FFFFFF",

        textPrimary: "#3B2A22",
        textSecondary: "#6E5C50",

        borderColor: "#EADFD6",
        muted: "#B8A89C",

        success: "#4E7C46",
        successHover: "#3F6639",
        successBg: "#EAF4E7",

        danger: "#D93B21",
        dangerHover: "#B9301A",
        dangerBg: "#FDEBE7",
      },

      fontFamily: {
        sans: ["Outfit", "sans-serif"],
      },

      borderRadius: {
        section: "48px",
        card: "32px",
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.04)",
      },

      maxWidth: {
        container: "1280px",
      },
    },
  },

  plugins: [],
};