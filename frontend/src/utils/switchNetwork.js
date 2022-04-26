const switchNetwork = (networkName) => {
  if (networkName == "rinkeby") {
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }],
    });
  } else if (networkName == "bsc") {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x61",
          rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
          chainName: "BSC Testnet",
          nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
          },
          blockExplorerUrls: ["https://explorer.binance.org/smart-testnet"],
        },
      ],
    });
  } else if (networkName == "mumbai") {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x13881",
          rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
          chainName: "Mumbai Testnet",
          nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
          },
          blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
        },
      ],
    });
  }
};

export default switchNetwork;
