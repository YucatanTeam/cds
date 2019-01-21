import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

const pages = [
	'admin'
	// 'index'
	// 'user'
]

const production = !process.env.ROLLUP_WATCH;

var ps = [];
for(var page of pages) {
	ps.push({
		input: `ui/${page}/main.js`,
		output: {
			sourcemap: true,
			format: 'iife',
			name: 'app',
			file: `www/${page}/bundle.js`
		},
		plugins: [
			svelte({
				skipIntroByDefault: true,
				nestedTransitions: true,
				dev: !production,
				css: css => {
					css.write(`www/${page}/bundle.css`);
				}
			}),
			resolve(),
			commonjs(),
			production && terser()
		]
	})
}

export default ps