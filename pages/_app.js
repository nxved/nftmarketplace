import { useRouter } from 'next/router';
import '../styles/globals.css';
import React from 'react';
import Link from 'next/link';
import WalletProvider from '../context/WalletContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => (
  <nav className="bg-gray-800 border-b border-black-800">
    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Link href="/">
            <div className="flex items-center"> 
            <img src="logo.png" alt="Logo" className="w-12 h-6 mr-4" />
              <div className="text-3xl font-bold text-white cursor-pointer">ArtNFT Marketplace</div>
              </div>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-baseline ml-10 space-x-4">
              <Link href="/">
                <div className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700">Home</div>
              </Link>
              <Link href="/create-nft">
                <div className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700">Create NFT</div>
              </Link>
              <Link href="/my-nfts">
                <div className="px-3 py-2 text-sm font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700">My NFTs</div>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex -mr-2 md:hidden">
          <button className="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">Open main menu</span>
            <svg className="block w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link href="/">
          <div className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700">Home</div>
        </Link>
        <Link href="/create-nft">
          <div className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700">Create NFT</div>
        </Link>
        <Link href="/my-nfts">
          <div className="block px-3 py-2 text-base font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700">My NFTs</div>
        </Link>
      </div>
    </div>
  </nav>
);

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100">
      <WalletProvider>
        <Navbar />
        <div className="container pt-8 pb-16 mx-auto">
          <Component {...pageProps} />
        </div>
        <ToastContainer position="bottom-right" theme="dark" />
      </WalletProvider>
    </div>
  );
}

export default MyApp;
