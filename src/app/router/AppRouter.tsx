import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/app/router/routes'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
