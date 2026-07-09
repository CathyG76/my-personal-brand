import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LeadForm, LeadNotice } from "@/components/LeadForm";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string }>;
}) {
  const { lead } = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const posts = (data ?? []) as Post[];

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <section className="mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Hi, I&apos;m Cathy.
        </h1>
        <p className="mt-3 text-lg" style={{ color: "var(--muted)" }}>
          I write about building things I own — products, an audience, and a
          career that isn&apos;t at the mercy of someone else&apos;s algorithm.
          Everything here lives on my own domain, on my own terms.
        </p>
      </section>

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide mb-5"
            style={{ color: "var(--muted)" }}>
          Latest writing
        </h2>

        {posts.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            No posts published yet. Check back soon.
          </p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/posts/${post.slug}`}
                  className="group flex gap-4 rounded-xl border p-5 transition hover:shadow-sm"
                  style={{ borderColor: "var(--line)", background: "#fff" }}
                >
                  <span className="text-2xl leading-none">{post.cover_emoji}</span>
                  <span className="flex-1">
                    <span className="block font-semibold text-lg group-hover:opacity-80">
                      {post.title}
                    </span>
                    <span
                      className="block text-sm mt-1"
                      style={{ color: "var(--muted)" }}
                    >
                      {post.excerpt}
                    </span>
                    {post.published_at ? (
                      <span
                        className="block text-xs mt-2"
                        style={{ color: "var(--muted)" }}
                      >
                        {new Date(post.published_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <LeadNotice status={lead} />
        <LeadForm />
      </section>
    </main>
  );
}
