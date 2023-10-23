"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  transpileDependencies: true,
  devServer: {
    host: "0.0.0.0",
    port: 889,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      ["/contest/myadmin"]: {
        target: `http://localhost:8183/contest/myadmin`,
        changeOrigin: true,
        pathRewrite: {
          ["^" + "/contest/myadmin"]: "",
        },
      },
    },
    historyApiFallback: true,
    allowedHosts: "all",
  },
  configureWebpack: {
    name: "sys-web",
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
};
