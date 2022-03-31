import path from "path";
import { fileURLToPath } from "url";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
// import nodeExternals from "webpack-node-externals";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// const isDevelopment = process.env.ENV === "dev";
const isDevelopment = true;

console.log({ process: process.env.ENV });
export default {
  entry: "./src/index.js",
  // externals: [nodeExternals()], //Note: This turns files to CJS. Take care of it later
  //Exports ES Modules
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist/esm"),
    // libraryTarget: "esm",
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  //Exports commonjs
  // output: {
  //   filename: "index.js",
  //   path: path.resolve(__dirname, "dist/cjs"),
  //   libraryTarget: "commonjs",
  // },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isDevelopment ? "[name].css" : "[name].[hash].css",
      chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
    }),
  ],
  module: {
    rules: [
      // {
      //   test: /\.(js|jsx)$/,
      //   exclude: /node_modules/,
      //   use: ["babel-loader"],
      // },
      // {
      //   test: /\.scss$/,
      //   use: ["style-loader", "css-loader", "sass-loader"],
      //   include: path.resolve(__dirname, "./src"),
      // },
      {
        //Processes JSX and for some getting cannot process scss error NOTE: To be debugged later
        test: /\.jsx/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-react"],
          },
        },
      },
      //This supports SCSS Modules. How does it word :
      //Rule immediately below this applies on filename.module.scss. First SASS is converted to CSS using 'sass-loader' plugin, then that code is ran through css-loader to process SCSS specific keywords like '@import()', 'url()'. Then it is appended to DOM using style-loader or if in production using CSS Extract plugin
      {
        test: /\.module\.scss$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
      //In here we are doing pretty much the same as above but we just don't transform class names.
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, "./src"),
        exclude: /\.module.(scss)$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDevelopment,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".scss"],
  },
};
