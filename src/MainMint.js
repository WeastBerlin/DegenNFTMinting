import { useState, useEffect } from "react";
import { ethers, BigNumber } from "ethers";
import { Box, Button, Flex, Text, Input } from "@chakra-ui/react";
import CyberDegensNFT from "./CyberDegensNFT.json";
import axios from "axios";

const CyberDegensNFTAddress = "0x9922ae111031791C609dE0D5bFafB99aa6b673dc";
const nftEndpoint = process.env.REACT_APP_NFTAPIADDRESS;

const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isTyping) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 75);

      return () => clearInterval(intervalId);
    }
  }, [isTyping]);

  useEffect(() => {
    if (currentIndex < text.length) {
      setDisplayText(text.slice(0, currentIndex + 1));
    } else {
      setIsTyping(false);
    }
  }, [currentIndex, text]);

  return (
    <Text
      fontSize="20px"
      letterSpacing="-5.5%"
      fontFamily="VT323"
      textShadow="0 2px 2px #000000"
    >
      {displayText}
    </Text>
  );
};

const MainMint = ({ accounts, setAccounts }) => {
  const [mintAmount, setMintAmount] = useState(1);
  const [tokenSupply, setTokenSupply] = useState(0);
  const isConnected = Boolean(accounts[0]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.enable().then((accounts) => {
        setAccounts(accounts);
      });
    }

    axios
      .get(nftEndpoint)
      .then((response) => {
        setTokenSupply(response.data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function handleMint() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        CyberDegensNFTAddress,
        CyberDegensNFT.abi,
        signer
      );
      try {
        const response = await contract.mint(BigNumber.from(mintAmount), {
          value: ethers.utils.parseEther((0.001 * mintAmount).toString()),
          /*gasLimit: 5000000,*/
        });
        console.log("response: ", response);
      } catch (err) {
        console.log("error", err);
      }
    }
  }

  const handleDecrement = () => {
    if (mintAmount <= 1) return;
    setMintAmount(mintAmount - 1);
  };

  const handleIncrement = () => {
    if (mintAmount >= 3) return;
    setMintAmount(mintAmount + 1);
  };

  return (
    <Flex justify="center" align="center" height="100vh" paddingBottom="150px">
      <Box width="520px">
        <div>
          <Text fontSize="32px" textShadow="0 5px #000000">
            Cyber Degens
          </Text>
          <TypewriterText
            text="
            The Cyber Degens were born as a response to the 2008 financial
            crisis. They are the pioneers of the blockchain world, and they have
            always looked out for one another. Cyber Degens are genetically
            superior thanks to their built-in machine learning algorithms,
            making them a unique and innovative collective. The Cyber Degen collection
            is for thos who want to see how things are built behind closed
            doors.
            By owning a Cyber Degen NFT, you will become part of the
            degen-house.com family."
          />
          <div>
            <Text fontSize="12px">Total NFTs minted: {tokenSupply}/100</Text>
          </div>
        </div>
        {isConnected ? (
          <div>
            <Flex align="center" justify="center">
              <Button
                backgroundColor="#6A5ACD"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleDecrement}
              >
                -
              </Button>
              <Input
                readOnly
                fontFamily="inherit"
                color="white"
                backgroundColor="black"
                width="100px"
                height="40px"
                textAlign="center"
                paddingLeft="19px"
                marginTop="10px"
                type="number"
                value={mintAmount}
              />
              <Button
                backgroundColor="#6A5ACD"
                borderRadius="5px"
                boxShadow="0px 2px 2px 1px #0F0F0F"
                color="white"
                cursor="pointer"
                fontFamily="inherit"
                padding="15px"
                marginTop="10px"
                onClick={handleIncrement}
              >
                +
              </Button>
            </Flex>
            <Button
              backgroundColor="#6A5ACD"
              borderRadius="5px"
              boxShadow="0px 2px 2px 1px #0F0F0F"
              color="white"
              cursor="pointer"
              fontFamily="inherit"
              padding="15px"
              marginTop="10px"
              onClick={handleMint}
            >
              Mint Now
            </Button>
          </div>
        ) : (
          <Text
            marginTop="70px"
            fontSize="30px"
            letterSpacing="-5.5%"
            fontFamily="VT323"
            textShadow="0 5px #000000"
            color="white"
          >
            You must be connected to Mint
          </Text>
        )}
      </Box>
    </Flex>
  );
};

export default MainMint;
