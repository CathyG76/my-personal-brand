"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  confirm,
  className,
  style,
}: {
  children: React.ReactNode;
  confirm?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      style={style}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
