export interface User {
  id: string;
  username: string;
  readingHistory: string[]; // array of book IDs
  wantToRead: string[]; // array of book IDs
  friends: string[]; // array of user IDs
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin';
}

export interface Author {
  id: string;
  name: string;
}

export interface Publisher {
  id: string;
  name: string;
}

export enum Genre {
  Fantasy = "Фэнтези",
  SciFi = "Научная фантастика",
  Mystery = "Детектив",
  Romance = "Роман",
  Horror = "Ужасы",
  Thriller = "Триллер",
  NonFiction = "Нон-фикшн",
}

export interface Book {
  id: string;
  title: string;
  authorId: string;
  publisherId: string;
  publicationYear: number;
  genres: Genre[];
  coverUrl: string;
  summary: string;
  contentUrl: string; // URL to EPUB, PDF, etc.
  format: 'EPUB' | 'PDF' | 'FB2';
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number; // 1-5
  text: string;
  createdAt: string;
}

export interface ReadingProgress {
  [bookId: string]: {
    location: string | number; // e.g., epubcfi or page number
    percentage: number;
  };
}