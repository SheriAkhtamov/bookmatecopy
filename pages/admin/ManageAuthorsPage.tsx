
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from '../../components/icons';

const ManageAuthorsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
       <Link to="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft className="w-4 h-4" />
        Назад в панель
      </Link>
      <h1 className="text-3xl font-bold mb-6">Управление авторами</h1>
       <div className="bg-card p-8 rounded-lg shadow">
        <p className="text-muted-foreground">Эта страница находится в разработке.</p>
        <p>Здесь будет интерфейс для управления авторами.</p>
      </div>
    </div>
  );
};

export default ManageAuthorsPage;
