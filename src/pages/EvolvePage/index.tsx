/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import * as anchor from '@project-serum/anchor';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';
import {
  PublicKey,
  SystemProgram,
  Keypair,
  SYSVAR_RENT_PUBKEY
} from '@solana/web3.js';
import { AccountLayout, Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.min.css';

import { SolanaClient, SolanaClientProps } from '../../helpers/sol';
import { sendTransactions, sendTransactionWithRetry, SequenceType } from '../../helpers/sol/connection';
import { getAccountInfo, getBlockTime, getRecentBlockHash, getTokenAccountByOwner } from '../../api/api';

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  CANDY_MACHINE_PROGRAM,
  getMintTx,
} from "../../helpers/cmv2/candy-machine";

import { IDL } from '../../constants/idl';

import {
  CLUSTER_API,
  COMMITMENT,
  NFT_UPDATE_AUTHORITY,
  NFT_NAME_PREFIX,
  PROGRAM_ID,
  EGG_CM_ID,
  REWARD_TOKEN_MINT,
  REWARD_TOKEN_ACCOUNT,
  MINIMUS_SPL_TOKEN,
  DAYTIME,
  INCREASEMENT_RATE,
  LAUNCH_TIMESTAMP,
} from '../../config/dev.js';
import { Button } from '@solana/wallet-adapter-react-ui/lib/Button';

const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

const DECIMAL = 1000000000;
export interface EvolveProps {
  // connection: anchor.web3.Connection;
  // txTimeout: number;
  // rpcHost: string;
}

interface NFTInfo {
  name: string,
  imageUrl: string,
  mint: PublicKey,
  tokenAccount: PublicKey,
  updateAuthority: PublicKey,
}

const EvolvePage = (props: EvolveProps) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const { addToast } = useToasts();

  const solanaClient = new SolanaClient({ rpcEndpoint: CLUSTER_API } as SolanaClientProps);

  const emptyNfts = ['', '', '', '', '', '', '', '', ''];

  const [loading, setLoading] = useState(false);
  const [left, setLeft] = useState(-1);
  const [right, setRight] = useState(-1);
  const [walletNfts, setWalletNfts] = useState<NFTInfo[]>([]);
  const [stakedNfts, setStakedNfts] = useState<NFTInfo[]>([]);
  const [breeds, setBreeds] = useState<any>([]);
  const [mode, setMode] = useState(1);
  const txTimeout = 30000;
  const [during, setDuring] = useState(0);

  const [nftcard, setNftcard] = useState(false)
  const [nftcard2, setNftcard2] = useState(false)

  const [walletBalance, setWalletBalance] = useState(0);
  const [tokenFrom, setTokenFrom] = useState('');
  useEffect(() => {
    (async () => {
      if (!wallet) return;
      setLoading(true);
      await getWalletBalance();
      await getWalletNfts();
      await getStakedNfts();
      setLoading(false)
    })()
  }, [wallet]);

  useEffect(() => {
    (async () => {
      if (!wallet) return;
      await getWalletBalance();
      let breedList = [];
      const provider = getProvider();
      const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
      let [pool, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pool'), wallet.publicKey.toBuffer()],
        program.programId
      );
      const { result } = await getAccountInfo(pool.toBase58());
      if (!result?.value) return;

      const data = await program.account.pool.fetch(pool);
      const nfts: any = data.nfts
      for (let i = 0; i < nfts.length; i++) {
        let fatherInfo: NFTInfo = stakedNfts[0];
        let motherInfo: NFTInfo = stakedNfts[0];
        for (let j = 0; j < stakedNfts.length; j++) {
          if (nfts[i].fatherMint.toString() === stakedNfts[j].mint.toString())
            fatherInfo = stakedNfts[j];
          if (nfts[i].motherMint.toString() === stakedNfts[j].mint.toString())
            motherInfo = stakedNfts[j];
        }
        const newBreed = {
          father: fatherInfo,
          mother: motherInfo,
          imageUrl: 'Ape_gif2.gif',
          canClaim: false,
          daysPassed: 0,
          startDate: nfts[i].startDate,
          endDate: nfts[i].endDate,
        }

        breedList.push(newBreed);
      }
      await updateBreedList(breedList);
      // await getWalletBalance();
    })()
  }, [stakedNfts])

  // useEffect(() => {
  //   setNftcard(true)
  // }, [nftcard])
  const getWalletBalance = async () => {
    if (!wallet) return;
    const result: any = await getTokenAccountByOwner(wallet!.publicKey.toString(), REWARD_TOKEN_MINT);
    if (result?.result?.value?.length > 0) {
      let blockhash = await getRecentBlockHash();
      let currentTimeStamp = await getBlockTime(blockhash.result.context.slot);
      let durTime = (currentTimeStamp.result - LAUNCH_TIMESTAMP) / DAYTIME;
      let total: number = MINIMUS_SPL_TOKEN * (1 + durTime * INCREASEMENT_RATE / 100);
      setDuring(Math.floor(total));
      setTokenFrom(result.result.value[0].pubkey.toString());
      const { value } = result.result;
      if (value?.length > 0) {
        let totalBalance = 0;
        value.forEach((v: any) => {
          totalBalance += v.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
        });
        setWalletBalance(totalBalance);
      }
    }
  }

  const getWalletNfts = async () => {
    const pubKey = wallet!.publicKey?.toString();
    let walletNFTs: NFTInfo[] = [];
    let result = await solanaClient.getAllCollectibles([pubKey], NFT_UPDATE_AUTHORITY, NFT_NAME_PREFIX);
    if (result[pubKey]) {
      result[pubKey].forEach((nft: any) => {
        walletNFTs.push({
          name: nft.name, imageUrl: nft.imageUrl, mint: new PublicKey(nft.mint),
          tokenAccount: new PublicKey(nft.tokenAccount), updateAuthority: new PublicKey(nft.updateAuthority)
        });
      });
      console.log(walletNFTs[left])
      setWalletNfts(walletNFTs);
    }
  }
  const getStakedNfts = async () => {
    if (!wallet)
      return;
    const provider = getProvider();
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    let stakedNFTs: NFTInfo[] = [];

    let [pool, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('pool'), wallet.publicKey.toBuffer()],
      program.programId
    );

    let [pool_signer, _nonce_signer] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('pool signer'), wallet.publicKey.toBuffer()],
      program.programId
    );

    let pubKey = pool_signer.toString();
    let result = await solanaClient.getAllCollectibles([pubKey], NFT_UPDATE_AUTHORITY, NFT_NAME_PREFIX);
    if (result[pubKey]) {
      result[pubKey].forEach((nft: any) => {
        stakedNFTs.push({
          name: nft.name, imageUrl: nft.imageUrl, mint: new PublicKey(nft.mint),
          tokenAccount: new PublicKey(nft.tokenAccount), updateAuthority: new PublicKey(nft.updateAuthority)
        });
      });
      setStakedNfts(stakedNFTs)
    }
  }

  const updateBreedList = async (breedList: any[]) => {
    if (!wallet) return;
    try {

      let blockhash = await getRecentBlockHash();
      let currentTimeStamp = await getBlockTime(blockhash.result.context.slot);
      let updatedBreedList = breedList.map((breed: any) => {
        let daysPassed = (currentTimeStamp.result - breed.startDate) / DAYTIME;

        return {
          ...breed,
          daysPassed: daysPassed > 0 ? Math.floor(daysPassed) : 0,
          canClaim: (currentTimeStamp.result > breed.endDate)
        }
      })
      setBreeds(updatedBreedList);
      await getWalletBalance();
    } catch (error) {
      console.log("error occured: ", error)
    }
  }

  const leftNFTClicked = (index: number) => {
    setNftcard(true)
    setTimeout(() => {
      setNftcard(false)
    }, 500);
    setLeft(index)
    setRight(-1)
  }
  const rightNFTClicked = (index: number) => {
    setNftcard2(true)
    setTimeout(() => {
      setNftcard2(false)
    }, 500);
    if (available(index)) {
      setRight(index);
    }
  }
  const available = (index: number) => left >= 0 && left !== index;

  const getProvider = () => {
    if (wallet)
      return new anchor.Provider(connection, wallet as anchor.Wallet, COMMITMENT as anchor.web3.ConfirmOptions);
  }

  const getAtaForMint = async (
    wallet: PublicKey,
    mint: PublicKey
  ) => {
    return (
      await PublicKey.findProgramAddress(
        [wallet.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )
    )[0]
  }

  const makeStakeTx = async (program: anchor.Program<any>, poolSigner: PublicKey, pool: PublicKey, left: number, right: number) => {
    const ataFather = new Keypair();
    const ataMother = new Keypair();

    const aTokenAccountRent = await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span
    )
    const father = walletNfts[left];
    const mother = walletNfts[right];
    let transaction = [];
    let signers: any[] = [];

    if (!wallet)
      return;
    if (!tokenFrom) {
      addToast("No token account exist!", {
        appearance: 'error',
        autoDismiss: true,
      })
      return;
    }

    let tokenTo = new PublicKey(REWARD_TOKEN_ACCOUNT);
    // Create ATokenAcount for father
    transaction.push(SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: ataFather.publicKey,
      lamports: aTokenAccountRent,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID
    }));
    transaction.push(Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      father.mint,
      ataFather.publicKey,
      poolSigner
    ));

    // Create ATokenAccount for mother
    transaction.push(SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: ataMother.publicKey,
      lamports: aTokenAccountRent,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID
    }));
    transaction.push(Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      mother.mint,
      ataMother.publicKey,
      poolSigner
    ));

    signers.push(ataFather)
    signers.push(ataMother)
    transaction.push(program.instruction.stake({
      accounts: {
        user: wallet.publicKey,
        pool: pool,
        fatherMint: father.mint,
        fatherFrom: father.tokenAccount,
        fatherTo: ataFather.publicKey,
        motherMint: mother.mint,
        motherFrom: mother.tokenAccount,
        motherTo: ataMother.publicKey,
        tokenFrom: new PublicKey(tokenFrom),
        tokenTo: tokenTo,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY
      },
      signers
    }));
    return { transaction, signers, ataFather, ataMother }
  }
  const onBreed = async () => {
    if (left < 0 || right < 0) {
      addToast("Select parents!", {
        appearance: 'error',
        autoDismiss: true,
      })

      return;
    }
    let blockhash = await getRecentBlockHash();
    let currentTimeStamp = await getBlockTime(blockhash.result.context.slot);
    if (mode === 2 || mode === 1) {
      if (walletBalance < ((currentTimeStamp - LAUNCH_TIMESTAMP) / DAYTIME * INCREASEMENT_RATE / 100 + 1) * MINIMUS_SPL_TOKEN) {
        addToast("Insufficient SPL token!", {
          appearance: 'warning',
          autoDismiss: true,
        })
        return;
      }
    }

    setLoading(true);
    const provider = getProvider();
    const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);

    try {
      if (!wallet) {
        addToast("Connect your wallet!", {
          appearance: 'warning',
          autoDismiss: true,
        })
        setLoading(false)
        return;
      }
      const value = await connection.getBalance(wallet.publicKey);
      let solBalance = value / DECIMAL;
      console.log("solana balance: ", solBalance);
      if (solBalance < 0.1) {
        addToast("Charge your wallet!", {
          appearance: 'warning',
          autoDismiss: true,
        })
        setLoading(false);
        return;
      }

      let instructionSet = [], signerSet = [];
      let transaction = [];
      let signers: any = [];
      let [pool, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pool'), wallet.publicKey.toBuffer()],
        program.programId
      );
      let [poolSigner, _nonceSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pool signer'), wallet.publicKey.toBuffer()],
        program.programId
      );

      const { result } = await getAccountInfo(pool.toBase58());
      if (!result.value) {
        transaction.push(program.instruction.createUserPool(_nonce, _nonceSigner, {
          accounts: {
            pool: pool,
            poolSigner: poolSigner,
            user: wallet.publicKey,
            systemProgram: SystemProgram.programId
          }
        }));
      }

      let newStakeTx: any = await makeStakeTx(program, poolSigner, pool, left, right);
      transaction = [...transaction, ...newStakeTx.transaction];
      signers = [...newStakeTx.signers];
      instructionSet.push(transaction);
      signerSet.push(signers)

      await sendTransactions(connection, wallet, instructionSet, signerSet);

      walletNfts[left].tokenAccount = newStakeTx.ataFather.publicKey;
      walletNfts[right].tokenAccount = newStakeTx.ataMother.publicKey;
      const newBreed = {
        father: walletNfts[left],
        mother: walletNfts[right],
        imageUrl: 'Ape_gif2.gif',
        canClaim: false,
        daysPassed: 0,
      }
      breeds.push(newBreed);
      setBreeds(breeds);
      await updateBreedList(breeds);

      setLoading(false);
      setLeft(-1)
      setRight(-1)
    }
    catch (error) {
      console.log('error', error);
      addToast("Generating failure!", {
        appearance: 'error',
        autoDismiss: true,
      })
      setLoading(false)
      return;
    }

    addToast("Generating success!", {
      appearance: 'success',
      autoDismiss: true,
    })

    let remainNfts = walletNfts.filter((ntf, index) => { return [left, right].indexOf(index) == -1 });
    setWalletNfts(remainNfts);
    setLeft(-1);
    setRight(-1);
  }

  const onUnstake = async (id: any) => {
    try {
      setLoading(true);
      if (!wallet) {
        addToast("Connect your wallet!", {
          appearance: 'warning',
          autoDismiss: true,
        })
        return;
      }
      const breed = breeds[id];
      const provider = getProvider();
      const program = new anchor.Program(IDL, new PublicKey(PROGRAM_ID), provider);
      let [pool, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pool'), wallet.publicKey.toBuffer()],
        program.programId
      );
      let [poolSigner, _nonceSigner] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from('pool signer'), wallet.publicKey.toBuffer()],
        program.programId
      );

      const { result } = await getAccountInfo(pool.toBase58());

      const data = await program.account.pool.fetch(pool);

      let instructionSet = [];
      let signerSet = [];
      let transaction = [];
      let signers: any = [];
      let instructions: any = [];
      if (result.value) {

        let ataFatherTx: any;
        try {
          ataFatherTx = await makeATokenAccountTransaction(connection, wallet.publicKey, wallet.publicKey, breed.father.mint);
          if (ataFatherTx.instructions.length !== 0) {
            instructions = [...ataFatherTx.instructions];
            signers = [...ataFatherTx.signers];
          }
        } catch (error) {
          console.log("error occured when making reward Atoken account", error);
          setLoading(false);
        }
        let ataFather = ataFatherTx.tokenTo;


        let ataMotherTx: any;
        try {
          ataMotherTx = await makeATokenAccountTransaction(connection, wallet.publicKey, wallet.publicKey, breed.mother.mint);
          if (ataMotherTx.instructions.length !== 0) {
            instructions = [...instructions, ...ataMotherTx.instructions];
            signers = [...signers, ...ataMotherTx.signers];
          }
        } catch (error) {
          console.log("error occured when making reward Atoken account", error);
          setLoading(false);
        }
        let ataMother = ataMotherTx.tokenTo;
        // instructionSet.push(instructions);
        // signerSet.push(signers);

        // instructions = [];
        // signers = [];


        let instruction: any = [];
        instruction.push(program.instruction.unstake({
          accounts: {
            pool: pool,
            poolSigner: poolSigner,
            user: wallet.publicKey,
            fatherMint: breed.father.mint,
            fatherFrom: breed.father.tokenAccount,
            fatherTo: ataFather,
            motherMint: breed.mother.mint,
            motherFrom: breed.mother.tokenAccount,
            motherTo: ataMother,
            tokenProgram: TOKEN_PROGRAM_ID
          }
        }));
        instructions = [...instructions, ...instruction];

        // instructionSet.push(instructions);
        // signerSet.push(signers);

        let instructions2 = [];
        let signers2 = [];

        const candyMachineId = new PublicKey(EGG_CM_ID);
        const candyMachine = await getCandyMachineState(
          wallet as anchor.Wallet,
          candyMachineId,
          connection
        );
        const mint = anchor.web3.Keypair.generate();
        const mintTx: any = await getMintTx(candyMachine, wallet.publicKey, mint);
        // instructions = [...mintTx.instructions, ...mintTx.cleanupInstructions];
        // signers = [...mintTx.signers];
        instructions2 = [...mintTx.instructions.slice(0, 4), ...mintTx.cleanupInstructions, ...instructions];
        signers2 = [];
        console.log(instructions2)
        instructionSet.push(instructions2);
        signerSet.push([mintTx.signers[0]]);
        // let new_instruction : any = [mintTx.instructions[4], ...instructions];
        // console.log(instructions, mintTx.instructions[5])
        instructionSet.push([mintTx.instructions[4]]);
        signerSet.push([]);
        // instructionSet.push(instructions);
        // signerSet.push(signers);
        await sendTransactions(connection, wallet, instructionSet, signerSet, SequenceType.StopOnFailure);

        breed.father.tokenAccount = ataFather;
        breed.mother.tokenAccount = ataMother;
        walletNfts.push(breed.father)
        walletNfts.push(breed.mother)
        setWalletNfts(walletNfts);
      }
      else {
        addToast("Failed Claiming Frozen Baby Ape", {
          appearance: 'error',
          autoDismiss: true,
        })
        setLoading(false)
        return;
      }
      setLoading(false)
    }
    catch (error) {
      console.log('error', error);
      addToast("Failed Claiming Frozen Baby Ape", {
        appearance: 'error',
        autoDismiss: true,
      })
      setLoading(false)
      return;
    }

    let remainBreeds = breeds.filter((ntf: any, i: number) => { return [id].indexOf(i) == -1 });
    setBreeds(remainBreeds);

    addToast("Claimed Frozen Baby Ape!", {
      appearance: 'success',
      autoDismiss: true,
    })
  }
  const makeATokenAccountTransaction = async (connection: anchor.web3.Connection, wallet: anchor.web3.PublicKey, owner: anchor.web3.PublicKey, mint: anchor.web3.PublicKey) => {
    const { SystemProgram, Keypair } = anchor.web3;
    const instructions = [], signers = [];
    const aTokenAccounts = await connection.getParsedTokenAccountsByOwner(owner, { mint: mint });
    const rent = await connection.getMinimumBalanceForRentExemption(
      AccountLayout.span
    )
    let tokenTo;
    if (aTokenAccounts.value.length === 0) {
      const aTokenAccount = new Keypair();
      instructions.push(SystemProgram.createAccount({
        fromPubkey: wallet,
        newAccountPubkey: aTokenAccount.publicKey,
        lamports: rent,
        space: AccountLayout.span,
        programId: TOKEN_PROGRAM_ID
      }));
      instructions.push(Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        mint,
        aTokenAccount.publicKey,
        owner
      ));
      signers.push(aTokenAccount);
      tokenTo = aTokenAccount.publicKey;
    }
    else {
      tokenTo = aTokenAccounts.value[0].pubkey;
    }

    return { instructions, signers, tokenTo }
  }
  return (
    <WalletModalProvider>
      <div>
        {
          loading ?
            <div id="preloader"></div> :
            <div id="preloader" style={{ display: 'none' }}></div>
        }
        <div className="main-wrap">
          <div className="offcanvas-menu">
            <ul className="offmenu" id="menuParent">
              <span className="offcanvas-close"><i className="fal fa-times"></i></span>
              <li><Link to='/generate'><span>GENERATE FROZEN BABY APE</span></Link></li>
            </ul>
          </div>
          <div className="offcanvas-overlay"></div>
          <div className='page-container' >
            <header className="header-section">
              <div className="header-container">
                <span className="logo">
                  {/* <h1><Link to="/"><img src="images/punky_apes_logo.png" />{" - "}UNFREEZING ENGINE</Link></h1> */}
                  <h1><Link to="/">UNFREEZING ENGINE</Link></h1>
                </span>
                {/* <div className="main-menu d-lg-block d-none">
                <ul>
                  <li><Link to='/generate'><span className="active">GENERATE FROZEN BABY APE</span></Link></li>
                </ul>
              </div>
              <span className="offcanvas-open d-lg-none d-block">
                <i className="far fa-bars"></i>
              </span> */}
                <div className="content-step">
                  {/* <div className="head-part">
                    <p className="mt-2 mb-2">Total $PAC</p>
                  </div> */}
                  <div className='header-form' >
                    <Button className="select-box1 left-box1" style={{ cursor: 'auto', display: 'flex' }} >$PAC: {walletBalance.toFixed(2)}</Button>
                    <WalletMultiButton className="select-box1 right-box1" />
                  </div>
                </div>
              </div>
            </header>
            <main>
              <section className="content-section">
                <div className="container">
                  <div className="content-section-inner">
                    <div className="row1 content-row justify-content-between">
                      <div className="content-step">
                        {/* <div className="head-part">
                        <p className="mt-2 mb-2">Your Wallet</p>
                      </div> */}
                        {/* <div >
                        <WalletMultiButton className="select-box1" />
                      </div> */}
                      </div>

                    </div>
                    <div className="row1 content-row justify-content-between">

                      <div className='content-left' >
                        <div className="content-step" style={{ zIndex: 10 }}>
                          <div className="head-part">
                            <h3>Punky Ape 1</h3>
                          </div>
                          <div className="egg-box">
                            {
                              walletNfts.map((nft: NFTInfo, index: number) => {
                                return <div className='nft-card'
                                >
                                  <div
                                    key={index}
                                    // className={cx("single-egg",{"selected-egg":index === left, "disabled-egg":drakes[index]?.size === 'king'})} 
                                    className={cx("single-egg", { "selected-egg": index === left })}
                                    style={{ backgroundImage: `url(${nft.imageUrl})`, backgroundSize: 'cover' }}
                                    onClick={e => leftNFTClicked(index)} ></div>
                                  <p>&nbsp;{nft?.name.replace('NFT #', '')}</p>
                                </div>

                              }
                              )
                            }
                            {
                              emptyNfts.map((nft, index) =>
                                index < 9 - walletNfts.length ?
                                  <div
                                    key={index}
                                    className={`single-egg disabled-egg`}>
                                  </div> : ''
                              )
                            }
                          </div>
                          {/* <p className="mt-2">Your NFTs</p> */}
                        </div>
                        <div className="content-step" style={{ zIndex: 10, marginTop: '20px' }}>
                          <div className="head-part text-left">
                            <h3>Punky Ape 2</h3>
                          </div>
                          <div className="egg-box">
                            {
                              walletNfts.map((nft, index) => {
                                return <div className='nft-card'
                                >
                                  <div key={index} className={cx("single-egg", { "selected-egg": index === right, "disabled-egg": !available(index) })} style={{ backgroundImage: `url(${nft.imageUrl})`, backgroundSize: 'cover' }} onClick={e => rightNFTClicked(index)} ></div>
                                  <p>&nbsp;{nft?.name.replace('NFT #', '')}</p></div>
                              }
                              )
                            }
                            {
                              emptyNfts.map((nft, index) =>
                                index < 9 - walletNfts.length ?
                                  <div
                                    key={index}
                                    className={`single-egg disabled-egg`}>
                                  </div> : ''
                              )
                            }
                          </div>
                          {/* <p className="mt-2">Your NFTs</p> */}
                        </div>
                      </div>

                      <div className="content-step position-relative content-middle" style={{ zIndex: 1 }}>
                        <div className="head-part">
                          <h3 className="text-center">3D Baby Ape</h3>
                        </div>
                        <div className="evolve-box-card-wrap during-value" style={{ paddingTop: '0' }}>
                          {/* <span>3D Punky Baby Apes:<br />2 Punky Apes + {during} $PAC coins</span> */}
                          <p>2 Punky Apes + <span className='text-during' >{during}</span> $PAC coins</p>
                        </div>
                        <div className="evolve-box">
                          {/* <img src="images/shape.png" alt="" className="evolve-shape" /> */}


                          <div className="evolve-box-card-wrap">
                            <div className="evolve-box-card evolve-left-card" >
                              <div className={nftcard ? 'nft-card-animation' : 'evolve-box-card-inner'} style={{ backgroundImage: left >= 0 ? `url(${walletNfts[left]?.imageUrl})` : '', backgroundSize: 'cover' }}>
                                {left === -1 && <img src="images/questionmark.svg" alt="" className="questionmark" />}
                              </div>
                              <p className="nft-label">&nbsp;{left >= 0 && walletNfts[left]?.name.replace('NFT #', '')}</p>
                            </div>
                            {/* <img src="images/orange-plus.svg" alt="" className="plus-img" /> */}
                            <button className='breed-btn' onClick={() => { onBreed() }} >Breed</button>
                            <div className="evolve-box-card evolve-right-card">
                              <div className={nftcard2 ? 'nft-card-animation2' : 'evolve-box-card-inner'} style={{ backgroundImage: right >= 0 ? `url(${walletNfts[right]?.imageUrl})` : '', backgroundSize: 'cover' }}>
                                {right === -1 && <img src="images/questionmark.svg" alt="" className="questionmark" />}
                              </div>
                              <p className="nft-label">&nbsp;{left >= 0 && walletNfts[right]?.name.replace('NFT #', '')}</p>
                            </div>
                          </div>

                          {/* <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p className="nft-label">&nbsp;{left >= 0 && walletNfts[left]?.name.replace('NFT #', '')}</p>
                            <p className="nft-label">&nbsp;{right >= 0 && walletNfts[right]?.name.replace('NFT #', '')}</p>
                          </div> */}
                          <div className="content-step mb-2">
                            <div className="head-part">
                            </div>
                          </div>
                          {/* <span className="button default-big-button" onClick={() => { onBreed() }}>Generate Frozen Baby</span> */}
                        </div>
                      </div>
                      <div className='content-right' >
                        <p className="mt-2 mb-2">Frozen Baby Apes</p>
                        <div className="breeds">
                          <div className='breeds-control' >
                            {
                              breeds.map((breed: any, _index: number) =>
                                <div className="breed">

                                  <div className="content-row parents">
                                    <img src={`${breed.father?.imageUrl}`} alt="Father Image" className="father" />
                                    <img src="images/orange-plus.svg" alt="" className="plus-img" />
                                    <img src={`${breed.mother?.imageUrl}`} alt="Mother Image" className="mother" />
                                  </div>
                                  <div className="child">
                                    <img src={`/images/nfts/${breed.imageUrl}`} alt="Child Image" />
                                  </div>


                                  <div className='text-center mt-3 mb-2'>
                                    <p>{breed?.daysPassed?.toFixed(0)}{" "} days passed</p>
                                  </div>
                                  <div className="content-row claim mt-2">
                                    <button className={breed.canClaim ? "button default-big-button" : "button default-big-button-disabled"} disabled={!breed.canClaim} onClick={() => { onUnstake(_index) }}>Claim</button>
                                  </div>
                                </div>
                              )
                            }
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </section>
            </main>
            <footer className="footer-section" />
          </div>

        </div>
      </div>
    </WalletModalProvider>
  );
}

export default EvolvePage;
