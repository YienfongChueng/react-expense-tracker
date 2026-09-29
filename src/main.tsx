import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import type { Root } from 'react-dom/client'   
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { unstableSetRender } from 'antd-mobile'

// ✅ 创建一个 client 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,     // 30s 内不重新请求
      retry: 1,                 // 失败重试 1 次
    },
  },
})

type PatchedContainer = HTMLElement & { _reactRoot?: Root }  

  unstableSetRender((node, container) => {
    const el = container as PatchedContainer     
    el._reactRoot ||= createRoot(el)
    const root = el._reactRoot
    root.render(node)
    return async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
      root.unmount()
    }
  })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    
  </StrictMode>,
)
