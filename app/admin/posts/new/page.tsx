import Link from "next/link";
import { createPost } from "@/app/actions";
import { PostForm } from "@/components/PostForm";

export const dynamic = "force-dynamic";

export default function NewPost() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/admin"
        className="text-sm hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        ← Admin
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">New post</h1>
      <PostForm action={createPost} submitLabel="Create post" />
    </main>
  );
}
