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
import "react-toastify/dist/ReactToastify.css";

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

