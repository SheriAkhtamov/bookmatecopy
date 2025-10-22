import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Book, Author, Publisher, Genre } from '../../types';
import * as api from '../../services/api';
import { ArrowLeft, PlusIcon } from '../../components/icons';
import Spinner from '../../components/ui/Spinner';
import BookForm from '../../components/admin/BookForm';

const ManageBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [booksData, authorsData, publishersData] = await Promise.all([
        api.fetchBooks(),
        api.fetchAuthors(),
        api.fetchPublishers(),
      ]);
      setBooks(booksData);
      setAuthors(authorsData);
      setPublishers(publishersData);
    } catch (err) {
      setError('Не удалось загрузить данные. Попробуйте обновить страницу.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleOpenModalForCreate = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleOpenModalForEdit = (book: Book) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSaveBook = async (bookData: Omit<Book, 'id'> | Book) => {
    try {
      if ('id' in bookData) {
        await api.updateBook(bookData.id, bookData);
      } else {
        await api.createBook(bookData);
      }
      await fetchAllData(); // Refresh data
      handleCloseModal();
      return true;
    } catch (err) {
      console.error('Failed to save book', err);
      return false;
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту книгу?')) {
      try {
        await api.deleteBook(id);
        await fetchAllData(); // Refresh data
      } catch (err) {
        console.error('Failed to delete book', err);
        setError('Не удалось удалить книгу.');
      }
    }
  };

  const getAuthorName = (authorId: string) => authors.find(a => a.id === authorId)?.name || 'Неизвестен';

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад в панель
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Управление книгами</h1>
        <button
          onClick={handleOpenModalForCreate}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          <PlusIcon className="w-5 h-5" />
          Добавить книгу
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8"><Spinner /></div>
      ) : error ? (
        <div className="text-center text-destructive mt-8">{error}</div>
      ) : (
        <div className="bg-card p-4 rounded-lg shadow overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4">Обложка</th>
                <th className="p-4">Название</th>
                <th className="p-4">Автор</th>
                <th className="p-4">Год</th>
                <th className="p-4">Действия</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b last:border-b-0 hover:bg-muted/50">
                  <td className="p-4"><img src={book.coverUrl} alt={book.title} className="w-12 h-16 object-cover rounded"/></td>
                  <td className="p-4 font-medium">{book.title}</td>
                  <td className="p-4 text-muted-foreground">{getAuthorName(book.authorId)}</td>
                  <td className="p-4 text-muted-foreground">{book.publicationYear}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button onClick={() => handleOpenModalForEdit(book)} className="text-primary hover:underline">Редакт.</button>
                      <button onClick={() => handleDeleteBook(book.id)} className="text-destructive hover:underline">Удалить</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <BookForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveBook}
          initialData={editingBook}
          authors={authors}
          publishers={publishers}
        />
      )}
    </div>
  );
};

export default ManageBooksPage;
