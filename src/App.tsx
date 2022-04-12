/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';

import React, { useMemo } from 'react';
import Modal from 'react-modal';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { getPhantomWallet, getSolflareWallet } from '@solana/wallet-adapter-wallets';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from "@solana/web3.js";
import { ToastProvider } from 'react-toast-notifications'

import EvolvePage from './pages/EvolvePage';
import { CLUSTER, CLUSTER_API } from './config/dev.js'
require('@solana/wallet-adapter-react-ui/styles.css');

Modal.setAppElement('#root');

const AppWithProvider = () => {
  const network = CLUSTER;
  const endpoint = CLUSTER_API;
  const wallets = useMemo(
    () => [getPhantomWallet(), getSolflareWallet()],
    [network]
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route path='generate' element={<EvolvePage />} />
                <Route path='/' element={<Navigate to='generate' />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
export default AppWithProvider;