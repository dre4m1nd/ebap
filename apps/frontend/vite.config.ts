import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCss from 'vite-plugin-windicss'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        WindiCss()
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@ebap/shared': path.resolve(__dirname, '../../packages/shared/src'),
        }
    },
    server: {
        open: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                rewrite:(path: string): string => path.replace(/^\/api/,'')
            }
        }
    }
})
