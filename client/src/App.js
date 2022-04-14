import React, {Component} from "react"
import './App.css'
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"
import {ethers} from 'ethers'

class App extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
        ethereum: null,
        accounts: null,
        chainid: null,
        currentAccount: null,
        contract: null,
        allWaves: [],
    }
    this.connectWallet = this.connectWallet.bind(this)
}

    componentDidMount = async () => {

      await this.checkIfWalletIsConnected()

      const chainid = parseInt(this.state.ethereum.chainId)

      this.setState({
        chainid: chainid
      }, await this.loadContract(chainid, "WavePortal"))
      
      this.getAllWaves()

      this.listenForWaves()

    }
    
    checkIfWalletIsConnected = async () => {
        // Try and enable accounts (connect metamask)
        try {
            const ethereum = await getEthereum()
            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
              } else {
                console.log("We have the ethereum object", ethereum);
                this.setState({ethereum: ethereum})
            }
        
              const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        
              if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                this.setState({currentAccount: account});
              } else {
                console.log("No authorized account found")
              }
        } catch (e) {
            console.log(`Could not enable accounts. Interaction with contracts not available.
            Use a modern browser with a Web3 plugin to fix this issue.`)
            console.log(e)
        }
    }
      
    connectWallet = async () => {

        const accounts = await this.state.ethereum.request({ method: "eth_accounts" });
        console.log("Connected", accounts[0]);
        this.setState({currentAccount: accounts[0]});
        
    }
      
    loadContract = async (chain, contractName) => {
        // Load a deployed contract instance into a web3 contract object
        const {ethereum} = this.state
        // Get the address of the most recent deployment from the deployment map
        let address
        try {
            address = map[chain][contractName][0]
        } catch (e) {
            console.log(`Couldn't find any deployed contract "${contractName}" on the chain "${chain}".`)
            return undefined
        }

        // Load the artifact with the specified address
        let contractArtifact
        try {
            contractArtifact = await import(`./artifacts/deployments/${chain}/${address}.json`)
        } catch (e) {
            console.log(`Failed to load contract artifact "./artifacts/deployments/${chain}/${address}.json"`)
            return undefined
        }

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(address, contractArtifact.abi, signer)
        this.setState({contract: wavePortalContract})
    }

    wave = async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const wavePortalContract = this.state.contract
  
          let count = await wavePortalContract.getTotalWaves();
          console.log("Retrieved total wave count...", count.toNumber());
  
          /*
          * Execute the actual wave from your smart contract
          */
          //const waveTxn = await wavePortalContract.wave();
          const waveTxn = await wavePortalContract.wave("this is a message")

          console.log("Mining...", waveTxn.hash);
  
          await waveTxn.wait();
          console.log("Mined -- ", waveTxn.hash);
  
          count = await wavePortalContract.getTotalWaves();
          console.log("Retrieved total wave count...", count.toNumber());
        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error);
      }
    }

    getAllWaves = async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const wavePortalContract = this.state.contract
  
          /*
           * Call the getAllWaves method from your Smart Contract
           */
          const waves = await wavePortalContract.getAllWaves();
  
          /*
           * We only need address, timestamp, and message in our UI so let's
           * pick those out
           */
          let wavesCleaned = [];
          waves.forEach(wave => {
            wavesCleaned.push({
              address: wave.waver,
              timestamp: new Date(wave.timestamp * 1000),
              message: wave.message
            });
          });
  
          /*
           * Store our data in React State
           */
          this.setState({allWaves: wavesCleaned});
        } else {
          console.log("Ethereum object doesn't exist!")
        }
      } catch (error) {
        console.log(error);
      }
    }

    listenForWaves = async () => {
      let wavePortalContract;

      const onNewWave = (from, timestamp, message) => {
        console.log("NewWave", from, timestamp, message);
        this.setState(allWaves => [
          ...allWaves,
          {
            address: from,
            timestamp: new Date(timestamp * 1000),
            message: message,
          },
        ]);
      };
    
      if (window.ethereum) {
        wavePortalContract = this.state.contract
        wavePortalContract.on("NewWave", onNewWave);
      }
    
      return () => {
        if (wavePortalContract) {
          wavePortalContract.off("NewWave", onNewWave);
        }
      };
    }

    render() {
        return (
            <div className="mainContainer">
              <div className="dataContainer">
                <div className="header">
                👋 Hey there!
                </div>
        
                <div className="bio">
                  I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
                </div>
        
                <button className="waveButton" onClick={this.wave}>
                      Wave at Me
                  </button>
        
                {/*
                * If there is no currentAccount render this button
                */}
                {!this.state.currentAccount && (
                  <button className="waveButton" onClick={this.connectWallet}>
                    Connect Wallet
                  </button>
                )}
                {this.state.allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}
              </div>
            </div>
          );
    }
  }

  export default App