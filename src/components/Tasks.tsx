import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { FaStop } from "react-icons/fa";
import {
  BidMode,
  ITask,
  IWallet,
  TasksStatus,
} from "../interface/wallet.interface";
import toast from "react-hot-toast";
import {
  deleteTask,
  getAllTasks,
  getWallets,
  startTask,
  stopTask,
} from "../api";
import CreateTaskModal from "./CreateTaskModal";
import PromptModal from "./PromptModal";
import { BsPlayFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const Tasks = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  const [accounts, setAccounts] = useState<IWallet[]>([]);
  const [isCreatingTask, toggleIsCreatingTask] = useState(false);
  const [stoppingTask, setStoppingTask] = useState<number>();
  const [startingTask, setStartingTask] = useState<string>();
  const [deletingTask, setDeletingTask] = useState<number>();
  const [editingTask, setEditingTask] = useState<ITask>();

  useEffect(() => {
    void getAllWallets();
    void getTasks();
  }, []);

  const getAllWallets = async () => {
    try {
      setAccounts(await getWallets());
    } catch (error) {}
  };

  const getTasks = async () => {
    try {
      const data = await getAllTasks();
      setTasks(data);
    } catch (error: any) {
      toast.error(error?.response?.data.message ?? error.message);
    }
  };

  const getStatusText = (status: TasksStatus) => {
    switch (status) {
      case TasksStatus.Canceled: {
        return <p className="text-red-500">Cancelled</p>;
      }
      case TasksStatus.MonitoringBids: {
        return <p className="text-yellow-500">Monitoring bids...</p>;
      }
      case TasksStatus.Executed: {
        return <p className="text-tw-dark-green">Listed NFT</p>;
      }
    }
  };

  const getModeText = (mode: BidMode) => {
    switch (mode) {
      case BidMode.Aggressive: {
        return <p className="text-yellow-500">Aggressive</p>;
      }
      case BidMode.AggressiveMatch: {
        return <p className="text-blue-500">Aggressive Match</p>;
      }
      case BidMode.PassiveMatch: {
        return <p className="text-blue-500">Passive Match</p>;
      }
      default: {
        return <p className="text-tw-dark-green">Passive</p>;
      }
    }
  };

  const handleStartTask = async () => {
    if (!startingTask) {
      toast.error("Please select task to be started!");
      return;
    }
    const id = toast.loading("Starting task...");
    try {
      const data = await startTask(startingTask);
      toast.success(data.message, { id });
      setStartingTask(undefined);
      await getTasks();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error.message, { id });
    }
  };

  const handleDeleteTask = async () => {
    if (!deletingTask) {
      toast.error("Please select task to be deleted!");
      return;
    }

    const id = toast.loading("Starting task...");
    try {
      const data = await deleteTask(deletingTask);
      toast.success(data.message, { id });
      setDeletingTask(undefined);
      await getTasks();
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? error.message, { id });
    }
  };

  const renderTasks = useMemo(() => {
    return tasks.map((t) => {
      return (
        <TableRow>
          <TableCell className="text-start">
            <a
              className="text-blue-400 underline "
              href={t.collectionUrl}
              target={"_blank"}
            >
              {t.collectionUrl}
            </a>
          </TableCell>
          <TableCell className="text-start">{t.accountId}</TableCell>
          <TableCell className="text-start">{t.maxSolBid.toFixed(2)}</TableCell>
          <TableCell className="text-start">{t.minSolAsk.toFixed(2)}</TableCell>
          <TableCell className="text-start">{t.bidQty}</TableCell>
          <TableCell className="text-start">{t.askQty}</TableCell>
          <TableCell className="text-start">
            {getStatusText(t.status)}
          </TableCell>
          <TableCell className="text-start">{getModeText(t.bidMode)}</TableCell>
          {t.status !== TasksStatus.Executed && (
            <TableCell className="flex items-center gap-2">
              {t.status !== TasksStatus.Canceled ? (
                <>
                  <FaStop
                    onClick={() => setStoppingTask(t.id)}
                    className="text-red-500 cursor-pointer"
                  />
                  <MdEdit
                    onClick={() => setEditingTask(t)}
                    className="text-blue-500"
                  />
                </>
              ) : (
                <>
                  <BsPlayFill
                    onClick={() => setStartingTask(t.collectionSlug)}
                    className="text-green-500 text-2xl cursor-pointer"
                  />
                  <MdEdit
                    onClick={() => setEditingTask(t)}
                    className="text-blue-500"
                  />
                </>
              )}
            </TableCell>
          )}
          <TableCell>
            {" "}
            <FaTrash
              onClick={() => setDeletingTask(t.id)}
              className="text-red-500 cursor-pointer"
            />
          </TableCell>
        </TableRow>
      );
    });
  }, [tasks, stoppingTask]);

  const handleStopTask = useCallback(
    async (id: number) => {
      const toastId = toast.loading("Stopping task...");
      try {
        const data = await stopTask(id);
        toast.success(data.message, { id: toastId });
        setStoppingTask(undefined);
        await getTasks();
      } catch (error: any) {
        toast.error(error?.response?.data.message ?? error?.message, {
          id: toastId,
        });
      }
    },
    [tasks]
  );

  return (
    <div className="flex flex-col gap-4 mt-[5%] px-6 items-start w-full">
      {isCreatingTask && (
        <CreateTaskModal
          afterTaskCreated={() => {
            toggleIsCreatingTask(false);
            getTasks();
          }}
          accounts={accounts}
          close={() => toggleIsCreatingTask(false)}
        />
      )}

      {stoppingTask && (
        <PromptModal
          close={() => setStoppingTask(undefined)}
          onConfirm={() => handleStopTask(stoppingTask)}
          text={`Are you sure you want to stop task: ${stoppingTask}`}
        />
      )}
      {startingTask && (
        <PromptModal
          close={() => setStartingTask(undefined)}
          onConfirm={handleStartTask}
          text={`Are you sure you want to start again task for: ${startingTask}`}
        />
      )}
      {editingTask && (
        <CreateTaskModal
          task={editingTask}
          accounts={accounts}
          afterTaskCreated={() => {
            setEditingTask(undefined);
            getTasks();
          }}
          close={() => setEditingTask(undefined)}
        />
      )}
      {deletingTask && (
        <PromptModal
          close={() => setDeletingTask(undefined)}
          onConfirm={handleDeleteTask}
          text={`Are you sure you want to delete task ${deletingTask}`}
        />
      )}
      <div className="flex w-full justify-between">
        <p className="text-tw-green font-600 text-2xl">
          Tasks ({tasks.length})
        </p>

        <div className="flex gap-2 items-center px-4 py-2 border-[1px] border-tw-gray rounded-md">
          <button
            onClick={() => toggleIsCreatingTask(true)}
            className="flex items-center gap-2 border-transparent hover:border-b-tw-green border-[2px]"
          >
            <span className="uppercase font-bold text-tw-green">+</span> Create
            task
          </button>
          {/* <button className="flex items-center gap-2 border-transparent hover:border-b-red-500 border-[2px]">
            <FaStop className="text-red-500" />
            Stop All Tasks
          </button> */}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collection</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Max Bid Price</TableHead>
            <TableHead>Min Ask Price</TableHead>
            <TableHead>Bid Qty</TableHead>
            <TableHead>Ask Qty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Mode</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{renderTasks}</TableBody>
      </Table>
    </div>
  );
};

export default Tasks;
