// windi.config.ts
import { defineConfig } from 'vite-plugin-windicss'

export default defineConfig({
    darkMode: 'class', // 常用配置
    theme: {
        extend: {
            colors: {
                'brand':{
                    500: '#71c9ce', // 最深，适合做主按钮、标题
                    400: '#a6e3e9', // 次深，适合做悬浮态 (hover)
                    300: '#cbf1f5', // 浅色，适合做边框、次要卡片背景
                    200: '#e3fdfd', // 最浅，适合做全站大背景
                }
            },
        },
    },
})