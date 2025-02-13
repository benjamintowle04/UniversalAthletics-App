/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", 
            "./app/components/button_components/**/*.{js,jsx,ts,tsx}",
            "./app/components/text_components/**/*.{js,jsx,ts,tsx}",
            "./app/screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}

