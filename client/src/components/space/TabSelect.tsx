import clsx from "clsx";
import React from "react";

type Tab = "sources" | "chat" | "tools";

type Props = {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
};

const TabSelect = ({ activeTab, onTabChange }: Props) => {
  return (
    <div className="box-border w-full lg:hidden flex relative border-b border-neutral-200 dark:border-neutral-800">
      <div
        onClick={() => onTabChange("sources")}
        className={clsx(
          "flex-1 flex items-center justify-center py-4 cursor-pointer transition-colors duration-300",
          activeTab === "sources"
            ? "text-primary-500"
            : "text-text hover:bg-bg-secondary/50"
        )}
      >
        <h3 className="font-medium">Sources</h3>
      </div>
      <div
        onClick={() => onTabChange("chat")}
        className={clsx(
          "flex-1 flex items-center justify-center py-4 cursor-pointer transition-colors duration-300",
          activeTab === "chat"
            ? "text-primary-500"
            : "text-text hover:bg-bg-secondary/50"
        )}
      >
        <h3 className="font-medium">Chat</h3>
      </div>
      <div
        onClick={() => onTabChange("tools")}
        className={clsx(
          "flex-1 flex items-center justify-center py-4 cursor-pointer transition-colors duration-300",
          activeTab === "tools"
            ? "text-primary-500"
            : "text-text hover:bg-bg-secondary/80"
        )}
      >
        <h3 className="font-medium">Tools</h3>
      </div>
      <div
        className={clsx(
          "absolute h-0.5 w-1/3 bg-primary-500 bottom-0 transition-all duration-300",
          activeTab === "chat"
            ? "translate-x-[100%]"
            : activeTab === "tools"
            ? "translate-x-[200%]"
            : "translate-x-0"
        )}
      />
    </div>
  );
};

export default TabSelect;
