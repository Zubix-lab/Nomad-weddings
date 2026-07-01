"use client";

import React from "react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar"
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: "grid", gap: "20px" }}>
        <p style={{ margin: 0, color: "var(--slate-grey)", lineHeight: "1.5" }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button className="secondary-button" onClick={onClose}>
            {cancelText}
          </button>
          <button
            className="primary-button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{ background: "var(--error, #ba1a1a)" }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
