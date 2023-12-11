import { ethers } from "ethers";
const { NFTMarketplaceABI } = require("./contracts/abi.json");

const ChainConfig = {
  ethereum: {
    testnet: {
      ChainConfig: {
        chain: 11155111,
        chainId: "0xaa36a7",
        chainName: "Sepolia",
        nativeCurrency: {
          name: "ETH",
          symbol: "ETH",
          decimals: 18,
        },
        rpcUrls: ["https://rpc.sepolia.org/"],
        blockExplorerURL: ["https://sepolia.etherscan.io"],
      },
      NFTMarketplace: {
        address: ethers.utils.getAddress(
          "0x9096843c7e8a636065063233c6dCf7D23518f81B"
        ),
        abi: NFTMarketplaceABI,
      },
    },
  },
  polygon: {
    testnet: {
      ChainConfig: {
        chainId: "0x13881",
        chainName: "MaticMumbai",
        nativeCurrency: {
          name: "MATIC",
          symbol: "MATIC",
          decimals: 18,
        },
        rpcUrls: [
          "https://still-aged-spring.matic-testnet.discover.quiknode.pro/77682de06006d7bd05393030568727847824a95e/",
        ],
        blockExplorerURL: ["https://mumbai.polygonscan.com/"],
      },
      NFTMarketplace: {
        address: ethers.utils.getAddress(
          "0x86E12C578eF347a1F77dDf287d771E4735aBf744"
        ),
        abi: NFTMarketplaceABI,
      },
      // metadataURL: "https://api.testnet.undergroundwaifus.com/metadata/"
    },
  },
  binance: {
    testnet: {
      ChainConfig: {
        chain: 97,
        chainId: "0x61",
        chainName: "Binance Smart Chain Testnet",
        nativeCurrency: {
          name: "BNB",
          symbol: "BNB",
          decimals: 18,
        },
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        blockExplorerURL: ["https://testnet.bscscan.com/"],
      },
      NFTMarketplace: {
        address: ethers.utils.getAddress(
          "0xfc4bB16fBCE3173F566Bab96E2b3769BBE6C27Be"
        ),
        abi: NFTMarketplaceABI,
      },
    },
  },
};

export const config = ChainConfig.ethereum.testnet;
export const blockExplorerURL = config.ChainConfig.blockExplorerURL;

export const chainConfig = config.ChainConfig;
export const NFTMarketplace = config.NFTMarketplace;
