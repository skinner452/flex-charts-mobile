import pluginJs from "@eslint/js";
import pluginTs from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactNative from "eslint-plugin-react-native";
import pluginReactHooks from "eslint-plugin-react-hooks";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...pluginTs.configs.recommended,
  {
    plugins: {
      "react-native": pluginReactNative,
    },
    rules: pluginReactNative.configs.all.rules,
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },

  {
    // Override some rules
    rules: {
      "react-native/no-inline-styles": "off",
      "react-native/no-raw-text": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
