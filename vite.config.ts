import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from 'path'

export default defineConfig({
    base: '/',
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: path.resolve(__dirname, './webtoons/!db'),
                    dest: './'
                }
            ]
        })
    ]
})
