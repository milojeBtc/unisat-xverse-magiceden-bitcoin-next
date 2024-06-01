"use client";
import React, {useContext, useEffect} from "react";
import { useRouter } from "next/navigation";
import { Navbar, NavbarContent, NavbarItem, Button, Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";
import {
  AddressPurpose,
  BitcoinNetworkType,
  getAddress,
} from "sats-connect";
import { type BtcAddress } from "@btckit/types";
import Notiflix from "notiflix";
import WalletConnectIcon from "./Icon/WalletConnectIcon";
import WalletContext from "../contexts/WalletContext";
import { WalletTypes } from "../utils/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [pageIndex, setPageIndex] = React.useState(-1);
  const router = useRouter();
  const gotoPage = (route: string, index: number) => {
    console.log('pageIndex ==> ', index);
    setPageIndex(index);
    router.push(route);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    walletType,
    ordinalAddress,
    paymentAddress,
    ordinalPublicKey,
    setWalletType,
    setOrdinalAddress,
    setPaymentAddress,
    setPaymentPublicKey,
    setOrdinalPublicKey,
  } = useContext(WalletContext);

  const isConnected = Boolean(ordinalAddress);

  const handleConnectWallet = async () => {
    const currentWindow: any = window;
    if (typeof currentWindow?.unisat !== "undefined") {
      const unisat: any = currentWindow?.unisat;
      try {
        let accounts: string[] = await unisat.requestAccounts();
        let pubkey = await unisat.getPublicKey();
        Notiflix.Notify.success("Connect succes!");
        setWalletType(WalletTypes.UNISAT);
        setOrdinalAddress(accounts[0] || "");
        setPaymentAddress(accounts[0] || "");
        setOrdinalPublicKey(pubkey);
        setPaymentPublicKey(pubkey);

        onClose();
      } catch (e) {
        Notiflix.Notify.failure("Connect failed!");
      }
    }
  };

  const xverseConnectWallet = async () => {
    await getAddress({
      payload: {
        purposes: [
          AddressPurpose.Ordinals,
          AddressPurpose.Payment,
          AddressPurpose.Stacks,
        ],
        message: "Ordinal Raffle Site",
        network: {
          type: BitcoinNetworkType.Testnet,
        },
      },
      onFinish: (response) => {
        setWalletType(WalletTypes.XVERSE);
        const paymentAddressItem = response.addresses.find(
          (address) => address.purpose === AddressPurpose.Payment
        );
        setPaymentAddress(paymentAddressItem?.address as string);
        setPaymentPublicKey(paymentAddressItem?.publicKey as string);

        const ordinalsAddressItem = response.addresses.find(
          (address) => address.purpose === AddressPurpose.Ordinals
        );
        setOrdinalAddress(ordinalsAddressItem?.address as string);
        setOrdinalPublicKey(ordinalsAddressItem?.publicKey as string);

        onClose();
      },
      onCancel: () => alert("Request canceled"),
    });
  };

  const MagicEdenConnectWallet = async () => {
    try {
      const currentWindow: any = window;
      const addressesRes = await currentWindow.btc?.request("getAddresses", {});
      const { address, publicKey } = (
        addressesRes as any
      ).result.addresses.find((address: BtcAddress) => address.type === "p2tr");

      const { address: paymentAddress, publicKey: paymentPublickey } = (
        addressesRes as any
      ).result.addresses.find(
        (address: BtcAddress) => address.type === "p2wpkh"
      );

      setWalletType(WalletTypes.HIRO);
      console.log(paymentAddress, paymentPublickey, address, publicKey);
      setPaymentAddress(paymentAddress);
      setPaymentPublicKey(paymentPublickey);
      setOrdinalAddress(address);
      setOrdinalPublicKey(publicKey);
      alert("connected");
    } catch (err) {
      alert("cancelled");
    }
  };

  useEffect(() => {
    if (ordinalAddress) {
      onClose();
    }
  }, [ordinalAddress])

  return (
    <div className="p-3 flex gap-3">
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full"
      >
        <NavbarContent justify="end" className="gap-10">
          <NavbarItem>
            <Button
              color="warning"
              variant="flat"
              onPress={() => onOpen()}
              className="capitalize"
            >
              <WalletConnectIcon />
              {ordinalAddress ? <p className="truncate w-28">{ordinalAddress}</p> : 'Connect Wallet'}
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <Modal
        backdrop='blur'
        isOpen={isOpen}
        onClose={onClose}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            }
          }
        }}
        classNames={{
          body: "py-6",
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
          header: "border-b-[1px] border-[#292f46]",
          footer: "border-t-[1px] border-[#292f46]",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">Connect Wallet</ModalHeader>
              <ModalBody>
                <div className="p-2 pb-10">
                  <div className="flex flex-col gap-5 justify-center items-center">
                    <Button onClick={() => handleConnectWallet()} color="primary" variant="bordered" className="w-[200px]">
                      Unisat Wallet Connect
                    </Button>
                    <Button onClick={() => xverseConnectWallet()} color="secondary" variant="bordered" className="w-[200px]">
                      XVerse Wallet Connect
                    </Button>
                    <Button onClick={() => MagicEdenConnectWallet()} color="danger" variant="bordered" className="w-[200px]">
                      ME Wallet Connect
                    </Button>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div >
  );
};

export default Header;
