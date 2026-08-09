// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       // Forward all non-Vite requests to the Express backend (enables cookie-based auth)
//       '/login': 'http://localhost:3000',
//       '/customers': 'http://localhost:3000',
//       '/products': 'http://localhost:3000',
//       '/inventory': 'http://localhost:3000',
//       '/challan': 'http://localhost:3000',
//     }
//   }
// })
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()]
});