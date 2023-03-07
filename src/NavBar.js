import { Button, Flex, Image, Link, Spacer } from "@chakra-ui/react";
import Degenhouse from "./assets/social-media-icons/degehouseLogopurplecropped_56x70.png";
import Avax from "./assets/social-media-icons/avax_64x64.png";

const NETWORK_NAME = "Avalanche Fuji Testnet"; // Specify the network name here

const NavBar = ({ accounts, setAccounts }) => {
  const isConnected = Boolean(accounts[0]);

  async function connectAccount() {
    if (window.ethereum) {
      const provider = window.ethereum;

      // Request access to the user's accounts and network
      try {
        await provider.request({ method: "eth_requestAccounts" });
        const chainId = await provider.request({ method: "eth_chainId" });

        // Check if the user is connected to the correct network
        if (chainId !== "0xa869") {
          // Show an alert asking the user to switch to the correct network
          if (window.confirm(`Please switch to ${NETWORK_NAME}`)) {
            try {
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xa869" }],
              });
            } catch (error) {
              console.error(error);
            }
          }
        }

        // Update the accounts state with the connected accounts
        setAccounts(await provider.request({ method: "eth_accounts" }));
      } catch (error) {
        console.error(error);
      }
    }
  }
  function disconnectAccount() {
    setAccounts([]);
  }

  return (
    <Flex
      justify="space-between"
      align="center"
      padding="15px"
      flexWrap={{ base: "wrap", md: "nowrap" }}
    >
      <Flex
        justify="start"
        width={{ base: "50%", md: "40%" }}
        padding="0 25px 0 25px"
      >
        <Link href="https://www.degen-house.com">
          <Image src={Degenhouse} boxsize="15px" margin="0 10px" />
        </Link>
        <Link href="https://testnet.snowtrace.io">
          <Image src={Avax} boxsize="15px" margin="0 5px" />
        </Link>
      </Flex>

      <Spacer />

      <Flex
        justify="flex-end"
        align="center"
        width={{ base: "100%", md: "40%" }}
        padding={{ base: "15px 30px", md: "30px 30px 30px 30px" }}
        flexWrap={{ base: "wrap", md: "nowrap" }}
      >
        {isConnected ? (
          <Button
            backgroundColor="#6A5ACD"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin={{ base: "5px 0", md: "0 15px" }}
            onClick={disconnectAccount}
          >
            Disconnect
          </Button>
        ) : (
          <Button
            backgroundColor="#6A5ACD"
            borderRadius="5px"
            boxShadow="0px 2px 2px 1px #0F0F0F"
            color="white"
            cursor="pointer"
            fontFamily="inherit"
            padding="15px"
            margin={{ base: "5px 0", md: "0 15px" }}
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
