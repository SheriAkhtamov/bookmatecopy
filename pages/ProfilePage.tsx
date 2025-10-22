import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as api from '../services/api';
import { Book } from '../types';
import BookCard from '../components/BookCard';
import Spinner from '../components/ui/Spinner';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [readBooks, setReadBooks] = useState<Book[]>([]);
    const [wantToReadBooks, setWantToReadBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && 'readingHistory' in user) {
            setLoading(true);
            const fetchBooks = async () => {
                const [read, want] = await Promise.all([
                    api.fetchBooksByIds(user.readingHistory),
                    api.fetchBooksByIds(user.wantToRead),
                ]);
                setReadBooks(read);
                setWantToReadBooks(want);
                setLoading(false);
            };
            fetchBooks();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }
    
    if (!user) {
        return <div className="text-center py-16">Пользователь не найден.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold">Профиль: {user.username}</h1>
                {'role' in user && user.role === 'admin' && (
                    <p className="text-lg text-primary">Администратор</p>
                )}
            </div>

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Прочитанные книги</h2>
                {readBooks.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {readBooks.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Вы еще не отметили ни одной прочитанной книги.</p>
                )}
            </section>
            
            <section>
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Хочу прочитать</h2>
                {wantToReadBooks.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {wantToReadBooks.map(book => <BookCard key={book.id} book={book} />)}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Ваш список для чтения пуст.</p>
                )}
            </section>
        </div>
    );
};

export default ProfilePage;
