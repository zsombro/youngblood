import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    build: {
        sourcemap: true,
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
            formats: ['es'],
            fileName: (): string => 'youngblood.mjs',
        },
        rollupOptions: {
            external: ['matter-js'],
        },
    },
    plugins: [
        dts({
            outDir: 'dist',
            tsconfigPath: resolve(__dirname, 'tsconfig.build.json'),
        }),
    ],
});