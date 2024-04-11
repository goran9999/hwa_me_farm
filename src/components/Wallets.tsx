import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { deleteWallet, getWallets } from "../api";
import { IWallet } from "../interface/wallet.interface";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Modal from "./Modal";
import AddWalletModal from "./AddWalletModal";
import PromptModal from "./PromptModal";
const Wallets = () => {
  const headers: string[] = ["Wallet", "Public key", "Secret key"];

  const [wallets, setWallets] = useState<IWallet[]>([]);

  const [deleteAccount, setDeleteAccount] = useState<IWallet>();

  const [addModalVisible, toggleAddModalVisible] = useState(false);

  useEffect(() => {
    void getAllWallets();
  }, []);

  const getAllWallets = async () => {
    try {
      const wallets = await getWallets();

      setWallets(wallets);
    } catch (error) {}
  };

  const renderWallets = useMemo(() => {
    return wallets.map((w) => {
      return (
        <TableRow>
          <TableCell className="text-lg text-center p-0">{w.id}</TableCell>
          <TableCell className="text-lg text-start">{w.pubkey}</TableCell>
          <TableCell className="text-lg text-start">{w.secretKey}</TableCell>
          <TableCell className="flex gap-2">
            <MdDelete
              onClick={() => setDeleteAccount(w)}
              style={{ fontSize: "20px" }}
              className="text-red-500 cursor-pointer"
            />
          </TableCell>
        </TableRow>
      );
    });
  }, [wallets, setDeleteAccount]);

  const handleDeleteAccount = async () => {
    if (!deleteAccount) {
      toast.error("Please pick account to be deleted!");
      return;
    }

    const id = toast.loading("Deleting account...");
    try {
      const data = await deleteWallet(deleteAccount.id);
      toast.success(data.message, { id });
      await getAllWallets();
      setDeleteAccount(undefined);
    } catch (error: any) {
      toast.error(error?.resonse?.data.message ?? error.message, { id });
    }
  };

  return (
    <div className="w-full mt-[5%] flex flex-col items-start gap-8 px-6">
      {addModalVisible && (
        <AddWalletModal
          afterWalletCreated={() => {
            toggleAddModalVisible(false);
            getAllWallets();
          }}
          close={() => toggleAddModalVisible(false)}
        />
      )}
      {deleteAccount && (
        <PromptModal
          close={() => setDeleteAccount(undefined)}
          onConfirm={handleDeleteAccount}
          text={`Are you sure you want to delete ${deleteAccount.pubkey} account?`}
        />
      )}
      <div className="w-full flex items-center justify-between">
        <p className="text-4xl text-tw-green">Wallets</p>
        <button
          onClick={() => toggleAddModalVisible(true)}
          className="border-[1px] rounded-md px-4 py-2  opacity-80 border-tw-gray"
        >
          <span className="text-xl text-yellow-400 font-600">+</span> Add new
          wallet
        </button>
      </div>
      <Table className="border-b-[1px">
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg text-center opacity-60 font-normal">
              Wallet
            </TableHead>
            <TableHead className="text-lg  opacity-60 font-normal">
              Public Key
            </TableHead>
            <TableHead className="text-lg opacity-60 font-normal">
              Secret Key
            </TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>{renderWallets}</TableBody>
      </Table>
    </div>
  );
};

export default Wallets;
