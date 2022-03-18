/*global ethereum, MetamaskOnboarding */

/*
The `piggybankContract` is compiled from:

  pragma solidity ^0.4.0;
  contract PiggyBank {

      uint private balance;
      address public owner;

      function PiggyBank() public {
          owner = msg.sender;
          balance = 0;
      }

      function deposit() public payable returns (uint) {
          balance += msg.value;
          return balance;
      }

      function withdraw(uint withdrawAmount) public returns (uint remainingBal) {
          require(msg.sender == owner);
          balance -= withdrawAmount;

          msg.sender.transfer(withdrawAmount);

          return balance;
      }
  }
*/

// import detectEthereumProvider from '@metamask/detect-provider';

//this returns the provider or null if not detected
// const provider = await detectEthereumProvider();

// if (provider) {
//   // handle provider
// } else {
//   // handle no provider
// }

const forwarderOrigin = "http://localhost:9010";

const initialize = () => {
  //basic actions section
  const onboardButton = document.getElementById("connectButton");
  const getAccountsButton = document.getElementById("getAccounts");
  const getAccountsResult = document.getElementById("getAccountsResult");
  //create a fucntion to check if metamask extension installed
  const isMetaMaskInstalled = () => {
    //need to check ethereum binding on the window object to see if its installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //create a new metamask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding process
  const onClickInstall = () => {
    onboardButton.innerText = "Onboarding in progress";
    onboardButton.disabled = true;
    //on this object we have startOnboarding which will start the onboarding process for the end user
    onboarding.startOnboarding();
  };
  //now if the end user doesnt have the metamask extension they can install it. When they refresh the page the ethereum window object will be there and we can connect their metamask wallet to the dapp

  const onClickConnect = async () => {
    try {
      //will open the metamask UI
      //should disable the button while request is pending!
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
  };

  //this function will be called when we click a button and disable it
  const MetaMaskClientCheck = () => {
    //now check if metamask is installed
    if (!isMetaMaskInstalled()) {
      //if it isnt installed then ask user to click and install it
      onboardButton.innerText = "Click here to install MetaMask!";
      //when button is clicked we call this function
      onboardButton.onclick = onClickInstall;
      //the button is now disabled
      onboardButton.disabled = false;
    } else {
      //if it is already installed button text changes and ask user to connect to their wallet
      onboardButton.innerText = "Connect!";
      //when the button is clicked, we call this function to connect to the users metamask wallet
      onboardButton.onclick = onClickConnect;
      //the button is now disabled
      onboardButton.disabled = false;
      //now have created a function that will be called whenever we click the button to trigger a connection to our wallet, disabling the button.
    }
  };
  MetaMaskClientCheck();

  //Eth_Accounts-getAccountsButton
  getAccountsButton.addEventListener("click", async () => {
    //use eth_accounts because it returns a list of addresses owned by us.
    const accounts = await ethereum.request({ method: "eth_accounts" });
    //take the first address in the array of addresses and display it
    getAccountsResult.innerHTML = accounts[0] || "Not able to get accounts";
  });
};

window.addEventListener("DOMContentLoaded", initialize);
