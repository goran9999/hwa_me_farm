import React, { FC, useEffect } from "react";
import Modal from "./Modal";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { decode, encode } from "bs58";
import { createNewWallet } from "../api";
type Form = {
  accountName: string;
  wallet: string;
  secretKey: string;
};

const AddWalletModal: FC<{
  close: () => void;
  afterWalletCreated: () => void;
}> = ({ close, afterWalletCreated }) => {
  const {
    register,
    getValues,
    setValue,
    setError,
    handleSubmit,
    watch,

    formState: { errors },
  } = useForm<Form>();

  const kp = watch("secretKey");

  useEffect(() => {
    try {
      // const decoded = Keypair.fromSecretKey(decode(kp));
      // setValue("wallet", decoded.publicKey.toString());
      // setError("wallet", {
      //   message: undefined,
      // });
    } catch (error) {}
  }, [kp]);

  const handleCreateWallet = async (data: Form) => {
    const id = toast.loading("Creating new wallet..");
    try {
      const { secretKey } = data;

      const walletCreatedResponse = await createNewWallet(secretKey);
      toast.success(walletCreatedResponse.message, { id });
      afterWalletCreated();
    } catch (error: any) {
      toast.error("Failed to create wallet!" + error?.response?.data.message, {
        id,
      });
    }
  };

  return (
    <Modal close={close}>
      <form
        onSubmit={handleSubmit(handleCreateWallet)}
        className=" flex p-5 rounded-md flex-col gap-5"
      >
        <div className="flex gap-3">
          <div className="w-[40%] items-start flex flex-col gap-2">
            <p>Account name</p>
            <input
              {...register("accountName", {
                required: true,
                minLength: 0,
              })}
              className=" py-3 px-4 focus:outline-none border-[1px] w-full bg-transparent border-tw-gray rounded-md"
              placeholder="Account Name"
            />
            <p className="w-full text-red-300">{errors.accountName?.message}</p>
          </div>
          <div className="w-[60%] flex items-start flex-col gap-2">
            <p>Wallet address</p>
            <input
              {...register("wallet", {
                required: {
                  message: "Wallet address is required!",
                  value: true,
                },
                minLength: {
                  value: 32,
                  message: "Wallet length must be between 32 and 44 characters",
                },
                maxLength: {
                  value: 44,
                  message: "Wallet length must be between 32 and 44 characters",
                },
              })}
              className=" py-3 px-4 border-[1px] w-full bg-transparent border-tw-gray rounded-md"
              placeholder="Wallet Address"
            />
            <p className="w-full text-xs text-start px-2 text-red-300">
              {errors.wallet?.message}
            </p>
          </div>
        </div>
        <div className="w-full items-start flex flex-col gap-2">
          <p>Private key</p>
          <input
            {...register("secretKey", {
              required: {
                value: true,
                message: "Secret key is required",
              },
              minLength: {
                message: "Minimum length is 64 characters",
                value: 64,
              },
            })}
            placeholder="Private key"
            type={"password"}
            className="w-full py-3 bg-transparent border-[1px] px-4 border-tw-gray rounded-md"
          />
          <p className="w-full text-xs text-start px-2 text-red-300">
            {errors.secretKey?.message}
          </p>
        </div>
        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="bg-tw-dark-green px-6 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddWalletModal;
