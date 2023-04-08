import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite' // 不加这个配置，ElMessage出不来

// https://vitejs.dev/config/
// export default ({ mode }) => defineConfig({
export default defineConfig({
  plugins: [
    vue(),
    // 按需引入，主题色的配置，需要加上 importStyle: 'sass'
    Components({
      resolvers: [ElementPlusResolver({
        importStyle: 'sass'
      })],
    }),
    ElementPlus()
  ],
  build:{
    minify: 'terser',
    terserOptions: {
      compress: {
          //生产环境时移除console.log()
          drop_console: true,
          drop_debugger: true,
      },
    },
    rollupOptions: {
      external: [
        '/static/back-light.png',
        '/static/back-dark.jpg'
      ]
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    },
  },
  base: './',
  server: {
    proxy: {
      '/midas': {
        // 测试环境
        target: 'http://test.kmahjz.com.cn', // 接口域名
        changeOrigin: true, //是否跨域
        pathRewrite: {
          "^/api": "",
        },
        onProxyReq: function (proxyReq, req, res, options) {
          if (req.body) {
            let bodyData = JSON.stringify(req.body);
            // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
            proxyReq.setHeader("Content-Type", "application/json");
            proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
            // stream the content
            proxyReq.write(bodyData);
          }
        },
      },
      '/static': 'http://test.kmahjz.com.cn',
      '/upload': 'http://test.kmahjz.com.cn',
    },
    watch: {
      usePolling: true
    }
  },
  css: {
    preprocessorOptions: {
      // 覆盖掉element-plus包中的主题变量文件
      scss: {
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
})
