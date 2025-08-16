"use client";

import { useAppKit } from "@reown/appkit/react";

export default function ConnectWalletButton() {
  const { open } = useAppKit();

  return (
    <button
      onClick={() => open({ view: "Connect" })}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Connect Wallet
    </button>
  );
}
