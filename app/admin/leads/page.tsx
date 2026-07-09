import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { setLeadStatus, deleteLead } from "@/app/actions";
import { SubmitButton } from "@/components/SubmitButton";
import type { Lead, LeadStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const STATUSES: LeadStatus[] = ["new", "contacted", "won", "archived"];
const STATUS_COLOR: Record<LeadStatus, string> = {
  new: "#b8552a",
  contacted: "#8a6d1a",
  won: "#1a7f37",
  archived: "#6b6b6b",
};

export default async function LeadsInbox() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
  const leads = (data ?? []) as Lead[];

  const open = leads.filter((l) => l.status !== "archived").length;

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/admin"
        className="text-sm hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        ← Admin
      </Link>
      <div className="mt-4 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          {open} open · {leads.length} total
        </span>
      </div>
      <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
        Everyone who subscribed from your site. Move them through your pipeline.
      </p>

      <ul className="mt-8 space-y-3">
        {leads.length === 0 ? (
          <li className="text-sm" style={{ color: "var(--muted)" }}>
            No leads yet. They&apos;ll show up here the moment someone subscribes.
          </li>
        ) : (
          leads.map((lead) => (
            <li
              key={lead.id}
              className="rounded-xl border p-4"
              style={{ borderColor: "var(--line)", background: "#fff" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {lead.name || "Anonymous"}
                    </span>
                    <span
                      className="text-[11px] rounded-full px-2 py-0.5 capitalize"
                      style={{
                        color: STATUS_COLOR[lead.status] ?? "#6b6b6b",
                        background: "#f2efe9",
                      }}
                    >
                      {lead.status}
                    </span>
                  </div>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-sm hover:underline"
                    style={{ color: "var(--accent)" }}
                  >
                    {lead.email}
                  </a>
                  {lead.message ? (
                    <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                      “{lead.message}”
                    </p>
                  ) : null}
                  <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {new Date(lead.created_at).toLocaleString()}
                    {lead.source_slug ? ` · from /posts/${lead.source_slug}` : ""}
                  </p>
                </div>

                <form action={deleteLead.bind(null, lead.id)}>
                  <SubmitButton
                    confirm="Delete this lead permanently?"
                    className="text-xs hover:underline shrink-0"
                    style={{ color: "#b8552a" }}
                  >
                    Delete
                  </SubmitButton>
                </form>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <form key={s} action={setLeadStatus.bind(null, lead.id, s)}>
                    <SubmitButton
                      className="text-xs rounded-lg border px-2.5 py-1 capitalize hover:bg-black/[0.03] disabled:opacity-40"
                      style={{
                        borderColor: "var(--line)",
                        fontWeight: lead.status === s ? 700 : 400,
                        background: lead.status === s ? "#f2efe9" : "transparent",
                      }}
                    >
                      {s}
                    </SubmitButton>
                  </form>
                ))}
              </div>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
