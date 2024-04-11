import React, { FC } from "react";
import Modal from "./Modal";

const PromptModal: FC<{
  close: () => void;
  text: string;
  onConfirm: () => void;
}> = ({ close, text, onConfirm }) => {
  return (
    <Modal close={close}>
      <div className="w-full">
        <p className="font-500 text-md w-full">{text}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={close}
            className="bg-transparent px-4 py-2 rounded-md border-[1px] border-tw-gray"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-black border-[1px] border-tw-gray rounded-md px-4 py-2"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PromptModal;
