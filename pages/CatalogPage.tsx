import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from '../services/api';
import { Book, Genre } from '../types';
import BookCard from '../components/BookCard';
import Spinner from '../components/ui/Spinner';
import { SearchIcon } from '../components/icons';

const CatalogPage: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    
    const searchTerm = searchParams.get('q') || '';
    const genreFilter = searchParams.get('genre') as Genre || '';

    useEffect(() => {
        setLoading(true);
        api.fetchBooks(searchTerm, genreFilter || undefined).then(data => {
            setBooks(data);
            setLoading(false);
        });
    }, [searchTerm, genreFilter]);
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchTerm = e.target.value;
        if (newSearchTerm) {
            setSearchParams({ q: newSearchTerm, genre: genreFilter });
        } else {
            setSearchParams({ genre: genreFilter });
        }
    };
    
    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
         const newGenre = e.target.value as Genre;
         if (newGenre) {
            setSearchParams({ q: searchTerm, genre: newGenre });
         } else {
            setSearchParams({ q: searchTerm });
         }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Каталог книг</h1>
            
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-card rounded-lg shadow">
                <div className="relative flex-grow">
                     <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Поиск по названию или автору..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
                <select 
                    value={genreFilter} 
                    onChange={handleGenreChange}
                    className="border rounded-md py-2 px-4 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="">Все жанры</option>
                    {Object.values(Genre).map(g => (
                        <option key={g} value={g}>{g}</option>
                    ))}
                </select>
            </div>
            
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner />
                </div>
            ) : books.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {books.map(book => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <p className="text-xl text-muted-foreground">Книги не найдены.</p>
                    <p className="text-muted-foreground">Попробуйте изменить параметры поиска.</p>
                </div>
            )}
        </div>
    );
};

export default CatalogPage;
