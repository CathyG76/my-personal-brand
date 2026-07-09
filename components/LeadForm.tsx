import { submitLead } from "@/app/actions";

export function LeadForm({
  sourceSlug,
  heading = "Get my posts in your inbox",
  blurb = "No spam. Just new writing and the occasional behind-the-scenes note.",
}: {
  sourceSlug?: string;
  heading?: string;
  blurb?: string;
}) {
  return (
    <form
      action={submitLead}
      className="rounded-xl border p-5 sm:p-6"
      style={{ borderColor: "var(--line)", background: "#fff" }}
    >
      <h3 className="font-semibold text-lg">{heading}</h3>
      <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
        {blurb}
      </p>
      {sourceSlug ? (
        <input type="hidden" name="source_slug" value={sourceSlug} />
      ) : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input
          name="name"
          placeholder="Your name (optional)"
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: "var(--line)" }}
        />
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: "var(--line)" }}
        />
      </div>
      <textarea
        name="message"
        placeholder="Anything you want me to know? (optional)"
        rows={2}
        className="mt-3 w-full rounded-lg border px-3 py-2 text-sm"
        style={{ borderColor: "var(--line)" }}
      />
      <button
        type="submit"
        className="mt-4 rounded-lg px-4 py-2 text-sm font-medium text-white"
        style={{ background: "var(--accent)" }}
      >
        Subscribe
      </button>
    </form>
  );
}

export function LeadNotice({ status }: { status?: string }) {
  if (!status) return null;
  const map: Record<string, { text: string; color: string }> = {
    ok: { text: "🎉 Thanks — you're on the list!", color: "#1a7f37" },
    invalid: { text: "Please enter a valid email address.", color: "#b8552a" },
    error: { text: "Something went wrong. Please try again.", color: "#b8552a" },
  };
  const m = map[status];
  if (!m) return null;
  return (
    <p className="text-sm font-medium mb-4" style={{ color: m.color }}>
      {m.text}
    </p>
  );
}
