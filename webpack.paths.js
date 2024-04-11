const path = require("path");

const rootPath = path.resolve(__dirname, "../"); // Adjust '../' based on your directory structure
const srcRendererPath = path.join(rootPath, "src", "renderer"); // Example path to your renderer source

module.exports = {
  rootPath,
  srcRendererPath,
};
