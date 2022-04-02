import React, {Component} from "react"
import './App.css'
import {getWeb3} from "./getWeb3"
import map from "./artifacts/deployments/map.json"
import {getEthereum} from "./getEthereum"

export default function App() {

    const wave = () => {
      
    }
    
    return (
      <div className="mainContainer">
  
        <div className="dataContainer">
          <div className="header">
          👋 Hey there!
          </div>
  
          <div className="bio">
          I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
          </div>
  
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        </div>
      </div>
    );
  }
  