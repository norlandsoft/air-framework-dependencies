import {defineConfig} from "umi";

export default defineConfig({
  dva: {},
  mfsu: false,
  title: 'AirPro',
  links: [
    {id: 'theme', rel: 'stylesheet', type: 'text/css'},
    {rel: 'shortcut icon', href: '/favicon.svg'}
  ],
  routes: [
    {
      path: "/",
      component: "@/layouts/SecurityLayout"
    },
    {
      path: "*",
      component: "@/layouts/Error404"
    }
  ],

  proxy: {
    "/ws": {
      target: "http://localhost:9800",
      changeOrigin: true,
      ws: true,
    },
    "/rest": {
      target: "http://localhost:9800",
      changeOrigin: true,
      pathRewrite: {"^": ""},
      'onProxyRes': function (proxyRes, req, res) {
        proxyRes.headers['Content-Encoding'] = 'chunked';
      }
    },
    "/admin": {
      target: "http://localhost:9800",
      changeOrigin: true,
      pathRewrite: { "^": "" },
    },
    "/initialAdminPassword": {
      target: "http://localhost:9800",
      changeOrigin: true,
      pathRewrite: { "^": "" },
    },
    "/api": {
      target: "http://localhost:9800",
      changeOrigin: true,
      'onProxyRes': function (proxyRes, req, res) {
        proxyRes.headers['Content-Encoding'] = 'chunked';
      }
    }
  },

  codeSplitting: {
    jsStrategy: 'granularChunks',
  },

  hash: true,
  esbuildMinifyIIFE: true,
  base: "/",
  chainWebpack: config => {
    config.resolve.extensions.merge(['.mjs']);
    config.module.rule('mjs-strict').test(/\.mjs$/).resolve.set('fullySpecified', false);
  }
});
