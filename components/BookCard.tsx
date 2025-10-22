
import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <Link to={`/book/${book.id}`}>
        <img src={book.coverUrl} alt={book.title} className="w-full h-64 object-cover" />
        <div className="p-4">
          <h3 className="font-bold text-lg truncate">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.publicationYear}</p>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
