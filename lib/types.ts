export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  cover_emoji: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LeadStatus = "new" | "contacted" | "won" | "archived";

export type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: LeadStatus;
  source_slug: string | null;
  source_post_id: string | null;
  created_at: string;
};
