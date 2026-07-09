"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAllowedAdmin } from "@/lib/admin-access";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  if (!isAllowedAdmin(email)) {
    await supabase.auth.signOut();
    redirect(`/login?error=${encodeURIComponent("This account is not an admin.")}`);
  }
  redirect("/admin");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!isAllowedAdmin(email)) {
    redirect(
      `/login?error=${encodeURIComponent("This email isn't allowed to register as admin.")}`,
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  // If email confirmation is off, a session is created and this lands in admin.
  // If it's on, the user must confirm; show a notice.
  redirect(`/login?notice=${encodeURIComponent("Account created. If email confirmation is on, check your inbox, then sign in.")}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
