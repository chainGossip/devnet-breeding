# Getting Started
## Before run project you should configure configuration file
Configure

~config\main.js

    PROGRAM_ID to programId of the smart contract.
    NFT_UPDATE_AUTHORITY and NFT_NAME_PREFIX to your NFT's to breed.
    EGG_UPDATE_AUTHORITY and EGG_NAME_PREFIX to your Egg NFT's after breeding.
    EGG_CM_ID is candyMachine Id to mint egg NFT.
    BABY_CM_ID is candyMachine Id to mint baby NFT.
    REWARD_TOKEN_MINT is token address which you pay for breeding.
    REWARD_TOKEN_ACCOUNT is token account to which you pay for breeding and fast melt.
    BURN_ACCOUNT is token account to which you send your egg NFT when unfreezing.
    MINIMUS_SPL_TOKEN is amount of token to pay for breeding at start time.
    LAUNCH_TIMESTAMP is the start time of breeding.
    INCREMENT RATE is increasement percent per day of token amount to pay for breeding after start time. 
    PERIOD1 is period for Normal mode melting.
    PERIOD2 is period for Faster mode melting.
    TOKEN_FOR_FASTER_MODE is amount of token to pay for Faster mode melting.
## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.



