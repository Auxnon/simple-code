import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		rollupOptions: {
			external: ['silt-lua']
		}
	},
	optimizeDeps: {
		exclude: ['silt-lua']
	}
});
