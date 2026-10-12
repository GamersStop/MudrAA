"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

export type UserRole = "admin" | "exporter" | "lender" | "auditor";

export interface WalletContextType {
  isInitialized: boolean;
  walletAddress: string | null;
  fullAddress: string | null;
  connected: boolean;
  connecting: boolean;
  walletName: string | null;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  balanceSol: number;
  balanceUsdc: number;
  currentSlot: number | null;
  isDemoWallet: boolean;
  isTestMode: boolean;
  hasSelectedRole: boolean;
  isRoleSelectorOpen: boolean;
  openRoleSelector: () => void;
  closeRoleSelector: () => void;
  selectRole: (role: UserRole) => void;
  resetRoleSelection: () => void;
  isModalOpen: boolean;
  openWalletModal: (redirectTarget?: string) => void;
  closeWalletModal: () => void;
  connectWallet: (walletName: string) => Promise<void>;
  disconnectWallet: (redirectTo?: string) => void;
  launchApp: (target?: string) => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Configuration loaded strictly from environment variables
const SOLANA_DEVNET_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";
const IS_TEST_MODE = process.env.NEXT_PUBLIC_TEST_MODE === "true";
const ENV_DEMO_WALLET_ADDRESS = process.env.NEXT_PUBLIC_DEMO_WALLET_ADDRESS || "";

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [fullAddress, setFullAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [walletName, setWalletName] = useState<string | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole>("admin");
  const [hasSelectedRole, setHasSelectedRole] = useState<boolean>(false);
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState<boolean>(false);
  const [balanceSol, setBalanceSol] = useState<number>(0);
  const [balanceUsdc, setBalanceUsdc] = useState<number>(0);
  const [currentSlot, setCurrentSlot] = useState<number | null>(null);
  const [isDemoWallet, setIsDemoWallet] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    try {
      localStorage.setItem("mudraa_user_role", role);
      window.dispatchEvent(new Event("mudraa_role_changed"));
    } catch {
      // safe fallback
    }
  };

  const openRoleSelector = () => setIsRoleSelectorOpen(true);
  const closeRoleSelector = () => setIsRoleSelectorOpen(false);

  const selectRole = (role: UserRole) => {
    setUserRoleState(role);
    setHasSelectedRole(true);
    setIsRoleSelectorOpen(false);
    try {
      localStorage.setItem("mudraa_user_role", role);
      localStorage.setItem("mudraa_role_confirmed", "true");
      window.dispatchEvent(new Event("mudraa_role_changed"));
    } catch {
      // safe fallback
    }

    // Auto-connect demo evaluation wallet ONLY if user does not already have a custom dev wallet connected
    if (!connected && IS_TEST_MODE && ENV_DEMO_WALLET_ADDRESS) {
      const demoAddr = ENV_DEMO_WALLET_ADDRESS;
      setConnected(true);
      setFullAddress(demoAddr);
      setWalletAddress(`${demoAddr.slice(0, 4)}...${demoAddr.slice(-4)}`);
      setWalletName("Demo Evaluation Wallet");
      setIsDemoWallet(true);

      try {
        localStorage.setItem(
          "mudraa_wallet_session",
          JSON.stringify({
            connected: true,
            address: demoAddr,
            walletName: "Demo Evaluation Wallet",
            isDemo: true,
          })
        );
      } catch {}

      fetchLiveDevnetState(demoAddr);
    }

    router.push("/dashboard");
  };

  const resetRoleSelection = () => {
    setHasSelectedRole(false);
    try {
      localStorage.removeItem("mudraa_role_confirmed");
    } catch {
      // safe fallback
    }
    setIsRoleSelectorOpen(true);
  };

  // Fetch live SOL balance and slot directly from Solana Devnet JSON-RPC (Concurrent Promise.all)
  const fetchLiveDevnetState = useCallback(async (address: string) => {
    if (!address) return;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout guard

      const [balanceRes, slotRes] = await Promise.all([
        fetch(SOLANA_DEVNET_RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "balance-check",
            method: "getBalance",
            params: [address, { commitment: "confirmed" }],
          }),
        }),
        fetch(SOLANA_DEVNET_RPC, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: "slot-check",
            method: "getSlot",
            params: [{ commitment: "confirmed" }],
          }),
        }),
      ]);

      clearTimeout(timeoutId);

      const [balanceData, slotData] = await Promise.all([
        balanceRes.json(),
        slotRes.json(),
      ]);

      if (balanceData?.result?.value !== undefined) {
        const sol = balanceData.result.value / 1e9;
        setBalanceSol(Number(sol.toFixed(4)));
      }

      if (typeof slotData?.result === "number") {
        setCurrentSlot(slotData.result);
      }
    } catch (err) {
      console.warn("Live Solana Devnet RPC fetch notice:", err);
    }
  }, []);

  // Initialize: Check stored role, session storage, or conditionally auto-connect if TEST_MODE is enabled in env
  useEffect(() => {
    try {
      // Clear all unverified transactions up to date so session reflects 0 unproven records
      if (typeof window !== "undefined" && !localStorage.getItem("mudraa_tx_purged_devnet_v1")) {
        localStorage.removeItem("mudraa_transactions");
        localStorage.setItem("mudraa_tx_purged_devnet_v1", "true");
        window.dispatchEvent(new Event("mudraa_transactions_updated"));
      }

      // Check if user has already confirmed their demo role
      const confirmed = localStorage.getItem("mudraa_role_confirmed") === "true";
      setHasSelectedRole(confirmed);

      // Restore user role if previously selected
      const savedRole = localStorage.getItem("mudraa_user_role") as UserRole | null;
      if (savedRole && ["admin", "exporter", "lender", "auditor"].includes(savedRole)) {
        setUserRoleState(savedRole);
      }

      const stored = localStorage.getItem("mudraa_wallet_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.connected && parsed.address) {
          setConnected(true);
          setFullAddress(parsed.address);
          setWalletAddress(`${parsed.address.slice(0, 4)}...${parsed.address.slice(-4)}`);
          setWalletName(parsed.walletName || "Phantom");
          setIsDemoWallet(Boolean(parsed.isDemo));
          fetchLiveDevnetState(parsed.address);
          setIsInitialized(true);
          return;
        }
      }

      // Do NOT auto-connect demo wallet on startup.
      // Users can connect their own dev wallet (Phantom/Solflare) or choose Judge Evaluation Wallet explicitly.
    } catch {
      // Safe fallback
    } finally {
      setIsInitialized(true);
    }
  }, [fetchLiveDevnetState]);

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
      let resolvedAddress = "";
      let isDemo = false;

      // Real Phantom Wallet Connection
      if (selectedWallet === "Phantom") {
        if (typeof window !== "undefined" && (window as any).solana?.isPhantom) {
          try {
            const resp = await (window as any).solana.connect();
            if (resp?.publicKey) {
              resolvedAddress = resp.publicKey.toString();
            }
          } catch (err) {
            console.warn("Phantom connection prompt dismissed:", err);
            throw new Error("Phantom connection was canceled.");
          }
        } else {
          if (typeof window !== "undefined") {
            window.open("https://phantom.app/", "_blank");
          }
          throw new Error("Phantom wallet extension not detected. Please install Phantom to use your dev wallet.");
        }
      } else if (selectedWallet === "Solflare") {
        if (typeof window !== "undefined" && (window as any).solflare?.isSolflare) {
          try {
            await (window as any).solflare.connect();
            if ((window as any).solflare.publicKey) {
              resolvedAddress = (window as any).solflare.publicKey.toString();
            }
          } catch (err) {
            console.warn("Solflare connection prompt dismissed:", err);
            throw new Error("Solflare connection was canceled.");
          }
        } else {
          if (typeof window !== "undefined") {
            window.open("https://solflare.com/", "_blank");
          }
          throw new Error("Solflare wallet extension not detected. Please install Solflare to use your dev wallet.");
        }
      } else if (selectedWallet === "Backpack") {
        if (typeof window !== "undefined" && (window as any).backpack) {
          try {
            const resp = await (window as any).backpack.connect();
            if (resp?.publicKey) {
              resolvedAddress = resp.publicKey.toString();
            }
          } catch (err) {
            throw new Error("Backpack connection was canceled.");
          }
        } else {
          if (typeof window !== "undefined") {
            window.open("https://backpack.app/", "_blank");
          }
          throw new Error("Backpack wallet extension not detected.");
        }
      } else if (
        selectedWallet === "Judge Evaluation Wallet" ||
        selectedWallet === "Demo Evaluation Wallet"
      ) {
        if (IS_TEST_MODE && ENV_DEMO_WALLET_ADDRESS) {
          resolvedAddress = ENV_DEMO_WALLET_ADDRESS;
          isDemo = true;
        } else {
          throw new Error("Demo evaluation wallet address not configured in environment variables.");
        }
      }

      if (!resolvedAddress) {
        throw new Error("No wallet account selected or detected.");
      }

      const truncated = `${resolvedAddress.slice(0, 4)}...${resolvedAddress.slice(-4)}`;
      setFullAddress(resolvedAddress);
      setWalletAddress(truncated);
      setConnected(true);
      setWalletName(selectedWallet);
      setIsDemoWallet(isDemo);

      try {
        localStorage.setItem(
          "mudraa_wallet_session",
          JSON.stringify({
            connected: true,
            address: resolvedAddress,
            walletName: selectedWallet,
            isDemo,
          })
        );
      } catch {
        // Ignore storage error
      }

      await fetchLiveDevnetState(resolvedAddress);
      setIsModalOpen(false);

      const destination = targetRoute || "/dashboard";
      setTargetRoute(null);
      router.push(destination);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = (redirectTo: string = "/") => {
    setConnected(false);
    setWalletAddress(null);
    setFullAddress(null);
    setWalletName(null);
    setIsDemoWallet(false);
    setBalanceSol(0);
    setBalanceUsdc(0);
    setHasSelectedRole(false);
    try {
      localStorage.removeItem("mudraa_wallet_session");
      localStorage.removeItem("mudraa_role_confirmed");
    } catch {
      // Ignore storage error
    }
    if (redirectTo) {
      router.push(redirectTo);
    }
  };

  const launchApp = (target: string = "/dashboard") => {
    // If demo test mode is active and user hasn't selected a persona yet, prompt role selection first
    if (IS_TEST_MODE && !hasSelectedRole) {
      setIsRoleSelectorOpen(true);
      return;
    }
    if (connected) {
      router.push(target);
    } else {
      openWalletModal(target);
    }
  };

  const refreshBalance = async () => {
    if (fullAddress) {
      await fetchLiveDevnetState(fullAddress);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isInitialized,
        walletAddress,
        fullAddress,
        connected,
        connecting,
        walletName,
        userRole,
        setUserRole,
        balanceSol,
        balanceUsdc,
        currentSlot,
        isDemoWallet,
        isTestMode: IS_TEST_MODE,
        hasSelectedRole,
        isRoleSelectorOpen,
        openRoleSelector,
        closeRoleSelector,
        selectRole,
        resetRoleSelection,
        isModalOpen,
        openWalletModal,
        closeWalletModal,
        connectWallet,
        disconnectWallet,
        launchApp,
        refreshBalance,
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
