import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: { ...colors.orange },
      },
    },
  },
  plugins: [],
};

export default config;
