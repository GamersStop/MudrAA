"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

export interface WalletContextType {
  walletAddress: string | null;
  fullAddress: string | null;
  connected: boolean;
  connecting: boolean;
  walletName: string | null;
  balanceSol: number;
  balanceUsdc: number;
  isModalOpen: boolean;
  openWalletModal: (redirectTarget?: string) => void;
  closeWalletModal: () => void;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: () => void;
  launchApp: (target?: string) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const DEMO_ADDRESS = "7xK9rM5q2bPwU8vYzT3eLmQp4k1oRsNxV9d8C3Mqp";

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [fullAddress, setFullAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [balanceSol, setBalanceSol] = useState<number>(42.85);
  const [balanceUsdc, setBalanceUsdc] = useState<number>(250000.0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  // Restore wallet session on initial client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("mudraa_wallet_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.connected && parsed.address) {
          setConnected(true);
          setFullAddress(parsed.address);
          setWalletAddress(
            `${parsed.address.slice(0, 4)}...${parsed.address.slice(-4)}`
          );
          setWalletName(parsed.walletName || "Phantom");
        }
      }
    } catch {
      // Safe fallback if localStorage is disabled
    }
  }, []);

  const openWalletModal = (redirectTarget: string = "/dashboard") => {
    setTargetRoute(redirectTarget);
    setIsModalOpen(true);
  };

  const closeWalletModal = () => {
    setIsModalOpen(false);
  };

  const connectWallet = async (selectedWallet: string): Promise<void> => {
    setConnecting(true);
    try {
      // Simulate real Solana adapter handshake latency
      await new Promise((resolve) => setTimeout(resolve, 850));

      const truncated = `${DEMO_ADDRESS.slice(0, 4)}...${DEMO_ADDRESS.slice(-4)}`;
      setFullAddress(DEMO_ADDRESS);
      setWalletAddress(truncated);
      setConnected(true);
      setWalletName(selectedWallet);

      // Persist session
      try {
        localStorage.setItem(
          "mudraa_wallet_session",
          JSON.stringify({
            connected: true,
            address: DEMO_ADDRESS,
            walletName: selectedWallet,
          })
        );
      } catch {
        // Ignore storage error
      }

      setIsModalOpen(false);

      // Transition user directly into the protocol application workspace
      const destination = targetRoute || "/dashboard";
      setTargetRoute(null);
      router.push(destination);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setWalletAddress(null);
    setFullAddress(null);
    setWalletName(null);
    try {
      localStorage.removeItem("mudraa_wallet_session");
    } catch {
      // Ignore storage error
    }
  };

  const launchApp = (target: string = "/dashboard") => {
    if (connected) {
      router.push(target);
    } else {
      openWalletModal(target);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        fullAddress,
        connected,
        connecting,
        walletName,
        balanceSol,
        balanceUsdc,
        isModalOpen,
        openWalletModal,
        closeWalletModal,
        connectWallet,
        disconnectWallet,
        launchApp,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
