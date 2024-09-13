import React from 'react';
import { NextUIProvider } from '@nextui-org/react';
import TanStackProvider from './TanStackProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanStackProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </TanStackProvider>
  );
}
