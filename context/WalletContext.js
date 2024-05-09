import React, { useContext, useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import { NFTMarketplace, chainConfig } from "../config";
import Web3Modal from "web3modal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const WalletContext = React.createContext();
const WalletUpdateContext = React.createContext();
const NFTMarketContractUpdateContext = React.createContext();
const MintContract = React.createContext();

export function useWallet() {
  return useContext(WalletContext);
}

export function useWalletUpdate() {
  return useContext(WalletUpdateContext);
}

export function useNFTMarketContract() {
  return useContext(NFTMarketContractUpdateContext);
}

export function useMintContract() {
  return useContext(MintContract);
}

const returnContract = (details, signer) => {
  return new ethers.Contract(details.address, details.abi, signer);
};

export default function WalletProvider({ children }) {
  const router = useRouter();
  const [walletAddress, setWalletAddress] = useState(null);
  const [NFTMarketContract, setNFTMarketContract] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [mintContract, setMintContract] = useState(null);

  const provider = new ethers.providers.JsonRpcProvider(chainConfig.rpcUrls[0]);

  useEffect(() => {
    if (walletConnected) {
      checkChainId();
      console.log(walletAddress)
    }
  }, [walletAddress, walletConnected]);
  

  useEffect(() => {
    console.log(walletAddress)
    toggleWalletButton();
      checkChainId();
  }, []);

  useEffect(() => {
    checkChainId();
  }, [walletAddress]);
  

  useEffect(() => {
    setContract();
  }, []);

  const toggleWalletButton = async () => {
    try {
      const walletProvider = await connectWallet();
      const signer = walletProvider.getSigner();
      const address = await signer.getAddress();
      setWalletConnected(true);
      setWalletAddress(address);
      toast.success("Wallet Connected")
    } catch (err) {
      console.error(err);
     toast.error("Failed to connect MetaMask wallet.");
    }
  };

  const connectWallet = async () => {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const walletProvider = new ethers.providers.Web3Provider(connection);
    const network = await walletProvider.getNetwork();
    // if (network.chainId !== chainConfig.chain) {
    //    toast.error(`Change the network to ${chainConfig.chainName}`)
    //  // window.alert("Change the network to Mumbai")
    //   try {
    //     await ethereum.request({
    //       method: 'wallet_switchEthereumChain',
    //       params: [{ chainId: chainConfig.chainId }],
    //     });
    //   } catch (switchError) {
    //     // This error code indicates that the chain has not been added to MetaMask.
    //     if (switchError.code === 4902) {
    //       try {
    //         await ethereum.request({
    //           method: 'wallet_addEthereumChain',
    //           params: [
    //             {
    //               chainId: chainConfig.chainId,
    //               chainName: chainConfig.chainName,
    //               rpcUrls: chainConfig.rpcUrls,
    //             },
    //           ],
    //         });
    //       } catch (addError) {
    //       }
    //     }
    //   }    }
    return walletProvider;
  };

  const checkChainId = async () => {
    if (walletAddress) {
      setWalletAddress(ethers.utils.getAddress(walletAddress));
      setContract();
    }
  };

  
  let new_abi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "bytes32", name: "neededRole", type: "bytes32" },
      ],
      name: "AccessControlUnauthorizedAccount",
      type: "error",
    },
    { inputs: [], name: "EnforcedPause", type: "error" },
    { inputs: [], name: "ExpectedPause", type: "error" },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "chestId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "chestName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "address",
          name: "buyer",
          type: "address",
        },
      ],
      name: "BuyChest",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "version",
          type: "uint64",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "chestId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "chestName",
          type: "string",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "totalSupply",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "cost",
          type: "uint256",
        },
      ],
      name: "NewChestDetails",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Paused",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "previousAdminRole",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "bytes32",
          name: "newAdminRole",
          type: "bytes32",
        },
      ],
      name: "RoleAdminChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleGranted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "bytes32",
          name: "role",
          type: "bytes32",
        },
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
      ],
      name: "RoleRevoked",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint256",
          name: "duration",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "discountPercentage",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "chestID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "saleID",
          type: "uint256",
        },
      ],
      name: "SaleStarted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "user",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "chestID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "discountPercent",
          type: "uint256",
        },
      ],
      name: "SetChestWhiteList",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "Unpaused",
      type: "event",
    },
    {
      inputs: [],
      name: "DEFAULT_ADMIN_ROLE",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "MINTER_ROLE",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "PAUSER_ROLE",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_chestId", type: "uint256" },
        { internalType: "uint256", name: "_whitelistIndex", type: "uint256" },
        { internalType: "bool", name: "_ifWhiteListPurchase", type: "bool" },
      ],
      name: "buyChest",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_chestId", type: "uint256" },
        { internalType: "string", name: "_chestName", type: "string" },
        { internalType: "uint256", name: "_totalSupply", type: "uint256" },
        { internalType: "uint256", name: "_cost", type: "uint256" },
        { internalType: "bool", name: "_ifOneTimePurchasedOnly", type: "bool" },
        { internalType: "address[]", name: "_nftAdd", type: "address[]" },
      ],
      name: "changeChestDetails",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_price", type: "uint256" },
        { internalType: "uint256", name: "_maxPaidCardQty", type: "uint256" },
      ],
      name: "changePaidCardDetails",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_recipient", type: "address" },
      ],
      name: "changeRecipient",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_user", type: "address" },
        { internalType: "uint256", name: "_chestId", type: "uint256" },
        { internalType: "uint256", name: "_whitelistIndex", type: "uint256" },
      ],
      name: "checkDiscount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_user", type: "address" },
        { internalType: "uint256", name: "_chestNum", type: "uint256" },
      ],
      name: "checkSaleDiscount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "chestDetails",
      outputs: [
        { internalType: "string", name: "name", type: "string" },
        { internalType: "uint256", name: "totalSupply", type: "uint256" },
        {
          internalType: "uint256",
          name: "totalPurchasedChest",
          type: "uint256",
        },
        { internalType: "uint256", name: "cost", type: "uint256" },
        { internalType: "uint256", name: "currentSaleID", type: "uint256" },
        { internalType: "uint256", name: "duration", type: "uint256" },
        {
          internalType: "uint256",
          name: "discountPercentage",
          type: "uint256",
        },
        { internalType: "uint256", name: "startTime", type: "uint256" },
        { internalType: "bool", name: "ifOneTimePurchaseOnly", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "chestMintDetails",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
      name: "getRoleAdmin",
      outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "grantRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "hasPurchasedInSale",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "hasRole",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "_recipient", type: "address" },
        { internalType: "address[]", name: "_conAdds", type: "address[]" },
        { internalType: "string[]", name: "_names", type: "string[]" },
        { internalType: "string[]", name: "_chestName", type: "string[]" },
        { internalType: "uint256[]", name: "_totalSupply", type: "uint256[]" },
        { internalType: "uint256[]", name: "_cost", type: "uint256[]" },
        { internalType: "address[][]", name: "_nftAdd", type: "address[][]" },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "_chestId", type: "uint256" }],
      name: "isSaleOngoing",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "maxPaidCardsQty",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256[]", name: "_cardNum", type: "uint256[]" },
      ],
      name: "mintCardWhitelist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256[]", name: "_cardIndexes", type: "uint256[]" },
      ],
      name: "mintPaidCards",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paidCardPrice",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      name: "paidCards",
      outputs: [
        { internalType: "address", name: "contractAdd", type: "address" },
        { internalType: "uint256", name: "chestID", type: "uint256" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "rarity", type: "string" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "recipient",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        {
          internalType: "address",
          name: "callerConfirmation",
          type: "address",
        },
      ],
      name: "renounceRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "bytes32", name: "role", type: "bytes32" },
        { internalType: "address", name: "account", type: "address" },
      ],
      name: "revokeRole",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "_users", type: "address[]" },
        { internalType: "address[]", name: "_contractAdds", type: "address[]" },
        { internalType: "uint256[]", name: "_chestIds", type: "uint256[]" },
        { internalType: "string[]", name: "_names", type: "string[]" },
        { internalType: "string[]", name: "_rarities", type: "string[]" },
      ],
      name: "setCardWhitelist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "_users", type: "address[]" },
        { internalType: "uint256[]", name: "_chestIds", type: "uint256[]" },
        { internalType: "uint256[]", name: "_quantities", type: "uint256[]" },
        {
          internalType: "uint256[]",
          name: "_discountPercentages",
          type: "uint256[]",
        },
      ],
      name: "setChestWhitelist",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "_chestName", type: "string" },
        { internalType: "uint256", name: "_totalSupply", type: "uint256" },
        { internalType: "uint256", name: "_cost", type: "uint256" },
        { internalType: "bool", name: "_ifOneTimePurchasedOnly", type: "bool" },
        { internalType: "address[]", name: "_nftAdd", type: "address[]" },
      ],
      name: "setNewChestDetails",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "_conAdds", type: "address[]" },
        { internalType: "string[]", name: "_names", type: "string[]" },
      ],
      name: "setNewPaidCards",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "_duration", type: "uint256" },
        {
          internalType: "uint256[]",
          name: "_discountPercentages",
          type: "uint256[]",
        },
        { internalType: "uint256[]", name: "_chestIDs", type: "uint256[]" },
      ],
      name: "startSale",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalAmountToOwner",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalChest",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "", type: "address" }],
      name: "userPaidCardsQty",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "whitelistedCards",
      outputs: [
        { internalType: "address", name: "contractAdd", type: "address" },
        { internalType: "uint256", name: "chestID", type: "uint256" },
        { internalType: "string", name: "name", type: "string" },
        { internalType: "string", name: "rarity", type: "string" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "", type: "address" },
        { internalType: "uint256", name: "", type: "uint256" },
        { internalType: "uint256", name: "", type: "uint256" },
      ],
      name: "whitelistedChests",
      outputs: [
        {
          internalType: "uint256",
          name: "discountPercentage",
          type: "uint256",
        },
        { internalType: "uint256", name: "numberOfChests", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];

  const setContract = async () => {
    if (walletAddress) {
      const walletProvider = await connectWallet();
      const signer = walletProvider.getSigner();
      const NFTMarketplaceContract = returnContract(NFTMarketplace, signer);
      const MintContract = new ethers.Contract("0xe01FBFF20808F3A3EF946c7b6DEdb6F717Cf085F", new_abi, signer);;
      setMintContract(MintContract);
      setNFTMarketContract(NFTMarketplaceContract);
    }
  };

  return (
    <WalletContext.Provider value={walletAddress}>
      <WalletUpdateContext.Provider value={toggleWalletButton}>
        <MintContract.Provider value={mintContract}>
        <NFTMarketContractUpdateContext.Provider value={NFTMarketContract}>
          {children}
        </NFTMarketContractUpdateContext.Provider>
        </MintContract.Provider>
      </WalletUpdateContext.Provider>
    </WalletContext.Provider>
  );
}
