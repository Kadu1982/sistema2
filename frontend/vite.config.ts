import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5011, // Mantém a porta do frontend
    proxy: {
      // Redireciona requisições de /api para o backend Spring Boot
      '/api': {
        target: 'http://localhost:8080', // A porta do seu backend
        changeOrigin: true, // Necessário para o proxy de origem cruzada
        secure: false,      // Não é necessário SSL em desenvolvimento
      },
    },
  },
})