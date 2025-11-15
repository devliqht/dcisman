export interface ChangelogCategory {
  category: string;
  items: string[];
}

export interface Changelog {
  version: string;
  date: string;
  changes: ChangelogCategory[];
}
