import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '../types';
import * as api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { SearchIcon, XIcon } from './icons';
import Spinner from './ui/Spinner';

const SmartSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Book[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const searchRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(searchRef, () => setIsOpen(false));

    useEffect(() => {
        if (debouncedQuery.length > 2) {
            setLoading(true);
            api.fetchBooks(debouncedQuery).then(books => {
                setResults(books);
                setLoading(false);
                setIsOpen(true);
            });
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [debouncedQuery]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full max-w-xs" ref={searchRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setIsOpen(true)}
                    placeholder="Поиск книг или авторов..."
                    className="w-full pl-10 pr-10 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                {query && (
                    <button onClick={handleClear} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <XIcon className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </button>
                )}
            </div>
            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-card border rounded-md shadow-lg max-h-80 overflow-y-auto">
                    {loading ? (
                        <div className="p-4"><Spinner/></div>
                    ) : results.length > 0 ? (
                        <ul>
                            {results.map(book => (
                                <li key={book.id} className="border-b last:border-b-0">
                                    <Link 
                                        to={`/book/${book.id}`} 
                                        className="flex items-center p-3 hover:bg-muted"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <img src={book.coverUrl} alt={book.title} className="w-10 h-14 object-cover mr-3" />
                                        <div>
                                            <p className="font-semibold">{book.title}</p>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="p-4 text-center text-muted-foreground">Ничего не найдено</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SmartSearch;
