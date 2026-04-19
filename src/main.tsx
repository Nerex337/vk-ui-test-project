import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/cssm/styles/themes.css';
import { router } from './router.tsx';
import { RouterProvider } from 'react-router-dom';
import { client } from "./client/client.gen.ts";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

client.setConfig({
  baseUrl: "/back",
});

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider>
      <AdaptivityProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router}/>
        </QueryClientProvider>
      </AdaptivityProvider>
    </ConfigProvider>
  </StrictMode>,
);
