import path from "path";
import { fileURLToPath } from "url";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: {
    main: "./src/index.js",
    "UI/Button/index": "./src/components/ui/Button/index.jsx",
    "Layout/Section/index": "./src/components/layout/Section/index.jsx",
  },
  //Exports ES Modules
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist/components"),
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
  mode: "production",
  optimization: {
    usedExports: true,
    sideEffects: true,
    innerGraph: true,
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css",
    }),
    // new BundleAnalyzerPlugin(),
  ],
  module: {
    rules: [
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
      //This supports SCSS Modules. How does it work :
      //Rule immediately below this applies on filename.module.scss. First SASS is converted to CSS using 'sass-loader' plugin, then that code is ran through css-loader to process SCSS specific keywords like '@import()', 'url()'. Then it is appended to DOM using style-loader or if in production using CSS Extract plugin
      {
        test: /\.module\.scss$/,
        include: path.resolve(__dirname, "./src"),
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
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
          "style-loader",
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
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
