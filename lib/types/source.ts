export interface Source {
  id: string;
  name: string;
  url: string;
  rss_url: string | null;
  category: "tier1" | "tier2" | "tier3" | "other";
  notes: string | null;
  active: boolean;
  created_at: string;
}
