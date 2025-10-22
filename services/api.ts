import { AdminUser, Author, Book, Genre, Publisher, Review, User } from '../types';
import { handleRequest } from '../server';

const API_BASE_URL = '/api'; // Using relative URL to be handled by our mock server

// This new function replaces the global fetch override.
// It directly calls the mock server's request handler.
const apiFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const request = new Request(input, init);
    // Simulate network delay
    return new Promise(resolve => 
        setTimeout(() => resolve(handleRequest(request)), 200)
    );
};

// Helper function to handle fetch responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// --- Auth ---
export const login = (username: string, password: string): Promise<User | AdminUser | null> => {
    return apiFetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    }).then(handleResponse);
};

export const register = (username: string, password: string): Promise<User | null> => {
     return apiFetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    }).then(handleResponse);
};

// --- Users ---
export const fetchUserById = (id: string): Promise<User | AdminUser | null> => {
    return apiFetch(`${API_BASE_URL}/users/${id}`).then(handleResponse);
};

// --- Books ---
export const fetchBooks = (query?: string, genre?: Genre): Promise<Book[]> => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (genre) params.append('genre', genre);
    return apiFetch(`${API_BASE_URL}/books?${params.toString()}`).then(handleResponse);
};

export const fetchBookById = (id: string): Promise<Book | null> => {
    return apiFetch(`${API_BASE_URL}/books/${id}`).then(handleResponse);
};

export const fetchBooksByIds = (ids: string[]): Promise<Book[]> => {
    if (ids.length === 0) return Promise.resolve([]);
    const params = new URLSearchParams({ ids: ids.join(',') });
    return apiFetch(`${API_BASE_URL}/books?${params.toString()}`).then(handleResponse);
};

export const createBook = (bookData: Omit<Book, 'id'>): Promise<Book> => {
    return apiFetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
    }).then(handleResponse);
};

export const updateBook = (id: string, bookData: Partial<Book>): Promise<Book> => {
    return apiFetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
    }).then(handleResponse);
};

export const deleteBook = (id: string): Promise<void> => {
    return apiFetch(`${API_BASE_URL}/books/${id}`, {
        method: 'DELETE',
    }).then(handleResponse);
};


// --- Authors ---
export const fetchAuthors = (): Promise<Author[]> => {
    return apiFetch(`${API_BASE_URL}/authors`).then(handleResponse);
};

export const fetchAuthorById = (id: string): Promise<Author | null> => {
    return apiFetch(`${API_BASE_URL}/authors/${id}`).then(handleResponse);
};

// --- Publishers ---
export const fetchPublishers = (): Promise<Publisher[]> => {
    return apiFetch(`${API_BASE_URL}/publishers`).then(handleResponse);
};

export const fetchPublisherById = (id: string): Promise<Publisher | null> => {
    return apiFetch(`${API_BASE_URL}/publishers/${id}`).then(handleResponse);
};


// --- Reviews ---
export const fetchReviewsForBook = (bookId: string): Promise<Review[]> => {
    return apiFetch(`${API_BASE_URL}/reviews/book/${bookId}`).then(handleResponse);
};