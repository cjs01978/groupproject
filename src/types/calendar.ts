export interface CalendarItem {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  date: string; // ISO string format
  createdAt: string;
}