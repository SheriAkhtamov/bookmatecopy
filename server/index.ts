import { initializeData, db, saveData, DEFAULT_COVER_URL } from '../services/mockApi';
import { Book, Genre } from '../types';

// This is a mock server using window.fetch to simulate a real backend.
// In a real application, this would be a separate Node.js/Express server.

// --- Helper Functions ---
const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const errorResponse = (message: string, status = 404) => {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

const withDefaultCover = (book: Book): Book => ({
    ...book,
    coverUrl: book.coverUrl || DEFAULT_COVER_URL
});

// --- Mock Router ---
export const handleRequest = async (request: Request): Promise<Response> => {
    // FIX: The URL constructor provides a standard way to parse URLs, including searchParams.
    const { pathname, searchParams } = new URL(request.url);
    const method = request.method.toUpperCase();

    console.log(`[Mock Server] ${method} ${pathname}`);

    // --- AUTH ---
    if (pathname.startsWith('/api/auth/login')) {
        const { username, password } = await request.json();
        const user = db.getUsers().find(u => u.username === username);
        if (!user) return errorResponse('User not found', 401);
        
        if ('role' in user && user.role === 'admin' && password !== 'sheri2001') {
            return errorResponse('Invalid credentials', 401);
        }
        return jsonResponse(user);
    }

    if (pathname.startsWith('/api/auth/register')) {
       // Placeholder: Real registration logic would be more complex
       const { username } = await request.json();
       if (db.getUsers().some(u => u.username === username)) {
           return errorResponse('Username already exists', 400);
       }
       const newUser = { id: `user-${Date.now()}`, username, readingHistory: [], wantToRead: [], friends: [] };
       db.getUsers().push(newUser);
       saveData();
       return jsonResponse(newUser, 201);
    }
    
    // --- USERS ---
    if (pathname.startsWith('/api/users/')) {
        const id = pathname.split('/').pop();
        const user = db.getUsers().find(u => u.id === id);
        return user ? jsonResponse(user) : errorResponse('User not found');
    }

    // --- BOOKS ---
    if (pathname === '/api/books') {
        if (method === 'GET') {
            const query = searchParams.get('q')?.toLowerCase();
            const genre = searchParams.get('genre') as Genre;
            const idsParam = searchParams.get('ids');

            let books = db.getBooks();

            if (idsParam) {
                const ids = idsParam.split(',');
                books = books.filter(b => ids.includes(b.id));
            }

            if (query) {
                const authors = db.getAuthors();
                const authorIds = authors.filter(a => a.name.toLowerCase().includes(query)).map(a => a.id);
                books = books.filter(b => b.title.toLowerCase().includes(query) || authorIds.includes(b.authorId));
            }
            if (genre) {
                books = books.filter(b => b.genres.includes(genre));
            }
            return jsonResponse(books.map(withDefaultCover));
        }
        
        if (method === 'POST') {
            const newBookData = await request.json();
            const newBook: Book = { ...newBookData, id: `book-${Date.now()}` };
            const currentBooks = db.getBooks();
            db.setBooks([...currentBooks, newBook]);
            saveData();
            return jsonResponse(newBook, 201);
        }
    }

    if (pathname.startsWith('/api/books/')) {
        const id = pathname.split('/').pop();
        if (!id) return errorResponse('Book ID is required', 400);
        
        let books = db.getBooks();
        const bookIndex = books.findIndex(b => b.id === id);
        
        if (bookIndex === -1) return errorResponse('Book not found', 404);

        if (method === 'GET') {
            return jsonResponse(withDefaultCover(books[bookIndex]));
        }

        if (method === 'PUT') {
            const updatedData = await request.json();
            books[bookIndex] = { ...books[bookIndex], ...updatedData };
            db.setBooks(books);
            saveData();
            return jsonResponse(books[bookIndex]);
        }
        
        if (method === 'DELETE') {
            const deletedBook = books.splice(bookIndex, 1);
            db.setBooks(books);
            saveData();
            return jsonResponse(deletedBook[0]);
        }
    }

    // --- AUTHORS ---
    if (pathname === '/api/authors') {
        return jsonResponse(db.getAuthors());
    }
     if (pathname.startsWith('/api/authors/')) {
        const id = pathname.split('/').pop();
        const author = db.getAuthors().find(a => a.id === id);
        return author ? jsonResponse(author) : errorResponse('Author not found');
    }

    // --- PUBLISHERS ---
    if (pathname === '/api/publishers') {
        return jsonResponse(db.getPublishers());
    }
     if (pathname.startsWith('/api/publishers/')) {
        const id = pathname.split('/').pop();
        const publisher = db.getPublishers().find(p => p.id === id);
        return publisher ? jsonResponse(publisher) : errorResponse('Publisher not found');
    }
    
    // --- REVIEWS ---
     if (pathname.startsWith('/api/reviews/book/')) {
        const bookId = pathname.split('/').pop();
        const reviews = db.getReviews().filter(r => r.bookId === bookId);
        return jsonResponse(reviews);
    }

    return errorResponse('Not Found', 404);
};


// --- Server Start ---
export const startServer = () => {
    // Initialize data from localStorage or defaults
    initializeData();

    // The problematic fetch override has been removed.
    // The mocking logic is now handled in `services/api.ts`.
    console.log('Mock server started. Fetch is not polyfilled.');
};