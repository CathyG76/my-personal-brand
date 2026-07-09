// Optional allowlist: if ADMIN_EMAILS is set (comma-separated), only those
// addresses may reach the admin. If unset, any authenticated user may — fine
// for a single-owner demo. This is what keeps open sign-up from handing the
// admin to strangers. (Server-only env; not a "use server" module so it can
// export sync helpers.)
export function adminAllowlist(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email: string | null | undefined): boolean {
  const list = adminAllowlist();
  if (list.length === 0) return true;
  return !!email && list.includes(email.toLowerCase());
}
