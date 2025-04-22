export interface CalendarItem {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    date: string; // YYYY-MM-DD format
    createdAt?: Date;
  }