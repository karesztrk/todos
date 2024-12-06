import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

export default defineConfig({
	server: {
		host: true
	},
	plugins: [sveltekit()],
	css: {
		transformer: 'lightningcss',
		lightningcss: {
			targets: browserslistToTargets(browserslist('>0.3%, last 2 versions, not dead'))
		}
	},
	build: {
		cssMinify: 'lightningcss'
	}
});
