export interface BriefingContent {
  sections: Array<{
    type: "headline" | "research" | "culture" | "audience" | "resources";
    label: string;
    items: Array<{
      heading?: string;
      body?: string;
      pullQuote?: {
        label: string;
        text: string;
      };
      audienceBlock?: {
        audience: "parent" | "leader" | "student";
        body: string;
      };
      link?: {
        text: string;
        url: string;
      };
    }>;
  }>;
}

export interface Briefing {
  id: string;
  slug: string;
  week_of: string;
  issue_number: number;
  title: string;
  headline: string;
  lede: string;
  in_this_issue: string[];
  audiences: ("parent" | "leader" | "student")[];
  topic_tags: string[];
  content_json: BriefingContent;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
