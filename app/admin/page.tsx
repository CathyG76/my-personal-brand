import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePost, setPublished } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const supabase = await createClient();
  const [{ data: postData }, { count: leadCount }] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("leads").select("*", { count: "exact", head: true }),
  ]);
  const posts = (postData ?? []) as Post[];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="text-sm rounded-lg border px-3 py-2 hover:bg-black/[0.03]"
            style={{ borderColor: "var(--line)" }}
          >
            Leads inbox{typeof leadCount === "number" ? ` (${leadCount})` : ""}
          </Link>
          <Link
            href="/admin/posts/new"
            className="text-sm rounded-lg px-3 py-2 font-medium text-white"
            style={{ background: "var(--accent)" }}
          >
            + New post
          </Link>
        </div>
      </div>

      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Manage everything that appears on your public site. Changes go live
        immediately.
      </p>

      <ul className="mt-8 space-y-3">
        {posts.length === 0 ? (
          <li className="text-sm" style={{ color: "var(--muted)" }}>
            No posts yet. Create your first one.
          </li>
        ) : (
          posts.map((post) => (
            <li
              key={post.id}
              className="rounded-xl border p-4 flex items-center gap-4"
              style={{ borderColor: "var(--line)", background: "#fff" }}
            >
              <span className="text-2xl">{post.cover_emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{post.title}</span>
                  <span
                    className="text-[11px] rounded-full px-2 py-0.5"
                    style={{
                      background: post.published ? "#e6f4ea" : "#f2efe9",
                      color: post.published ? "#1a7f37" : "#8a7f6b",
                    }}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div
                  className="text-xs truncate mt-0.5"
                  style={{ color: "var(--muted)" }}
                >
                  /posts/{post.slug}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {post.published ? (
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-xs hover:underline"
                    style={{ color: "var(--muted)" }}
                  >
                    View
                  </Link>
                ) : null}
                <form action={setPublished.bind(null, post.id, !post.published)}>
                  <SubmitButton
                    className="text-xs rounded-lg border px-2.5 py-1.5 hover:bg-black/[0.03]"
                    style={{ borderColor: "var(--line)" }}
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </SubmitButton>
                </form>
                <Link
                  href={`/admin/posts/${post.id}`}
                  className="text-xs rounded-lg border px-2.5 py-1.5 hover:bg-black/[0.03]"
                  style={{ borderColor: "var(--line)" }}
                >
                  Edit
                </Link>
                <form action={deletePost.bind(null, post.id)}>
                  <SubmitButton
                    confirm={`Delete "${post.title}"? This can't be undone.`}
                    className="text-xs rounded-lg border px-2.5 py-1.5 hover:bg-black/[0.03]"
                    style={{ borderColor: "var(--line)", color: "#b8552a" }}
                  >
                    Delete
                  </SubmitButton>
                </form>
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
