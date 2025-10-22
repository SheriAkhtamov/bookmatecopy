import React, { useState, useEffect } from 'react';
import { Book, Author, Publisher, Genre } from '../../types';
import { XIcon } from '../icons';
import Spinner from '../ui/Spinner';

interface BookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (book: Omit<Book, 'id'> | Book) => Promise<boolean>;
  initialData?: Book | null;
  authors: Author[];
  publishers: Publisher[];
}

const emptyBook: Omit<Book, 'id'> = {
  title: '',
  authorId: '',
  publisherId: '',
  publicationYear: new Date().getFullYear(),
  genres: [],
  coverUrl: '',
  summary: '',
  contentUrl: '',
  format: 'EPUB',
};

const BookForm: React.FC<BookFormProps> = ({ isOpen, onClose, onSave, initialData, authors, publishers }) => {
  const [formData, setFormData] = useState(initialData || emptyBook);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(initialData || emptyBook);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'publicationYear' ? parseInt(value, 10) : value }));
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value as Genre);
    setFormData(prev => ({ ...prev, genres: selectedOptions }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.authorId || !formData.publisherId) {
        setError('Название, автор и издатель обязательны.');
        return;
    }
    setLoading(true);
    setError('');
    const success = await onSave(formData);
    setLoading(false);
    if (!success) {
        setError('Не удалось сохранить книгу. Попробуйте снова.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" onClick={onClose}>
      <div className="bg-card rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-card">
          <h2 className="text-2xl font-bold">{initialData ? 'Редактировать книгу' : 'Добавить книгу'}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-muted">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">Название</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md bg-background"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="authorId" className="block text-sm font-medium">Автор</label>
              <select name="authorId" value={formData.authorId} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md bg-background">
                <option value="" disabled>Выберите автора</option>
                {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="publisherId" className="block text-sm font-medium">Издатель</label>
               <select name="publisherId" value={formData.publisherId} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md bg-background">
                <option value="" disabled>Выберите издателя</option>
                {publishers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="publicationYear" className="block text-sm font-medium">Год публикации</label>
                    <input type="number" name="publicationYear" value={formData.publicationYear} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md bg-background"/>
                </div>
                <div>
                     <label htmlFor="format" className="block text-sm font-medium">Формат</label>
                     <select name="format" value={formData.format} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md bg-background">
                        <option value="EPUB">EPUB</option>
                        <option value="PDF">PDF</option>
                        <option value="FB2">FB2</option>
                    </select>
                </div>
           </div>
            <div>
                <label htmlFor="genres" className="block text-sm font-medium">Жанры</label>
                 <select name="genres" multiple value={formData.genres} onChange={handleGenreChange} className="mt-1 w-full p-2 border rounded-md bg-background h-32">
                    {Object.values(Genre).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="coverUrl" className="block text-sm font-medium">URL обложки</label>
                <input type="text" name="coverUrl" value={formData.coverUrl} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md bg-background"/>
            </div>
            <div>
                <label htmlFor="summary" className="block text-sm font-medium">Описание</label>
                <textarea name="summary" value={formData.summary} onChange={handleChange} rows={4} className="mt-1 w-full p-2 border rounded-md bg-background"></textarea>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            
            <div className="pt-4 flex justify-end gap-3 sticky bottom-0 bg-card p-6 border-t">
                <button type="button" onClick={onClose} className="px-4 py-2 border rounded-md hover:bg-muted">Отмена</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center">
                    {loading && <Spinner />}
                    {loading ? 'Сохранение...' : 'Сохранить'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
