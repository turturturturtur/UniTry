"use client";

import { useState } from "react";
import { Modal } from "./Modal";

interface LabelTagProps {
  label: string;
  content: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function LabelTag({
  label,
  content,
  orientation = "horizontal",
  className = ""
}: LabelTagProps) {
  const [showModal, setShowModal] = useState(false);

  const verticalClass = orientation === "vertical"
    ? "[writing-mode:vertical-rl] h-20"
    : "";

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center justify-center px-2 py-1 text-xs font-medium text-white bg-black/50 hover:bg-black/70
          rounded-full border border-white/20 transition-colors cursor-pointer ${
            verticalClass
          } ${className}`}
        title={label}
      >
        {label}
      </button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={label}
        content={content}
      />
    </>
  );
}