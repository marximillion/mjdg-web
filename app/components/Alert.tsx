// Copyright © MJMDG 2026
import { useState } from "react";

interface AlertProps {
  message: string;
  variant?: "success" | "error" | "warning";
}

export default function Alert({ message, variant = "success" }: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className={`alert alert--${variant}`}>
      <span>{message}</span>
      <button className="alert-dismiss" onClick={() => setVisible(false)} aria-label="Dismiss">✕</button>
    </div>
  );
}
