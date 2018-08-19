# ROCK PAPER ETH

:moon:
:page_facing_up:
:scissors:

Basic 2 player Rock/Paper/Scissors game. All blockchain baby. Front end bootstrap/shards/web3/metamask, backend solidity/truffle/rinkeby/Ethereum.

This project was submitted as part of the [Consensys 2018 Developer Program](https://consensys.net/academy/2018developer/).

Hosted at http://rock-paper-eth.com on Amazon Elastic Beanstalk.

Hosted at http://gateway.ipfs.io/ipns/QmRCcZ2Ts2Hd4V8m3Lyp1G9HYuLyw58mc9r73ipmfwQrJD with [IPFS](https://ipfs.io/)

## Game flow

The game is broken down into 4 phases:

1. Register - each player registers with 0.1 eth and their address is stored.
2. Encrypt - each player encrypts their hand (rock, paper, or scissors) with a secret key, both are encrypted and recorded.
3. Decrypt - after each player has encrypted their hand, they then decrypt to reveal the winner.
4. Finalise - the winner is determined by the results matrix and paid out the total of 0.2 eth, or each player is returned their bet in event of a tie.

The player first registers and puts up 0.1 Ethereum to bet. A second player does the same. They play their hand with their pick and a secret phrase to ensure everything is secure. They then reveal their hand once both players have guessed, and then they both win. Or only one wins, I can't remember. Everyone wins in the end though.

Once the first player reveals his hand, a timer is started. If the other player does not reveal his hand in 5 minutes, the first player can claim the winnings. This is to prevent idiots from not revealing their hands in time.

## User stories

As an internet and Ethereum user, I can challenge my friends to a simple game of rock paper scissors, and know that neither player cheated by changing their hand at the last second, or with insider knowledge. This can be used to make important decisions, like who takes out the trash.

As a bored person, I can challenge some random internet stranger to a game of rock paper scissors, with each game taking at least 2 minutes as opposed to the classical method where each game takes 3 seconds.

## Tests

Tests for the RockPaperEth.sol smart contract are written in javascript and provided at test/TestRockPaperEth.js. Run the tests with truffle test after compiling, you should see 21 tests pass :)

All tests are commented in the source file with their functionality, all major contract functions are tested to ensure they function correctly. Game flow and helper functions have all outputs tested and ensure the game can only be played how it is meant to be played. The Owner and Pausable library are both tested to ensure control.

# Getting started
## Setup the local environment

Clone the git repository and change to its directory and initialize npm with the following command:
```
git clone https://github.com/positivenoise/rockpapereth.git
cd rockpapereth && npm init -y
```
Ensure the following node packages are installed by running the following commands:

- lite-server: `npm install lite-server`
- truffle: `npm install -g truffle`
- truffle-hdwallet-provider: `npm install truffle-hdwallet-provider` - Windows users may need `npm install -g windows-build-tools` if they are experiencing errors
- openzeppelin-solidity: `npm install -E openzeppelin-solidity`

If you are testing the contracts locally start your test RPC client on port 8545, then compile, migrate and test the contracts with: 
```
truffle compile
truffle migrate
truffle test
```
## Running the web interface

The front end interface is run with lite-server for local testing purposes. Use the following command from within the rockpapereth directory to run:

`npm run dev`

A browser window should pop up automagically after the command is run pointing to http://localhost:3000, otherwise manually type this address in your preferred browser. Metamask is required to send transactions and play the game.

The front end can also be deployed with docker, please see further down the readme for docker instructions.

## Remix deployment

If you'd like to play around with the contract head on over to https://remix.ethereum.org/ and paste the code in, ensure you have 0.1 eth in the value when you register.

## We are live on Rinkenby!

Deploy the contract with `truffle migrate --network rinkeby` after configuring the correct mnenomic and API key within truffle.js if you'd like to deploy the contract yourself on the rinkeby test network. This is not required to play on rinkeby. Currently the RockPaperEth contract is deployed at `0x2DD85B27956CEa94dD32Eb385447bcceeBAE9CC4`

## Docker instructions

A docker image is provided for people who tell their friends about docker, which is nobody.

Lazy people run `docker run -p 80:80 downgrayedd/rockpapereth` to setup a local environment listening on port 80. Please note this is just the frontend and will not work locally unless the contracts are migrated with truffle first, but will always work with rinkeby (should always work with rinkeby)

Hackers run `docker build -t rockpapereth` to build their own image. 

It is kept updated with the `docker push downgrayedd/rockpapereth` command but only I can do that so why am I telling you.

The `Dockerrun.aws.json` file is an example of how to run this image in an Amazon EBS image, all in a 13 line file. Wow.