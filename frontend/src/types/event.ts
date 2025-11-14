export interface Event {
  id: string;
  title: string;
  dateRange: {
    start: string;
    end: string;
  };
  description: string;
  author: string;
  publishedDate: string;
}
