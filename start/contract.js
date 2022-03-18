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

const forwarderOrigin = 'http://localhost:9010'

const initialize = () => {
  //basic actions section
  const onboardButton = document.getElementById('connectButton')
  //create a fucntion to check if metamask extension installed
  const isMetaMaskInstalled = () => {
    //need to check ethereum binding on the window object to see if its installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  }

  const MetaMaskClientCheck = () => {
    //now check if metamask is installed
    if (!isMetaMaskInstalled()) {
      //if it isnt installed then ask user to click and install it
      onboardButton.innerText = 'Click here to install MetaMask!';
    } else {
      //if it is already installed button text changes
      onboardButton.innerText = 'Connect!'
    }
  };
  MetaMaskClientCheck();
}

window.addEventListener('DOMContentLoaded', initialize)
