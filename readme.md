# Blockchain Subscription
_Rinkeby/Mumbai/BSC Testnet_
## How it works

- Subscribe to one network
- The backend will subscribe you automaticaly to the other 2 chains
- Get a reward everyday, on every chain
- The subscription will be canceled after you claim 30 rewards

## Tech

- [React](https://reactjs.org/) - frontend
- [Node Express](https://expressjs.com/) - backend
- [Hardhad](https://hardhat.org/) - blockchain

## Installation
- ***Add the testnet networks to metamask***  
1 [Rinkeby](https://umbria.network/connect/ethereum-testnet-rinkeby)  
2 [BSC Testnet](https://umbria.network/connect/binance-smart-chain-testnet)  
3 [Mumbai Testnet](https://umbria.network/connect/matic-testnet-mumbai)  
- ***Install blockchain npm packages***
```
$ cd blockchain/
$ npm i
$ touch .env
```
- ***Configure the .env file***
```
PRIVATE_KEY=<wallet key>
INFURA_API_KEY=<infura api key>
MUMBAI_API_KEY=<alchemy mumbay api key>
```
- ***Deploy contract on all chains***
```
$ npx hardhat run --network rinkeby scripts/deployRinkeby.js
$ npx hardhat run --network mumbai scripts/deployMumbai.js
$ npx hardhat run --network bsc scripts/deployBsc.js
```
- ***Install backend npm packages, then copy the .env file from blockchain folder***
```
cd backend/
npm i
npm run start
```
- ***Install frontend npm packages***
```
cd frontend/
npm i
npm run start
```
- ***Go to http://localhost:3000/***
