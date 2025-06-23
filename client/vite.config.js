import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,       // ポート番号を3000に指定
    open: true,       // 起動時にブラウザを自動で開く（お好みで）
  },
})
