import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/auth-actions";
import { isAllowedAdmin } from "@/lib/admin-access";
import { SubmitButton } from "@/components/SubmitButton";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isAllowedAdmin(user.email)) {
    await supabase.auth.signOut();
    redirect(`/login?error=${encodeURIComponent("This account is not an admin.")}`);
  }

  return (
    <>
      <div
        className="border-b text-xs"
        style={{ borderColor: "var(--line)", background: "#f7f5f1" }}
      >
        <div className="max-w-3xl mx-auto px-6 py-2 flex items-center justify-between">
          <span style={{ color: "var(--muted)" }}>
            Signed in as {user.email}
          </span>
          <form action={signOut}>
            <SubmitButton className="hover:underline" style={{ color: "var(--accent)" }}>
              Sign out
            </SubmitButton>
          </form>
        </div>
      </div>
      {children}
    </>
  );
}
