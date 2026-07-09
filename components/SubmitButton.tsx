"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  confirm,
  className,
  style,
  formAction,
}: {
  children: React.ReactNode;
  confirm?: string;
  className?: string;
  style?: React.CSSProperties;
  formAction?: (formData: FormData) => void | Promise<void>;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className}
      style={style}
      formAction={formAction}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending ? "…" : children}
    </button>
  );
}
