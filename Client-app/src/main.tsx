import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-datepicker/dist/react-datepicker.css'
import './app/layout/index.css'
import './app/layout/App.css'
import { store, StoreContext } from './app/stores/Store.ts'
import { RouterProvider } from 'react-router'
import Routes from './app/router/Routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreContext.Provider value={store}>
      <RouterProvider router={Routes} />
    </StoreContext.Provider>
  </StrictMode>,
)
