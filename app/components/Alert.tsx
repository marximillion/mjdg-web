// Copyright © MJMDG 2026
import { useState } from "react";

interface AlertProps {
  message: string;
}

export default function Alert({ message }: AlertProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="alert alert--success">
      <span>{message}</span>
      <button className="alert-dismiss" onClick={() => setVisible(false)} aria-label="Dismiss">✕</button>
    </div>
  );
}
