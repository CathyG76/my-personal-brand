"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/types";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// ── Posts ─────────────────────────────────────────────────────────────────
export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required");

  const rawSlug = String(formData.get("slug") ?? "").trim();
  let slug = rawSlug ? slugify(rawSlug) : slugify(title);
  if (!slug) slug = `post-${Date.now()}`;

  const published = formData.get("published") === "on";

  // ensure unique slug
  const { data: existing } = await supabase
    .from("posts")
    .select("slug")
    .eq("slug", slug)
    .maybeSingle();
  if (existing) slug = `${slug}-${Math.floor(Date.now() / 1000)}`;

  const { data, error } = await supabase
    .from("posts")
    .insert({
      title,
      slug,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      body: String(formData.get("body") ?? ""),
      cover_emoji: String(formData.get("cover_emoji") ?? "").trim() || "📝",
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/admin");
  redirect(`/admin/posts/${data.id}`);
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required");

  const slug = slugify(String(formData.get("slug") ?? "").trim() || title);
  const published = formData.get("published") === "on";

  // fetch current to decide published_at
  const { data: current } = await supabase
    .from("posts")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const published_at = published
    ? current?.published_at ?? new Date().toISOString()
    : null;

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      slug,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      body: String(formData.get("body") ?? ""),
      cover_emoji: String(formData.get("cover_emoji") ?? "").trim() || "📝",
      published,
      published_at,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath(`/posts/${slug}`);
  revalidatePath("/admin");
  revalidatePath(`/admin/posts/${id}`);
  redirect("/admin");
}

export async function setPublished(id: string, published: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/admin");
}

// ── Leads ─────────────────────────────────────────────────────────────────
export async function submitLead(formData: FormData) {
  const supabase = await createClient();

  const email = String(formData.get("email") ?? "").trim();
  const slug = String(formData.get("source_slug") ?? "").trim() || null;

  if (!email || !email.includes("@")) {
    redirect(slug ? `/posts/${slug}?lead=invalid` : `/?lead=invalid`);
  }

  let source_post_id: string | null = null;
  if (slug) {
    const { data: post } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    source_post_id = post?.id ?? null;
  }

  const { error } = await supabase.from("leads").insert({
    name: String(formData.get("name") ?? "").trim(),
    email,
    message: String(formData.get("message") ?? "").trim(),
    source_slug: slug,
    source_post_id,
  });

  if (error) {
    redirect(slug ? `/posts/${slug}?lead=error` : `/?lead=error`);
  }

  revalidatePath("/admin/leads");
  redirect(slug ? `/posts/${slug}?lead=ok` : `/?lead=ok`);
}

export async function setLeadStatus(id: string, status: LeadStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/leads");
}
