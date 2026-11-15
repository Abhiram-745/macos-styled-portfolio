"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import DockItem from "./dock-item";
import AppIcon from "./app-icon";
import Symbol from "../symbol";
import { useDockItems } from "./use-dock-items";
import { DockItem as DockItemData } from "./types";
import { useWindows } from "../../context/window-context";

const DesktopDock: React.FC<{ groups: DockItemData[][] }> = ({ groups }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <nav
      aria-label="Dock"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto hidden md:flex h-[70px] items-end rounded-[26px] px-1.5 pb-[7px] bg-white/[0.18] dark:bg-black/[0.18] backdrop-blur-2xl backdrop-saturate-150 shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.35),inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_rgba(0,0,0,0.25)]"
    >
      {groups.map((items, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div
              role="separator"
              className="self-center w-px h-[46px] mx-1.5 bg-white/25"
            />
          )}
          {items.map((item) => (
            <DockItem key={item.key} item={item} mouseX={mouseX} />
          ))}
        </React.Fragment>
      ))}
    </nav>
  );
};

const MobileDock: React.FC<{ items: DockItemData[] }> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Dock" className="relative block md:hidden">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-mobile-dock-panel
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 max-h-[calc(100dvh-110px)] overflow-y-auto rounded-2xl bg-[#242831]/95 p-3 shadow-2xl"
          >
            {items.map((item, index) => (
              <motion.button
                key={item.key}
                aria-label={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: { duration: 0.12 },
                }}
                transition={{ delay: (items.length - 1 - index) * 0.05 }}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="relative flex h-12 w-44 shrink-0 items-center gap-3 text-left text-white"
              >
                <span className="relative h-11 w-11 shrink-0">
                  <AppIcon icon={item.icon} />
                </span>
                <span className="text-13">{item.title}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        aria-label={isOpen ? "Hide Dock" : "Show Dock"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-11 rounded-full bg-white/20 dark:bg-black/25 backdrop-blur-2xl shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.35)] flex items-center justify-center"
      >
        <Symbol name="chevron-up" className="h-5 w-5 text-white" />
      </button>
    </nav>
  );
};

const Dock: React.FC = () => {
  const groups = useDockItems();
  const { fullscreenId } = useWindows();
  const [isRevealed, setIsRevealed] = useState(false);
  const isHidden = !!fullscreenId && !isRevealed;

  return (
    <>
      {fullscreenId && (
        <div
          className="fixed inset-x-0 bottom-0 h-1.5 hidden md:block"
          onMouseEnter={() => setIsRevealed(true)}
        />
      )}
      <motion.div
        className="hidden md:block"
        animate={{ y: isHidden ? 120 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        onMouseLeave={() => setIsRevealed(false)}
      >
        <DesktopDock groups={groups} />
      </motion.div>
      <MobileDock items={groups.flat()} />
    </>
  );
};

export default Dock;
