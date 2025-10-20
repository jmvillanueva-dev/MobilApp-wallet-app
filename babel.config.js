// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // Plugin 1: module-resolver con su configuración
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@": "./",
          },
        },
      ],

      // Plugin 2: reanimated debe ser un elemento separado y el último
      "react-native-reanimated/plugin",
    ],
  };
};
