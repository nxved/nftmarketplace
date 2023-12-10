// Importing required modules and styles
import { useRouter } from 'next/router';
import '../styles/globals.css';
import React from 'react';
import Link from 'next/link';
import WalletProvider from '../context/WalletContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styling the navigation bar
const Navbar = () => (
  <nav className="p-4 bg-gray-900">
    <div className="container mx-auto">
      <Link href="/">
        <div className="text-3xl font-bold text-white cursor-pointer">ArtNFT Marketplace</div>
      </Link>
      <div className="flex items-center space-x-4">
        <Link href="/">
          <div className="text-gray-300 cursor-pointer hover:text-white">Home</div>
        </Link>
        <Link href="/create-nft">
          <div className="text-gray-300 cursor-pointer hover:text-white">Create NFT</div>
        </Link>
        <Link href="/my-nfts">
          <div className="text-gray-300 cursor-pointer hover:text-white">My NFTs</div>
        </Link>
      </div>
    </div>
  </nav>
);

// Main application component
function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // Check if the current route is the home page
  const isHomePage = router.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-100">
      <WalletProvider>
        <Navbar />
        <div className="container pt-8 pb-16 mx-auto">
          {/* Original Component */}
          <Component {...pageProps} />
        </div>
        <ToastContainer position="bottom-right" theme="dark" />
      </WalletProvider>
    </div>
  );
}

export default MyApp;
