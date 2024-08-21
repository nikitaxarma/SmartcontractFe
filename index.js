import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [amountInput, setAmountInput] = useState(1);
  const [factorialResult, setFactorialResult] = useState(undefined);
  const [palindromeResult, setPalindromeResult] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);

      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        handleAccount(accounts);
      } catch (error) {
        console.error("User denied account access", error);
      }
    } else {
      console.log("Please install Metamask");
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
      getATMContract();
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    try {
      const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
      handleAccount(accounts);
    } catch (error) {
      console.error("User denied account access", error);
    }
  };

  const getATMContract = () => {
    if (!ethWallet) {
      console.error("Ethereum wallet is not set");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      console.log("Fetching balance...");
      const balance = await atm.getBalance();
      setBalance(balance.toNumber());
      console.log("Balance:", balance.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(amountInput);
      await tx.wait();
      console.log("Deposit transaction:", tx);
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(amountInput);
      await tx.wait();
      console.log("Withdraw transaction:", tx);
      getBalance();
    }
  };

  const calculateFactorial = async () => {
    if (atm) {
      let tx = await atm.calculateFactorial(amountInput);
      await tx.wait();
      console.log("Factorial transaction:", tx);

      atm.on("FactorialCalculated", (number, result) => {
        setFactorialResult(`Factorial of ${number} is: ${result}`);
      });
    }
  };

  const checkPalindrome = async () => {
    if (atm) {
      let tx = await atm.checkPalindrome(amountInput);
      await tx.wait();
      console.log("Palindrome transaction:", tx);

      atm.on("PalindromeChecked", (number, isPalindrome) => {
        setPalindromeResult(`${number} is ${isPalindrome ? "a" : "not a"} palindrome.`);
      });
    }
  };

  const displayMyInfo = () => {
    alert("I AM A METACRAFTER...!!!");
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <div>
          <input
            type="number"
            value={amountInput}
            onChange={(e) => setAmountInput(parseInt(e.target.value))}
          />
          <button onClick={deposit}>Deposit</button>
          <button onClick={withdraw}>Withdraw</button>
        </div>
        <div>
          <button onClick={calculateFactorial}>Calculate Factorial</button>
          {factorialResult && <p>{factorialResult}</p>}
          <button onClick={checkPalindrome}>Check Palindrome</button>
          {palindromeResult && <p>{palindromeResult}</p>}
        </div>
        <button
          style={{
            backgroundColor: "black",
            color: "white",
            fontWeight: "bold",
            border: "2px solid black",
          }}
          onClick={displayMyInfo}
        >
          Nikita Sharma
        </button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Smart Contract Frontend: ATM</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
      `}</style>
    </main>
  );
}
// npm i
// npx hardhat node
// npx hardhat run scripts/deploy.js --network localhost
// npm run dev
