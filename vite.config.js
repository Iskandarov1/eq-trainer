import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Browsers block <script type="module"> and crossorigin-marked assets on
// file:// (origin 'null' fails their CORS check), and dist/index.html must
// keep working when opened from disk. The single bundle contains no
// import/export/import.meta (enforced: no dynamic imports, no manualChunks),
// so it is safe to load as a classic deferred script instead.
const fileProtocolClassicScript = {
  name: 'file-protocol-classic-script',
  transformIndexHtml(html) {
    return html
      .replace('<script type="module" crossorigin', '<script defer')
      .replace(/(<link rel="stylesheet") crossorigin/, '$1')
  },
}

export default defineConfig({
  plugins: [react(), fileProtocolClassicScript],
  base: './',
})
