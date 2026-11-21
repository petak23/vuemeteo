import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import globals from 'globals'

export default [
	{
		ignores: ['dist/**', 'dist-ssr/**', 'coverage/**', 'node_modules/**']
	},
	js.configs.recommended,
	...pluginVue.configs['flat/essential'],
	skipFormatting,
	{
		files: ['**/*.{js,mjs,cjs,vue}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	}
]
