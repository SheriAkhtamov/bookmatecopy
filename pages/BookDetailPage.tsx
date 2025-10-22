import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as api from '../services/api';
import { Author, Book, Publisher, Review, User } from '../types';
import Spinner from '../components/ui/Spinner';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft } from '../components/icons';

const BookDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [book, setBook] = useState<Book | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);
    const [publisher, setPublisher] = useState<Publisher | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewUsers, setReviewUsers] = useState<Record<string, User | null>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                const bookData = await api.fetchBookById(id);
                setBook(bookData);

                if (bookData) {
                    const authorData = await api.fetchAuthorById(bookData.authorId);
                    setAuthor(authorData);

                    const publisherData = await api.fetchPublisherById(bookData.publisherId);
                    setPublisher(publisherData);
                    
                    const reviewData = await api.fetchReviewsForBook(id);
                    setReviews(reviewData);

                    const userIds = [...new Set(reviewData.map(r => r.userId))];
                    const usersData: Record<string, User | null> = {};
                    for(const userId of userIds) {
                        usersData[userId] = await api.fetchUserById(userId) as User;
                    }
                    setReviewUsers(usersData);
                }
            } catch (error) {
                console.error("Failed to fetch book details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
    }

    if (!book) {
        return <div className="text-center py-16">Книга не найдена.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/catalog" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
                <ArrowLeft className="w-4 h-4" />
                Назад в каталог
            </Link>
            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <img src={book.coverUrl} alt={book.title} className="w-full rounded-lg shadow-lg" />
                    {user && (
                         <Link to={`/read/${book.id}`} className="mt-6 block w-full text-center bg-primary text-primary-foreground font-bold py-3 px-4 rounded-md hover:bg-primary/90 transition-colors">
                            Читать
                        </Link>
                    )}
                </div>
                <div className="md:col-span-2">
                    <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
                    <p className="text-xl text-muted-foreground mb-4">
                        {author?.name || 'Неизвестный автор'}
                    </p>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
                        <span>Год публикации: {book.publicationYear}</span>
                        <span>Издатель: {publisher?.name || 'Неизвестно'}</span>
                        <span>Жанры: {book.genres.join(', ')}</span>
                    </div>

                    <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2">Описание</h2>
                    <p className="text-foreground/90 leading-relaxed">{book.summary}</p>
                    
                    <h2 className="text-2xl font-semibold mt-8 mb-4 border-b pb-2">Отзывы</h2>
                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {reviews.map(review => (
                                <div key={review.id} className="bg-card p-4 rounded-lg border">
                                    <div className="flex items-center justify-between mb-2">
                                       <span className="font-semibold">{reviewUsers[review.userId]?.username || 'Аноним'}</span>
                                       <span className="text-sm text-muted-foreground">Рейтинг: {review.rating}/5</span>
                                    </div>
                                    <p className="text-sm">{review.text}</p>
                                    <p className="text-xs text-muted-foreground text-right mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">Отзывов пока нет.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookDetailPage;
