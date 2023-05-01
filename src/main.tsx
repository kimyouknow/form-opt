import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import CustomForm from 'src/form/CustomForm'
import RHF from 'src/form/RHF/index.tsx'
import App from './App.tsx'
import './index.css'

const routes = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <CustomForm />,
      },
      {
        path: '/rhf',
        element: <RHF />,
      },
    ],
  },
]

const router = createBrowserRouter(routes, {
  basename: '/form-opt/',
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
