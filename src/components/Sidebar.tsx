import React, { useMemo, useState } from "react";
import { IconType } from "react-icons";
import { BsWalletFill } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";
import { useNavigate } from "react-router";

interface ISidebarItem {
  title: string;
  href: string;
  icon: IconType;
}

const sidebarItems: ISidebarItem[] = [
  {
    href: "wallets",
    title: "Wallets",
    icon: BsWalletFill,
  },
  {
    href: "tasks",
    title: "Tasks",
    icon: FaTasks,
  },
];

const Sidebar = () => {
  const [activeRoute, setActiveRoute] = useState("wallets");

  const navigate = useNavigate();

  const renderTabs = useMemo(() => {
    return sidebarItems.map((s) => {
      return (
        <div
          onClick={() => {
            setActiveRoute(s.href);
            navigate(s.href);
          }}
          className={
            "w-full flex items-center cursor-pointer ml-[30%] gap-2 " +
            `${activeRoute === s.href ? "" : "opacity-60"}`
          }
        >
          <s.icon className="text-white" />
          <p>{s.title}</p>
        </div>
      );
    });
  }, [sidebarItems, activeRoute]);

  return (
    <div className="w-[15%] px-2 py-4  border-r-[1px] border-gray-800 h-[100vh]">
      <div className="flex flex-col gap-2 justify-center items-center">
        {/* <img src="logo.png" className="w-[5em]" /> */}
        <p className="text-3xl font-400">
          HWA <span className="opacity-60 text-xs">v1.0.0</span>
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-8">{renderTabs}</div>
    </div>
  );
};

export default Sidebar;
