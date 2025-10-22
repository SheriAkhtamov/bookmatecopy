import { AdminUser, Author, Book, Genre, Publisher, User, Review } from '../types';

// In-memory data store, with localStorage persistence for simple demo
let users: (User | AdminUser)[] = [];
let authors: Author[] = [];
let publishers: Publisher[] = [];
let books: Book[] = [];
let reviews: Review[] = [];

const DB_KEY = 'bookish_db';

export const DEFAULT_COVER_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGIocHBwYETAjJCYvMDY3Pz48P0hQTEhQSUxFUSU//2wBDAQYFBQgHCA8JCg8gJCYv/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1VZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A8/ooor6A+ECiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACii-..';

interface Database {
    users: (User | AdminUser)[];
    authors: Author[];
    publishers: Publisher[];
    books: Book[];
    reviews: Review[];
}

export const saveData = () => {
    try {
        const db: Database = { users, authors, publishers, books, reviews };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch (e) {
        console.error("Failed to save to localStorage", e);
    }
}

export const loadData = () => {
    try {
        const savedDb = localStorage.getItem(DB_KEY);
        if (savedDb) {
            const db: Database = JSON.parse(savedDb);
            users = db.users;
            authors = db.authors;
            publishers = db.publishers;
            books = db.books;
            reviews = db.reviews;
            return true;
        }
    } catch (e) {
        console.error("Failed to load from localStorage", e);
    }
    return false;
}


export const initializeData = () => {
    // We consider the load successful only if it loads data AND that data contains books.
    if (loadData() && books.length > 0) {
        console.log("Mock data loaded from localStorage");
        return;
    }

    // Reset data
    users = [];
    authors = [];
    publishers = [];
    books = [];
    reviews = [];

    // Authors
    const author1: Author = { id: 'author-1', name: 'Джоан Роулинг' };
    const author2: Author = { id: 'author-2', name: 'Джордж Р. Р. Мартин' };
    const author3: Author = { id: 'author-3', name: 'Дж. Р. Р. Толкин' };
    const author4: Author = { id: 'author-4', name: 'Фрэнк Герберт' };
    const author5: Author = { id: 'author-5', name: 'Энди Вейер' };

    authors.push(author1, author2, author3, author4, author5);

    // Publishers
    const publisher1: Publisher = { id: 'pub-1', name: 'Росмэн' };
    const publisher2: Publisher = { id: 'pub-2', name: 'АСТ' };
    const publisher3: Publisher = { id: 'pub-3', name: 'Эксмо' };
    
    publishers.push(publisher1, publisher2, publisher3);
    
    // Books
    const book1: Book = {
        id: 'book-1',
        title: 'Гарри Поттер и философский камень',
        authorId: author1.id,
        publisherId: publisher1.id,
        publicationYear: 1997,
        genres: [Genre.Fantasy],
        coverUrl: 'https://cv4.litres.ru/pub/c/pdf-kniga/cover_415/18898145-dzhoan-rouling-garri-potter-i-filosofskiy-kamen-18898145.jpg',
        summary: 'Жизнь десятилетнего Гарри Поттера нельзя назвать сладкой: родители умерли, едва ему исполнился год, а от дяди и тёти, взявших сироту на воспитание, достаются лишь тычки да подзатыльники.',
        contentUrl: '',
        format: 'EPUB'
    };
     const book2: Book = {
        id: 'book-2',
        title: 'Игра престолов',
        authorId: author2.id,
        publisherId: publisher2.id,
        publicationYear: 1996,
        genres: [Genre.Fantasy],
        coverUrl: 'https://www.moscowbooks.ru/image/book/645/big/645605.jpg',
        summary: 'Это суровые земли вечного холода и радостные земли вечного лета. Это сказание о лордах и героях, воинах и магах, убийцах и чернокнижниках.',
        contentUrl: '',
        format: 'PDF'
    };
    const book3: Book = {
        id: 'book-3',
        title: 'Властелин колец: Братство Кольца',
        authorId: author3.id,
        publisherId: publisher2.id,
        publicationYear: 1954,
        genres: [Genre.Fantasy],
        coverUrl: 'https://s1.livelib.ru/boocover/1000326233/o/5953/Dzh.R.R._Tolkin__Vlastelin_Kolets_Trilogiya.jpeg',
        summary: 'История о великом походе отважных хоббитов и их союзников, о Кольце Всевластья, которое несет гибель всему живому.',
        contentUrl: '',
        format: 'FB2'
    };
    const book4: Book = {
        id: 'book-4',
        title: 'Дюна',
        authorId: author4.id,
        publisherId: publisher2.id,
        publicationYear: 1965,
        genres: [Genre.SciFi],
        coverUrl: 'https://cv9.litres.ru/pub/c/elektronnaya-kniga/cover_415/1989999-frenk-gerbert-duna.jpg',
        summary: 'Пауль Атрейдес, молодой наследник знатного рода, отправляется на пустынную планету Арракис, единственный источник самого ценного вещества во вселенной.',
        contentUrl: '',
        format: 'EPUB'
    };
    const book5: Book = {
        id: 'book-5',
        title: 'Проект «Аве Мария»',
        authorId: author5.id,
        publisherId: publisher2.id,
        publicationYear: 2021,
        genres: [Genre.SciFi],
        coverUrl: 'https://cv0.litres.ru/pub/c/elektronnaya-kniga/cover_415/66191008-endi-veyer-proekt-ave-mariya.jpg',
        summary: 'Астронавт с амнезией просыпается на одиночной миссии по спасению Земли.',
        contentUrl: '',
        format: 'EPUB'
    };
     const book6: Book = {
        id: 'book-6',
        title: 'Загадка старого поместья',
        authorId: author1.id, 
        publisherId: publisher3.id,
        publicationYear: 2023,
        genres: [Genre.Mystery, Genre.Thriller],
        coverUrl: '', // Explicitly empty to test default
        summary: 'Группа друзей решает провести выходные в заброшенном поместье, но вскоре понимает, что они там не одни.',
        contentUrl: '',
        format: 'PDF'
    };
    books.push(book1, book2, book3, book4, book5, book6);

    // Users
    const user1: User = { 
        id: 'user-1', 
        username: 'testuser', 
        readingHistory: [book1.id, book4.id], 
        wantToRead: [book2.id],
        friends: []
    };
    const adminUser: AdminUser = { id: 'admin-1', username: 'sheri', role: 'admin' };
    users.push(user1, adminUser);

    // Reviews
    const review1: Review = {
        id: 'review-1',
        bookId: book1.id,
        userId: user1.id,
        rating: 5,
        text: 'Волшебная книга! Погружаешься в мир магии с головой.',
        createdAt: new Date(Date.now() - 86400000).toISOString()
    };
    reviews.push(review1);
    
    saveData();
    console.log("Mock data initialized and saved");
};

// Helper function to provide a default cover if one is missing
const withDefaultCover = (book: Book): Book => ({
    ...book,
    coverUrl: book.coverUrl || DEFAULT_COVER_URL
});

const withDefaultCovers = (bookList: Book[]): Book[] => bookList.map(withDefaultCover);


// Standalone functions to be used by the mock server
export const db = {
    getUsers: () => users,
    getBooks: () => books,
    getAuthors: () => authors,
    getPublishers: () => publishers,
    getReviews: () => reviews,
    setBooks: (newBooks: Book[]) => { books = newBooks },
};
