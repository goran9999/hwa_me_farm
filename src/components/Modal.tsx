import React, { FC, useEffect, useRef } from "react";

const Modal: FC<{
  children: React.ReactNode;
  close: () => void;
  className?: string;
  wrapperClass?: string;
}> = ({ children, wrapperClass, close, className }) => {
  //   const { ref } = onClickOutside({ close: close });
  return (
    <div
      className={`fixed  inset-0 z-10 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none backdrop-filter backdrop-blur-sm backdrop-visible `}
    >
      <div
        // ref={ref}
        className={
          "relative p-3 my-4  bg-gray-900 bg-secondary w-[40%] z-50 rounded-md shadow-lg " +
          wrapperClass
        }
      >
        <div className="flex items-start z-50  justify-between">
          <button
            onClick={close}
            className="p-1 ml-auto bg-transparent z-50   border-0 text-black opacity-50 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
          >
            <span className="text-black">×</span>
          </button>
        </div>
        <div
          className={`relative mt-4 mb-6  px-6 rounded-md ` + `${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
