import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { NFTMarketplace, chainConfig } from "../config.js";
import {
  useWalletUpdate,
  useWallet,
  useNFTMarketContract,
} from "../context/WalletContext.js";
import Loading from "../components/Buttons/GlobalLoading";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const walletToggle = useWalletUpdate();
  const walletState = useWallet();
  const NFTcontract = useNFTMarketContract();
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [isEligibleForReward, setIsEligibleForReward] = useState(false);
  const [pucrchaseAmnt, setPurchaseAmnt] = useState(false);
  const [thresholdAmnt, setThresholdAmnt] = useState(false);
  const [mintR, setMintR] = useState(false);

  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
  useEffect(() => {
    loadNFTs();
    checkRewardEligibility();
  }, []);

  useEffect(() => {
    loadNFTs();
    checkRewardEligibility();
  }, [NFTcontract]);

  async function checkRewardEligibility() {
    if (walletState && NFTcontract) {
      try {
        const isEligible = await NFTcontract.checkRewardEligibility();
        const thresTracker = ethers.utils.formatUnits((await NFTcontract.thresholdTracker(walletState)).toString(), "ether");
        const thresAmnt = ethers.utils.formatUnits((await NFTcontract.rewardThreshold()).toString(), "ether");
        setPurchaseAmnt(thresTracker);
        setThresholdAmnt(thresAmnt);
        setIsEligibleForReward(isEligible);
      } catch (error) {
        console.error("Error checking reward eligibility:", error);
      }
    }
  }

  async function loadNFTs() {
    if (walletState && NFTcontract) {
      setGlobalLoading(true);
      try {
        const myNftsResponse = await NFTcontract.viewOwned(walletState);
        let metaData;
        let image;
        let meta;
        const myNftItems = await Promise.all(
          myNftsResponse.map(async (i) => {
            meta = await NFTcontract.tokenURI(i[0].toString());
            if (meta.startsWith("http")) {
              const metaDataResponse = await fetch(meta);

              if (metaDataResponse.ok) {
                metaData = await metaDataResponse.json();
                image = metaData.image;
              } else {
                console.error(
                  "Error fetching metadata. Status:",
                  metaDataResponse.status
                );
              }
            } else {
              meta = "token uri is not available";
              image =
                "https://upload.wikimedia.org/wikipedia/commons/b/bc/Unknown_person.jpg";
            }

            let price = ethers.utils.formatUnits(i.price.toString(), "ether");

            let item = {
              price,
              tokenId: i[0].toNumber(),
              owner: i.owner,
              image: image,
              tokenURI: meta,
              forSale: i.forSale,
            };
            return item;
          })
        );
        setNfts(myNftItems);
        setGlobalLoading(false);
        setLoadingState("loaded");
      } catch (error) {
        console.error("Error fetching user's NFTs:", error);
      }
    }
  }

  async function mintRewardNft() {
    if (walletState && NFTcontract) {
      try {
        setMintR(true);
        let transaction = await NFTcontract.mintRewardNFT();
        await transaction.wait().then(async (tx) => {
          console.log(tx);
          if (tx.status === 1) {
            console.log("Transaction successful:", tx);
            toast.success("Reward NFT minted successfully!");
          } else {
            console.error("Transaction failed:", tx);
            toast.error("Transaction failed. Please try again.");
          }
        });
        setMintR(false);
        loadNFTs();
        checkRewardEligibility();
      } catch (error) {
        console.error("Error minting reward NFT:", error);
        toast.error("Error minting reward NFT. Please try again.");
        setMintR(false);
      }
    }
  }

  async function listNFT(nft) {
    console.log("nft:", nft);
    const meta = await NFTcontract.tokenURI(nft.tokenId.toString());
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${meta}`);
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="px-20 py-10 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      {!walletState ? (
        <button
          onClick={walletToggle}
          className="block px-8 py-4 mx-auto mt-40 font-semibold text-white bg-gray-900 rounded-lg hover:bg-blue-700"
        >
          Connect your wallet
        </button>
      ) : (
        <div className="p-4">
          {globalLoading && <Loading />}
          <div className="p-6 mb-8 bg-blue-200 rounded-lg">
            {isEligibleForReward ? (
              <div className="flex items-center">
                <img
                  src="https://gateway.pinata.cloud/ipfs/QmVSiYEQaksNSR2vpKazf6vfe69xA2odJWurVEu4r53Cof"
                  alt="NFT Image"
                  className="object-cover mr-4 rounded"
                  style={{ width: "100px", height: "100px" }}
                />
                <div>
                  <p className="mb-2 text-lg font-semibold text-blue-900">
                    You are eligible for Reward NFT
                  </p>
                  <button
                    className="px-12 py-2 font-bold text-white bg-green-500 rounded"
                    onClick={mintRewardNft}
                  >
                    {mintR ? "Minting" : "Mint Reward NFT"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <img
                  src="https://gateway.pinata.cloud/ipfs/QmVSiYEQaksNSR2vpKazf6vfe69xA2odJWurVEu4r53Cof"
                  alt="NFT Image"
                  className="object-cover mr-4 rounded"
                  style={{ width: "100px", height: "100px" }}
                />
                <div className="mb-2">
                  <p className="text-lg font-semibold text-red-500">
                    Purchase more to get Reward NFT
                  </p>
                  <p className="text-lg font-semibold text-red-500">
                    Your Purchase Amount : ${pucrchaseAmnt}
                  </p>
                  <p className="text-lg font-semibold text-red-500">
                    Threshold Amount for Reward : ${thresholdAmnt}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            {nfts.map((nft, i) => (
              <div key={i} className="overflow-hidden border shadow rounded-xl">
                {console.log(nfts)}
                <img
                  src={nft.image}
                  className="object-cover w-full h-48 rounded"
                  alt={`NFT ${i}`}
                />
                <div className="p-4 bg-black">
                  <p className="font-thin text-white text-l">
                    Price - {nft.price} Eth
                  </p>
                  <button
                    className="w-full px-12 py-2 mt-4 text-white bg-gray-500 rounded"
                    onClick={() => listNFT(nft)}
                    disabled={nft.forSale}
                  >
                    {nft.forSale ? "Already Listed" : "List"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
