import dts from 'bun-plugin-dts'

await Bun.build({
  entrypoints: ['./src/utils.ts'],
  outdir: './dist',
  minify: true,
  plugins: [dts()]
})
