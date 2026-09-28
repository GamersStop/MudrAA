"use client";

import React, { ReactNode } from "react";
import { WalletProvider } from "@/context/WalletContext";
import { WalletModal } from "@/components/wallet/WalletModal";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WalletProvider>
      {children}
      <WalletModal />
    </WalletProvider>
  );
};
