import { useState, useRef } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useRouter } from "next/router";
import { NFTMarketplace, chainConfig } from "../config.js";
import {
  useWalletUpdate,
  useWallet,
  useNFTMarketContract,
} from "../context/WalletContext.js";
import { toast } from "react-toastify";

import Head from "next/head";
import Image from "next/image";

export default function CreateItem() {
  const [file, setFile] = useState("");
  const [cid, setCid] = useState("");
  const [uploading, setUploading] = useState(false);

  const inputFile = useRef(null);

  const uploadFile = async (fileToUpload) => {
    try {
      setUploading(true);

      const res = await fetch("/api/files", {
        method: "POST",
        body: JSON.stringify(fileToUpload),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const responseData = await res.json(); // Parse JSON response
      const ipfsHash = responseData.data
      setCid(ipfsHash);
      setUploading(false);
      console.log(ipfsHash)
    } catch (e) {
      console.log(e);
      setUploading(false);
      toast.error("Error in minting try again")
    }
  };

  const [formInput, updateFormInput] = useState({
    nameNFT: "",
    description: "",
    imageLink: "",
  });
  const router = useRouter();
  const walletToggle = useWalletUpdate();
  const walletState = useWallet();
  const NFTcontract = useNFTMarketContract();
  const [loading, setLoading] = useState(false);



  async function mint() {
    const { nameNFT, description, imageLink } = formInput;
    if (!nameNFT || !description || !imageLink) {
      toast.error("Fill all the Details");
      return;
    }
    setLoading(true);

    try {
      // Upload image to Pinata
      const metadata = {
        description: description,
        image: imageLink,
        name: nameNFT,
      };

     await uploadFile(metadata);

      const transaction = await NFTcontract.mint(
        nameNFT,
        `https://gateway.pinata.cloud/ipfs/${cid}`
      );
      await transaction.wait().then(async (tx) => {
        console.log(tx);
        if (tx.status === 1) {
          console.log("Transaction successful:", tx);
          toast.success("Successfully Created NFT");
          router.push("/");
        } else {
          console.error("Transaction failed:", tx);
          toast.error("Transaction failed. Please try again.");
        };
      });
    } catch (error) {
      console.error("Error creating NFT:", error);
      toast.error("Error in Creating NFT. Please try again.");
    } finally {
      setLoading(false);
    }
  }

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
        <div className="flex flex-col w-1/2 pb-12">
          <input
            placeholder="Asset Name"
            className="p-4 mt-8 border rounded"
            onChange={(e) =>
              updateFormInput({ ...formInput, nameNFT: e.target.value })
            }
          />
          <textarea
            placeholder="Description"
            className="p-4 mt-2 border rounded"
            onChange={(e) =>
              updateFormInput({ ...formInput, description: e.target.value })
            }
          />
          <input
            placeholder="Image Link"
            className="p-4 mt-2 border rounded"
            onChange={(e) =>
              updateFormInput({ ...formInput, imageLink: e.target.value })
            }
          />
          <button
            onClick={mint}
            disabled={loading}
            className="p-4 mt-4 font-bold text-white bg-gray-900 rounded shadow-lg"
          >
            {loading ? "Creating NFT..." : "Create NFT"}
          </button>
        </div>
      )}
    </div>
  );
}
