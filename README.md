# Sarcophagus Interface

[![Discord](https://img.shields.io/discord/753398645507883099?color=768AD4&label=discord)](https://discord.com/channels/753398645507883099/)
[![Twitter](https://img.shields.io/twitter/follow/sarcophagusio?style=social)](https://twitter.com/sarcophagusio)

Sarcophagus is a decentralized dead man's switch built on Ethereum and Arweave.

## Overview

This repository contains the React application that allows users to interact with the Sarcophagus smart contracts using a web browser and Ethereum wallet.

## Prerequisites

First, clone the repository

```
git clone ...
```

then, install the necessary dependencies:

```
npm install
npm run start
```

At the time of this writing, the project currently uses Node v17.4.0. It is recommended to use `nvm use` in root directory to switch to the correct version of Node.

Also Windows users will need to add .npmrc file with the contents script-shell=powershell

Finally, copy `.env.example` into `.env` in root directory and update your environment variables.

Note that for local development with metamask against the archaeologist service and a hardhat node, you'll need to set the chain id to 31337 in custom network settings. Metamask's default is 1337.
## Community

[![Discord](https://img.shields.io/discord/753398645507883099?color=768AD4&label=discord)](https://discord.com/channels/753398645507883099/)
[![Twitter](https://img.shields.io/twitter/follow/sarcophagusio?style=social)](https://twitter.com/sarcophagusio)

We can also be found on [Telegram](https://t.me/sarcophagusio).

Made with :skull: and proudly decentralized.
