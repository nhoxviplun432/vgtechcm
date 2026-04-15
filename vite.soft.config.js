/**
 * Vite config cho soft assets
 * - Input  : resources/soft/js/**  và  resources/soft/css/**
 * - Output : public/js/            và  public/css/
 *
 * Build riêng, không dùng laravel-vite-plugin để tránh ràng buộc buildDirectory.
 * Chạy: npm run build:soft   hoặc cùng lúc với: npm run build
 */

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve, basename, extname } from 'path';
import { readdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

// Windows-safe: dùng fileURLToPath thay vì .pathname trực tiếp
const root = fileURLToPath(new URL('.', import.meta.url));

// Thu thập tất cả file entry trong resources/soft/
function collectEntries() {
    const entries = {};

    const map = [
        { dir: 'resources/soft/js',  exts: ['.js', '.ts'],  out: 'js'  },
        { dir: 'resources/soft/css', exts: ['.css'],         out: 'css' },
    ];

    for (const { dir, exts, out } of map) {
        if (!existsSync(dir)) continue;

        readdirSync(dir)
            .filter(f => exts.includes(extname(f)))
            .forEach(f => {
                // key = "js/app" hoặc "css/app" → dùng làm output path
                const name = basename(f, extname(f));
                entries[`${out}/${name}`] = resolve(root, dir, f);
            });
    }

    return entries;
}

const entries = collectEntries();

// Nếu không có file nào thì bỏ qua (tránh lỗi Rollup)
const rollupInput = Object.keys(entries).length > 0 ? entries : { _placeholder: resolve(root, 'resources/js/bootstrap.js') };

export default defineConfig({
    plugins: [
        tailwindcss(),
    ],

    // Tắt publicDir để tránh warning "outDir và publicDir trùng nhau"
    publicDir: false,

    build: {
        // Output thẳng vào public/ (không qua build/)
        outDir: 'public',
        emptyOutDir: false, // tuyệt đối không xóa public/

        rollupOptions: {
            input: rollupInput,
            output: {
                // JS entry key = "js/app" → entryFileNames "[name].js" → public/js/app.js
                entryFileNames: '[name].js',
                chunkFileNames: 'js/chunks/[name].js',

                // assetFileNames: [name] với CSS entry đã chứa sẵn prefix từ key
                // VD: key "css/app" → [name] = "css/app" → trả về "[name][extname]" = "css/app.css" → public/css/app.css
                // KHÔNG thêm "css/" thủ công để tránh double: css/css/app.css
                assetFileNames: (assetInfo) => {
                    const src = assetInfo.originalFileNames?.[0] ?? '';
                    if (src.includes('resources/soft') && assetInfo.name?.endsWith('.css')) {
                        // Key đã có prefix "css/" → chỉ cần [name][extname]
                        return '[name][extname]';
                    }
                    if (assetInfo.name?.endsWith('.css')) return 'css/[name][extname]';
                    return 'assets/[name][extname]';
                },
            },
        },
    },
});
