import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import type { Post } from "@/lib/types";

export function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  post?: Post;
  submitLabel: string;
}) {
  const inputStyle = { borderColor: "var(--line)" };
  return (
    <form action={action} className="mt-8 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <input
          name="title"
          required
          defaultValue={post?.title ?? ""}
          placeholder="A headline worth clicking"
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </div>

      <div className="grid sm:grid-cols-[1fr_auto] gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Slug{" "}
            <span style={{ color: "var(--muted)" }}>
              (URL — leave blank to auto-generate)
            </span>
          </label>
          <input
            name="slug"
            defaultValue={post?.slug ?? ""}
            placeholder="my-post"
            className="w-full rounded-lg border px-3 py-2"
            style={inputStyle}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Emoji</label>
          <input
            name="cover_emoji"
            defaultValue={post?.cover_emoji ?? "📝"}
            maxLength={4}
            className="w-20 rounded-lg border px-3 py-2 text-center"
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Excerpt</label>
        <input
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          placeholder="One sentence that makes people want to read on."
          className="w-full rounded-lg border px-3 py-2"
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Body</label>
        <textarea
          name="body"
          rows={14}
          defaultValue={post?.body ?? ""}
          placeholder="Write your post here…"
          className="w-full rounded-lg border px-3 py-2 font-mono text-sm"
          style={inputStyle}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={post?.published ?? false}
        />
        Published (visible on the public site)
      </label>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton
          className="rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ background: "var(--accent)" }}
        >
          {submitLabel}
        </SubmitButton>
        <Link
          href="/admin"
          className="text-sm hover:opacity-70"
          style={{ color: "var(--muted)" }}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
