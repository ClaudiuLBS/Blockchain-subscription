const switchNetwork = (networkName) => {
  if (networkName == "rinkeby") {
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x4" }],
    });
  } else if (networkName == "bsc") {
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x61" }],
    });
  } else if (networkName == "mumbai") {
    window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
  }
};

export default switchNetwork;
