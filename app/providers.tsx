// app/providers.tsx
// 'use client';

// import { SessionProvider } from 'next-auth/react';
// import { ReactNode } from 'react';

// type ProvidersProps = {
//   children: ReactNode;
// };

// export default function Providers({ children }: ProvidersProps) {
//   return <SessionProvider>{children}</SessionProvider>;
// }

"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
// Ignore missing type declarations for CSS side-effect import
// @ts-ignore
import "react-toastify/dist/ReactToastify.min.css";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <ToastContainer position="top-right" autoClose={3000} />
    </SessionProvider>
  );
}

