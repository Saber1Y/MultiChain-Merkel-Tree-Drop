"use client";

import React, { useState, useMemo } from "react";
import { PlaceholdersAndVanishInput } from "@/component/ui/placeholders-and-vanish-input";
import { chainsToTSender, erc20Abi, tsenderAbi } from "@/lib/constants";
import { getChainId } from "@wagmi/core";
import { config } from "@/config";
import { readContract } from "@wagmi/core";
import { useAccount } from "wagmi";

const AirdropForm: React.FC = () => {
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const [recipientData, setRecipientData] = useState<string>("");
  const [amountData, setAmountData] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const chainId = getChainId(config);
  const account = useAccount();

  const sharedInputClass =
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-colors duration-150 focus:outline-none focus:ring-0 focus:border-transparent";

  const parsedData = useMemo(() => {
    const recipients = recipientData
      .split(/[,\n]/)
      .map((addr) => addr.trim())
      .filter((addr) => addr.length > 0);

    const amounts = amountData
      .split(/[,\n]/)
      .map((amt) => amt.trim())
      .filter((amt) => amt.length > 0);

    return { recipients, amounts };
  }, [recipientData, amountData]);

  // ...existing code...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (!account || !account.address) throw new Error("Connect wallet first");
      if (!chainId) throw new Error("Unknown chain. Switch your network.");
      const mapping = chainsToTSender[chainId];
      if (!mapping || !mapping.tsender)
        throw new Error("No TSender configured for this network");

      const tsenderAddress = mapping.tsender;
      const ercAbiResolved =
        Array.isArray(erc20Abi) && (erc20Abi as any)[0]?.abi
          ? (erc20Abi as any)[0].abi
          : (erc20Abi as any);
      const tsenderAbiResolved =
        Array.isArray(tsenderAbi) && (tsenderAbi as any)[0]?.abi
          ? (tsenderAbi as any)[0].abi
          : (tsenderAbi as any);

      // simple parsed arrays from memo
      const { recipients, amounts } = parsedData;
      if (recipients.length === 0) throw new Error("No recipients provided");
      if (recipients.length !== amounts.length)
        throw new Error("Recipients and amounts length mismatch");

      // convert amounts (assumes amounts are already in wei strings; if not, use parseUnits)
      const bnAmounts = amounts.map((a) => (a.startsWith("0x") ? a : a)); // keep as string (ethers.BigNumber will accept)
      const totalAmount = bnAmounts.reduce(
        (acc, a) => acc + BigInt(a),
        BigInt(0)
      );

      // check allowance using wagmi readContract
      const allowance = await readContract(config, {
        address: tokenAddress as `0x${string}`,
        abi: ercAbiResolved,
        functionName: "allowance",
        args: [account.address, tsenderAddress],
      });
      const allowanceBn = BigInt((allowance as unknown as bigint) || 0n);
      if (allowanceBn < totalAmount)
        throw new Error(
          "TSender not approved for total amount. Call approve on token first."
        );

      // validate lists
      const listsValid = await readContract(config, {
        address: tsenderAddress as `0x${string}`,
        abi: tsenderAbiResolved,
        functionName: "areListsValid",
        args: [recipients, amounts],
      });
      if (!listsValid)
        throw new Error(
          "Recipients/amounts list invalid according to contract"
        );

      // call airdrop via ethers signer
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { ethers } = require("ethers");
      if (!window.ethereum) throw new Error("No web3 provider");
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();
      const tsenderContract = new ethers.Contract(
        tsenderAddress,
        tsenderAbiResolved,
        signer
      );

      const tx = await tsenderContract.airdropERC20(
        tokenAddress,
        recipients,
        amounts,
        totalAmount.toString()
      );
      console.log("Broadcasted tx:", tx.hash);
      await tx.wait();
      console.log("Airdrop complete", tx.hash);
    } catch (err: any) {
      console.error(err);
      setErrors({ submit: err.message || String(err) });
    } finally {
      setIsLoading(false);
    }
  };

  async function getApproval(senderAddress: string): Promise<bigint> {
    const ercAbiResolved =
      Array.isArray(erc20Abi) && (erc20Abi as any)[0]?.abi
        ? (erc20Abi as any)[0].abi
        : (erc20Abi as any);
    if (!account.address) {
      throw new Error("Wallet address is undefined");
    }
    const response = await readContract(config, {
      address: tokenAddress as `0x${string}`,
      abi: ercAbiResolved,
      functionName: "allowance",
      args: [account.address as `0x${string}`, senderAddress],
    });
    return BigInt((response as unknown as bigint) || BigInt("0"));
  }
  // ...existing code...

  return (
    <div className="max-w-2xl mx-auto mt-20 p-6">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-xl p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Token Airdrop
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Token Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Token Address
            </label>
            <PlaceholdersAndVanishInput
              placeholders={[
                "0x1234...abcd - Enter ERC20 token contract address",
                "0xA0b86a33E6417c7D2F4eB9aCfE8b46e9c2E2b7a3 - USDC Token",
                "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1 - WETH Token",
              ]}
              onChange={(e) =>
                setTokenAddress((e.target as HTMLInputElement).value)
              }
              onSubmit={(e) => e.preventDefault()}
              inputClassName={sharedInputClass}
              placeholderInterval={10000}
            />
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Recipients (one address per line)
            </label>

            <textarea
              value={recipientData}
              onChange={(e) => setRecipientData(e.target.value)}
              rows={6}
              placeholder={
                "Enter one recipient address per line, e.g.\n0x1234...\n0x5678...\n0x9abc..."
              }
              className={"resize-vertical " + sharedInputClass}
            />
          </div>

          {/* Amounts */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amounts (wei; comma or new line separated)
            </label>
            <PlaceholdersAndVanishInput
              placeholders={[
                "1000000, 2000000, 1500000 - Enter amounts in wei",
                "Enter amounts in wei (smallest token unit)",
                "For 18 decimals: 1000000000000000000 = 1 token",
              ]}
              onChange={(e) =>
                setAmountData((e.target as HTMLInputElement).value)
              }
              onSubmit={(e) => e.preventDefault()}
              inputClassName={sharedInputClass}
              placeholderInterval={10000}
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AirdropForm;
