import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routeConfig } from './App.tsx';
import { Providers } from './configs/NextUIProvider.tsx';
import './index.css';

const router = createBrowserRouter(routeConfig);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
