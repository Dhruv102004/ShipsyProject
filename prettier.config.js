/** @type {import('prettier').Config} */
module.exports = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindAttributes: ["theme"],
  tailwindFunctions: ["twMerge", "createTheme"],
};
