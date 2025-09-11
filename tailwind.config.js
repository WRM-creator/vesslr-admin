/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryGreen: "#40E0D0",
        primaryGreenLight: "#B4F3EC",
        bgLightGreen: "#F5FDFC",
        secondaryBlack: "#1A1A1A",
        white: "#FFFFFF",
        textGrey: "#B9B9B9",
        textBlack: "#2B2A2A",
        black: "#141414",
        grey: "#EEF0F7",
        borderGrey: "#E4E7EC",
        grey700: "#344054",
        orange: "#FF912B",
        textGreyLighter: "#98A2B3",
        textBlackLighter: "#383030",
      },
      fontSize: {
        sm: "14px",
        base: "16px",
        md: "18px",
        lg: "20px",
        xl: "32px",
        "2xl": ["40px", "130%"],
        "3xl": ["64px", "125%"],
      },
      fontFamily: {
        "Cals-Sans": "Cals-Sans",
        "Matter-Bold": "Matter-Bold",
        "Matter-Heavy": "Matter-Heavy",
        "Matter-Light": "Matter-Light",
        "Matter-Medium": "Matter-Medium",
        "Matter-Regular": "Matter-Regular",
        "Matter-SemiBold": "Matter-SemiBold",
      },
      borderRadius: {
        10: "10px",
      },
    },
  },
  plugins: [],
};
