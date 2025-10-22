import React, { useEffect, useState } from 'react';
import { generateRecommendations } from '../services/geminiService';
import * as api from '../services/api';
import { Book } from '../types';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [recommendations, setRecommendations] = useState<{ title: string; details: string[] }[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(true);
    const [readBooks, setReadBooks] = useState<Book[]>([]);
    const [newBooks, setNewBooks] = useState<Book[]>([]);

    useEffect(() => {
        const fetchReadBooksAndRecs = async () => {
            if (user && 'readingHistory' in user && user.readingHistory.length > 0) {
                const books = await api.fetchBooksByIds(user.readingHistory);
                setReadBooks(books);
                try {
                    const recs = await generateRecommendations(books);
                    setRecommendations(recs);
                } catch (error) {
                    console.error("Failed to get recommendations:", error);
                } finally {
                    setLoadingRecs(false);
                }
            } else {
                // If no user or history, get default recommendations
                try {
                    const recs = await generateRecommendations([]);
                    setRecommendations(recs);
                } catch (error) {
                    console.error("Failed to get default recommendations:", error);
                } finally {
                    setLoadingRecs(false);
                }
            }
        };

        const fetchNewBooks = async () => {
            const allBooks = await api.fetchBooks();
            setNewBooks(allBooks.sort((a,b) => b.publicationYear - a.publicationYear).slice(0, 5));
        }

        fetchReadBooksAndRecs();
        fetchNewBooks();
    }, [user]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">Добро пожаловать в Bookish</h1>
                <p className="text-lg text-muted-foreground">Ваш персональный книжный мир</p>
            </div>
            
            {user && readBooks.length > 0 && (
                 <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Продолжить чтение</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {readBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                </section>
            )}

            <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Рекомендации для вас</h2>
                {loadingRecs ? (
                    <div className="flex justify-center p-8"><Spinner /></div>
                ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       {recommendations.map((rec, index) => (
                         <div key={index} className="bg-card p-6 rounded-lg shadow-md">
                           <h3 className="font-bold text-xl mb-2">{rec.title}</h3>
                           <ul className="list-disc list-inside text-muted-foreground space-y-1">
                             {rec.details.map((detail, i) => (
                               <li key={i}>{detail}</li>
                             ))}
                           </ul>
                         </div>
                       ))}
                     </div>
                )}
            </section>
            
             <section>
                <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Новинки</h2>
                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {newBooks.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
                 <div className="text-center mt-8">
                     <Link to="/catalog" className="text-primary hover:underline">
                        Смотреть все книги
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
