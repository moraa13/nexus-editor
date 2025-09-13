import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Bundle splitting and optimization
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['lucide-react'],
          'flow-vendor': ['reactflow'],
          
          // Feature chunks
          'adventure': [
            './src/components/adventure/AdventureLayout',
            './src/components/adventure/DiscordSidebar',
            './src/components/adventure/AdventureMap',
            './src/components/adventure/InventoryPanel',
            './src/components/adventure/AchievementsPanel'
          ],
          'dialogue': [
            './src/components/dialogue/DialogueConstructor',
            './src/components/dialogue/DialogueCanvas',
            './src/components/dialogue/DialogueNodeComponent',
            './src/components/dialogue/SkillCheckNodeComponent',
            './src/components/dialogue/NarrativeNodeComponent'
          ],
          'ui': [
            './src/components/ui/Badge',
            './src/components/ui/XPBar',
            './src/components/ui/InventorySlot',
            './src/components/ui/ServerIcon',
            './src/components/ui/SimpleToast',
            './src/components/ui/PerformanceMonitor'
          ],
          'utils': [
            './src/utils/performanceTest',
            './src/hooks/useIntersectionObserver',
            './src/hooks/useDebounce'
          ]
        }
      }
    },
    
    // Chunk size optimization
    chunkSizeWarningLimit: 1000,
    
    // Source maps for debugging
    sourcemap: true,
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    }
  },
  
  // Development server optimization
  server: {
    host: '0.0.0.0',
    port: 5181,
    hmr: {
      overlay: false,
      port: 5181,
      clientPort: 5181
    }
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@/components': resolve(__dirname, 'src/components'),
      '@/hooks': resolve(__dirname, 'src/hooks'),
      '@/utils': resolve(__dirname, 'src/utils'),
      '@/types': resolve(__dirname, 'src/types'),
      '@/workers': resolve(__dirname, 'src/workers')
    }
  },
  
  // CSS optimization
  css: {
    devSourcemap: true
  },
  
  // Worker configuration
  worker: {
    format: 'es'
  }
})
