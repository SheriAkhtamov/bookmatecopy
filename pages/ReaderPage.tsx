import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import { Book } from '../types';
import { XIcon } from '../components/icons';
import Spinner from '../components/ui/Spinner';

const ReaderPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            api.fetchBookById(id).then(bookData => {
                setBook(bookData);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen bg-background"><Spinner /></div>;
    }
    
    if (!book) {
        return <div className="text-center py-16 bg-background">Книга не найдена.</div>;
    }

    return (
        <div className="fixed inset-0 bg-background flex flex-col">
            <header className="flex items-center justify-between p-4 border-b bg-card">
                <div>
                    <h1 className="text-lg font-semibold truncate">{book.title}</h1>
                    <p className="text-sm text-muted-foreground">Формат: {book.format}</p>
                </div>
                <Link to={`/book/${id}`} className="p-2 rounded-full hover:bg-muted">
                    <XIcon className="w-6 h-6" />
                </Link>
            </header>
            <main className="flex-grow flex items-center justify-center p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Интерфейс читалки</h2>
                    <p className="text-muted-foreground">
                        Здесь будет отображаться содержимое книги в формате {book.format}.
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        (Это заглушка для демонстрации)
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ReaderPage;
