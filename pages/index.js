import { ethers, Contract } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Loading from "../components/Buttons/GlobalLoading";

import { NFTMarketplace, chainConfig } from "../config.js";
import {
  useWalletUpdate,
  useWallet,
  useNFTMarketContract,
} from "../context/WalletContext.js";
import { Biconomy } from "@biconomy/mexa";
import { toast } from "react-toastify";

export default function Home() {
  const walletToggle = useWalletUpdate();
  const walletState = useWallet();
  const NFTcontract = useNFTMarketContract();

  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loadingNftId, setLoadingNftId] = useState(null);
  const [thresholdRE, setThresholdRE] = useState(null);

  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);

  useEffect(() => {
    loadNFTs();
  }, [walletState, NFTcontract]);

  async function loadNFTs() {
    setGlobalLoading(true);
    const provider = new ethers.getDefaultProvider(chainConfig.rpcUrls[0]);
    const contract = new ethers.Contract(
      NFTMarketplace.address,
      NFTMarketplace.abi,
      provider
    );
    const thresholdAmnt = await contract.rewardThreshold();
    let threshold = ethers.utils.formatUnits(thresholdAmnt.toString(), "ether");
    setThresholdRE(threshold)
    const data = await contract.viewAll();
    const items = await Promise.all(
      data.map(async (i) => {
        const meta = await contract.tokenURI(i[0].toString());
        let price = ethers.utils.formatUnits(i[3].toString(), "ether");
        try {
          const response = await fetch(meta);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const metaData = await response.json();
          const item = {
            price,
            tokenId: i[0].toString(),
            owner: i.owner.toString(),
            image: metaData.image,
            name: i[1].toString(),
            description: metaData.description,
          };
          return item;
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      })
    );
    setNfts(items);
    setGlobalLoading(false);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    if (!walletState) {
      toast.error("Connect Wallet First!!");
      return;
    }

    setLoading(true);
    setLoadingNftId(nft.tokenId);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    try {
      const transaction = await NFTcontract.buy(nft.tokenId, {
        value: price,
      });
      await transaction
        .wait()
        .then(async (tx) => {
          console.log(tx);
          if (tx.status === 1) {
            console.log("Transaction successful:", tx);
            toast.success("Successfully Bought NFT");
            loadNFTs();
            setLoadingNftId(null);

            setLoading(false);
          } else {
            console.error("Transaction failed:", tx);
            toast.error("Transaction failed. Please try again.");
            setLoading(false);
            setLoadingNftId(null);
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error in Buying");
          setLoading(false);
          setLoadingNftId(null);
        });
    } catch (error) {
      toast.error("User Rejected Transaction");
      setLoading(false);
      setLoadingNftId(null);
    }
    setLoading(false);
    setLoadingNftId(null);
  }
  return (
    <div className="dark:bg-gray-dark dark:text-white">
  <div className="flex items-start justify-between mb-4">
  <div className="mx-auto sm:mx-0">
    </div>
        <div>
          {!walletState ? (
            <button
              onClick={walletToggle}
              className="block px-8 py-4 mt-4 font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-700"
            >
              Connect your wallet
            </button>
          ) : (
            <p className="font-bold text-blue-900">
              Connected to: {walletState.slice(0, 15)}....
            </p>
          )}
        </div>
      </div>
      <div className="p-8 mb-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-1 text-2xl font-thin mx-25">
          Marketplace Especially Designed for Artists
        </h2>
        <div className="grid grid-cols-2 gap-2">
          <img
            src="/image1.png"
            alt="Artwork 1"
            className="object-cover w-full h-48 rounded-md"
          />
          <img
            src="/image2.png"
            alt="Artwork 2"
            className="object-cover w-full h-48 rounded-md"
          />
        </div>
      </div>
      <div className="p-1 mb-1 text-center bg-white rounded-lg shadow-md">
      <h2 className="mb-2 text-2xl font-thin">
        Currently Listed NFT
        </h2>
        </div>
{  (loadingState === "loaded" && !nfts.length) ?
      <h1 className="w-full px-12 py-2 mt-4 font-bold text-white bg-gray-900 rounded">
      No items in marketplace
    </h1>
:
      <div className="px-4" style={{ maxWidth: "1600px" }}>
        {globalLoading && <Loading />}
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
          {nfts.map((nft, i) => (
            <div key={i} className="overflow-hidden border shadow rounded-xl">
              <img
                src={nft.image}
                className="object-cover w-full h-64"
                alt={`NFT ${i}`}
              />
              <div className="p-4">
                <p
                  style={{ height: "40px" }}
                  className="text-2xl font-semibold"
                >
                  {nft.name}
                </p>
                <div style={{ height: "70px", overflow: "hidden" }}>
                  <p className="text-gray-400">{nft.description}</p>
                </div>
              </div>
              <div className="p-4 bg-black">
                <p className="text-xl font-thin text-white">{nft.price} ETH</p>
                <button
                  className="w-full px-12 py-2 mt-4 font-thin text-white bg-gray-500 rounded"
                  onClick={() => buyNft(nft)}
                  disabled={loading}
                >
                  {loadingNftId === nft.tokenId ? "Buying" : "BUY"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
}

      <div className="p-4 mt-4 mb-4 text-center bg-white rounded-lg shadow-md">
      <h2 className="mb-2 text-xl font-thin">
        `Become Part of Loyalty Program : Purchase NFT of amount ${thresholdRE} Eth and get Rewarded with NFT`
        </h2>
        </div>
    </div>
  );
}
