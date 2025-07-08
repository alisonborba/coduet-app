# 🛠️ CodeDuet React App (DApp)

• Vercel Live demo: [coduet.vercel.app](https://coduet.vercel.app/)
• Anchor Program: [github.com/alisonborba/coduet](https://github.com/alisonborba/coduet)

> A decentralized application (dApp) built on Solana to connect developers seeking help with other developers ready to collaborate and earn.

[![Watch the demo](https://cdn.loom.com/sessions/thumbnails/ed79f09fc67648f983b47498ae12c987-45a003ce9fd4c10c-full-play.gif)](https://www.loom.com/share/ed79f09fc67648f983b47498ae12c987?t=116&sid=563115b6-c55f-4466-8e04-69cb992cb07b)

---

## 📌 Overview

CodeDuet is a Web3-powered platform that allows users to request developer help through paid job posts, match with potential helpers (bidders), and settle jobs via smart contract transactions on the Solana blockchain.

This repository contains the **React + Next.js** front-end of the project, which interacts with the Anchor smart contract deployed on **Solana Devnet**.

---

## 🚀 Features

- ✍️ **Create Help Post**: Users can publish posts requesting assistance with coding tasks.
- ❌ **Cancel Posts**: Publishers can cancel open posts; only the platform fee is retained.
- 💰 **Fee Management (5%)**: Platform fees are automatically deducted upon post creation or cancellation.
- 📩 **Apply for Jobs**: Helpers can apply to posts as bidders.
- ✅ **Complete Contract**: Once the helper completes the task, the publisher can release the funds.
- 🔐 Full smart contract validation via [Anchor](https://project-serum.github.io/anchor/) framework.
- 🎨 Responsive UI powered by Tailwind CSS.


## 🧪 Getting Started

### 📦 Install dependencies
```bash
npm install
```

### ▶️ Run locally
```bash
npm run dev
```
By default, it runs using Vite for fast hot-reloading.

## ⚙️ Environment

Make sure to set up the following environment variables if needed:

```bash
VITE_MAIN_VAULT_KEYPAIR=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29...]
```

## 🚀 Deployment

This project is deployed using [**Vercel**](https://vercel.com), providing fast and seamless continuous deployment for the front-end application.

---


## 📂 Folder Structure

- `/src/components`: Reusable UI components.
- `/src/lib`: Utilities to interact with the smart contract (get PDA, program instance, etc).
- `/src/pages`: Next.js page routes.
- `/tests`: Integration tests (using Mocha + Anchor client).

## 🧰 Tech Stack

| Layer              | Technology                                                                 |
|-------------------|----------------------------------------------------------------------------|
| Blockchain         | [Solana](https://solana.com/) (Devnet)                                     |
| Smart Contract     | [Anchor Framework](https://github.com/coral-xyz/anchor)                    |
| Frontend           | [React](https://reactjs.org/) + [Next.js](https://nextjs.org/)             |
| Build Tool         | [Vite](https://vitejs.dev/)                                                 |
| Web3 Integration   | [@solana/web3.js](https://github.com/solana-labs/solana-web3.js)           |
| Wallet Support     | Phantom Wallet (via browser extension)                                     |
| Styling            | [Tailwind CSS](https://tailwindcss.com/)                                   |
| Anchor JS Client   | [@coral-xyz/anchor](https://github.com/coral-xyz/anchor/tree/master/ts)    |

---

## 📈 Improvements and Contributions

This project is built during spare time and is a **work in progress**. Contributions and suggestions are welcome!

### 🔧 Upcoming Improvements

- Make sure the helpers filled the wallet field before send bids.
- Add the completeContract transaction solana explorer link.
- Form validations and toast notifications enhancements.
- Contract status indicators and better error handling.
- Unit tests and visual feedback.
- Wallet disconnection logic.
- Reusable hooks for Solana interactions.
- Fix others (many 😅) bugs.

---

## 🤝 Contributing

If you're interested in contributing or have ideas for improvement, feel free to fork the repo, create a issue or submit a pull request.

📧 Contact me: [alisonborbaa@gmail.com](mailto:alisonborbaa@gmail.com)  
🔗 GitHub: [@alisonborba](https://github.com/alisonborba)
👨‍💼 Linkedin: [alison-borba](https://www.linkedin.com/in/alison-borba/)

---

## 🌐 Related Repositories

- [Anchor Smart Contract Code](https://github.com/alisonborba/coduet)

---

## 💡 Keywords

**Solana**, **Web3**, **DApp**, **Anchor**, **Next.js**, **React**, **DeFi**, **Smart Contract**,  
**Tailwind**, **Blockchain**, **Phantom Wallet**, **Decentralized Jobs**, **Open Source**,  
**Developer DAO**, **Gasless Transactions**

---

## 📜 License

MIT License — free to use, fork, build on.
