/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", 
            "./app/components/button_components/**/*.{js,jsx,ts,tsx}",
            "./app/components/text_components/**/*.{js,jsx,ts,tsx}",
            "./app/screens/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'ua-blue': '#38B6FF',
        'ua-red': '#FF3131',
        'ua-green': '#7ED957',
      },
      screens: {
        'sm': '640px',
        'md': '768px', 
        'lg': '1024px',
        'xl': '1280px',
      }
    },
  },
  plugins: [],
  corePlugins: {
    aspectRatio: false,
    backdropBlur: false,
    backdropBrightness: false,
    backdropContrast: false,
    backdropGrayscale: false,
    backdropHueRotate: false,
    backdropInvert: false,
    backdropOpacity: false,
    backdropSaturate: false,
    backdropSepia: false,
    backgroundAttachment: false,
    backgroundClip: false,
    backgroundOrigin: false,
    mixBlendMode: false,
    isolation: false,
  }
}
