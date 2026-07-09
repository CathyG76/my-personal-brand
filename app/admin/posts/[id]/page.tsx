import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePost } from "@/app/actions";
import { PostForm } from "@/components/PostForm";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) notFound();
  const post = data as Post;

  const action = updatePost.bind(null, post.id);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between">
        <Link
          href="/admin"
          className="text-sm hover:opacity-70"
          style={{ color: "var(--muted)" }}
        >
          ← Admin
        </Link>
        {post.published ? (
          <Link
            href={`/posts/${post.slug}`}
            className="text-sm hover:opacity-70"
            style={{ color: "var(--muted)" }}
          >
            View live →
          </Link>
        ) : null}
      </div>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">Edit post</h1>
      <PostForm action={action} post={post} submitLabel="Save changes" />
    </main>
  );
}
