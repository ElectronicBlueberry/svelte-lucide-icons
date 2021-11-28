import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';

import pkg from './package/package.json';

const name = pkg.name;

export default {
	input: './package/mod/index.js',
	output: [
		{ file: './package/index.mjs', 'format': 'es' },
		{ file: './package/index.js', 'format': 'umd', name }
	],
	plugins: [
		svelte(),
		resolve(),
		terser()
	]
};
