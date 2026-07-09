import Link from "next/link";
import { signIn, signUp } from "@/app/auth-actions";
import { SubmitButton } from "@/components/SubmitButton";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;
  const inputStyle = { borderColor: "var(--line)" };

  return (
    <main className="max-w-md mx-auto px-6 py-16">
      <Link
        href="/"
        className="text-sm hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        ← Back to site
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Admin sign in</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        This gate protects your admin only. Your public site stays open to
        everyone.
      </p>

      {error ? (
        <p className="mt-4 text-sm font-medium" style={{ color: "#b8552a" }}>
          {error}
        </p>
      ) : null}
      {notice ? (
        <p className="mt-4 text-sm font-medium" style={{ color: "#1a7f37" }}>
          {notice}
        </p>
      ) : null}

      <form className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </div>
        <div className="flex items-center gap-3">
          <SubmitButton
            formAction={signIn}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            Sign in
          </SubmitButton>
          <SubmitButton
            formAction={signUp}
            className="rounded-lg border px-4 py-2 text-sm font-medium"
            style={inputStyle}
          >
            Create account
          </SubmitButton>
        </div>
      </form>
    </main>
  );
}
