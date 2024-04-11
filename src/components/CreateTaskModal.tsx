import React, { FC, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { ITaskDto, IWallet } from "../interface/wallet.interface";
import Modal from "./Modal";
import Select from "react-select";
import { createTask, getWallets } from "../api";
import { selectStyles } from "../utis";
import toast from "react-hot-toast";

const CreateTaskModal: FC<{
  close: () => void;
  accounts: IWallet[];
  afterTaskCreated: () => void;
}> = ({ close, accounts, afterTaskCreated }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm<ITaskDto>();

  const getOptions = useMemo(() => {
    return accounts.map((acc) => ({
      label: acc.pubkey.slice(0, 4) + "..." + acc.pubkey.slice(-4),
      value: acc.id,
    }));
  }, [accounts]);

  const bidModeOptions = [
    { label: "Aggressive", value: 0 },
    { label: "Passive", value: 1 },
    { label: "Aggressive Match", value: 2 },
    { label: "Passive Match", value: 3 },
  ];

  const validateMeUrl = (value: string) =>
    value.startsWith("https://magiceden.io/marketplace/") ||
    "Invalid Magic Eden collection url!";

  const validateRpcNode = (value: string) =>
    value.startsWith("https://") || "Rpc node must start with https://";

  const handleCreateTask = async (task: ITaskDto) => {
    const { bidMode, account } = task;

    if (!account) {
      toast.error("Please select account!");
      return;
    }
    const id = toast.loading("Creating task...");

    try {
      const data = await createTask(task);
      toast.success(data.message, { id });
      afterTaskCreated();
    } catch (error: any) {
      toast.error(
        "Failed to create Task: " +
          (error?.response?.data.message ?? error?.message),
        { id }
      );
    }
  };

  return (
    <Modal close={close}>
      <div className="flex flex-col gap-5">
        <p className="text-2xl text-tw-green">Create New Task</p>
      </div>

      <form
        onSubmit={handleSubmit(handleCreateTask)}
        className="w-full flex flex-col gap-3"
      >
        <div className="flex flex-col items-start gap-2">
          <p>Collection ME Url</p>
          <input
            placeholder="Magic Eden collection url"
            className="w-full"
            {...register("collectionUrl", {
              required: {
                value: true,
                message: "Collection url is required!",
              },
              validate: validateMeUrl,
            })}
          />
          <p className="text-red-500 text-xs">
            {errors.collectionUrl?.message}
          </p>
        </div>
        <div className="w-full flex gap-3">
          <div className="flex w-[50%] flex-col items-start gap-2">
            <p>Max Bid</p>
            <input
              min={0}
              step={".001"}
              type={"number"}
              {...register("maxSolBid", {
                valueAsNumber: true,
                required: {
                  value: true,
                  message: "Max Bid is required field!",
                },
              })}
            />
            <p className="text-red-500 text-xs">{errors.maxSolBid?.message}</p>
          </div>
          <div className="flex w-[50%] flex-col items-start gap-2">
            <p>Min Ask</p>
            <input
              min={0}
              step={".001"}
              type={"number"}
              {...register("minSolAsk", {
                valueAsNumber: true,
                required: {
                  value: true,
                  message: "Min Ask is required field!",
                },
              })}
            />
            <p className="text-red-500 text-xs">{errors.minSolAsk?.message}</p>
          </div>
        </div>
        <div className="w-full flex gap-3">
          <div className="flex w-[50%] flex-col items-start gap-2">
            <p>Bid Qty</p>
            <input
              {...register("bidQty", {
                valueAsNumber: true,
                required: {
                  value: true,
                  message: "Bid Qty is required",
                },
              })}
            />
            <p className="text-red-500 text-xs">{errors.bidQty?.message}</p>
          </div>
          <div className="flex w-[50%] flex-col items-start gap-2">
            <p>Ask Qty</p>
            <input
              {...register("askQty", {
                valueAsNumber: true,
                required: {
                  value: true,
                  message: "Ask Qty is required",
                },
              })}
            />
            <p className="text-red-500 text-xs">{errors.askQty?.message}</p>
          </div>
        </div>
        <div className="w-full gap-3 flex items-start">
          <div className="w-[33%] flex items-start  flex-col gap-2">
            <p>Account</p>
            <Select
              {...register("account", {
                required: {
                  value: true,
                  message: "Account is required",
                },
              })}
              styles={selectStyles}
              onChange={(e) => setValue("account", e?.value ?? 0)}
              options={getOptions}
            />
            <p className="text-red-500 text-xs">{errors.account?.message}</p>
          </div>
          <div className="flex items-start flex-col w-[33%] gap-2">
            <p>Monitor delay (ms)</p>
            <input
              {...register("monitorDelay", {
                valueAsNumber: true,
                required: {
                  value: true,
                  message: "Monitor delay is required!",
                },
                min: {
                  value: 100,
                  message: "Minimum value is 100 ms",
                },
              })}
              type={"number"}
              min={100}
              step="100"
            />
            <p className="text-red-500 text-xs">
              {errors.monitorDelay?.message}
            </p>
          </div>
          <div className="flex items-start flex-col w-[33%] gap-2">
            <p>Bid Mode</p>
            <Select
              {...register("bidMode", {
                required: {
                  value: true,
                  message: "Bid mode is required",
                },
              })}
              styles={selectStyles}
              options={bidModeOptions}
              onChange={(e) => setValue("bidMode", e?.value ?? 0)}
            />
            <p className="text-red-500 text-xs">{errors.bidMode?.message}</p>
          </div>
        </div>
        <div className="w-full items-start flex flex-col gap-2">
          <p>Rpc Url</p>
          <input
            type={"text"}
            {...register("rpcNode", {
              required: {
                value: true,
                message: "Rpc node is required",
              },
              validate: validateRpcNode,
            })}
          />
          <p className="text-red-500  text-xs">{errors.rpcNode?.message}</p>
        </div>
        <div className="mt-2 flex w-full justify-between">
          <button
            onClick={close}
            className="border-[1px] px-4 py-2 border-tw-gray rounded-md"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="border-[1px] hover:bg-tw-green hover:text-white px-4 py-2 rounded-md border-tw-green text-tw-green"
          >
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTaskModal;
