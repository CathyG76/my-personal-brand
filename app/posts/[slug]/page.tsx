import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LeadForm, LeadNotice } from "@/components/LeadForm";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lead?: string }>;
}) {
  const { slug } = await params;
  const { lead } = await searchParams;

  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (!data) notFound();
  const post = data as Post;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="text-sm hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        ← All writing
      </Link>

      <article className="mt-6">
        <div className="text-4xl">{post.cover_emoji}</div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
          {post.title}
        </h1>
        {post.published_at ? (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {new Date(post.published_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        ) : null}
        {post.excerpt ? (
          <p className="mt-4 text-lg" style={{ color: "var(--muted)" }}>
            {post.excerpt}
          </p>
        ) : null}
        <div className="prose mt-8 text-[1.05rem]">{post.body}</div>
      </article>

      <section className="mt-14">
        <LeadNotice status={lead} />
        <LeadForm
          sourceSlug={post.slug}
          heading="Enjoyed this? Let's stay in touch."
          blurb="Drop your email and I'll send you the next one."
        />
      </section>
    </main>
  );
}
