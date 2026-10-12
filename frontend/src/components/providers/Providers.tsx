"use client";

import React, { ReactNode } from "react";
import { WalletProvider } from "@/context/WalletContext";
import { WalletModal } from "@/components/wallet/WalletModal";
import { DemoRoleSelectorModal } from "@/components/workspace/DemoRoleSelectorModal";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

export const Providers: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <WalletProvider>
      {children}
      <WalletModal />
      <DemoRoleSelectorModal />
      <CookieConsentBanner />
    </WalletProvider>
  );
};
