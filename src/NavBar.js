import React from "react";
import { Box, Button, Flex, Image, Link, Spacer } from "@chakra-ui/react";
import Twitter from "./assets/social-media-icons/twitter_32x32.png";
import Discord from "./assets/social-media-icons/discord_88x88.png";

const NavBar = ({ accounts, setAccounts }) => {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
    }
  }

  return (
    <Flex justify="space-between" align="center" padding="30px">
      <Flex justify="start" width="40%" padding="0 25px">
        <Link href="https://www.twitter.com">
          <Image src={Twitter} boxsize="42px" margin="0 15px" />
        </Link>
        <Link href="https://www.discord.com">
          <Image src={Discord} boxsize="42px" margin="0 15px" />
        </Link>
      </Flex>

      <Flex
        justify="space-around"
        align="center"
        width="40%"
        padding="30px 30px 30px 30px"
      >
        {/*<Box margin="0 5px">About</Box>
        <Spacer /> */}

        {isConnected ? (
          <Box margin="0 5px">Connected</Box>
        ) : (
          <Button
            backgroundColor="#D6517D"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin="0 15px"
            onClick={connectAccount}
          >
            Connect
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default NavBar;
