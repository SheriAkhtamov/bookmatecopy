
import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/books" className="p-6 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-xl">Управление книгами</h2>
          <p className="text-muted-foreground mt-2">Добавляйте, редактируйте и удаляйте книги.</p>
        </Link>
        <Link to="/admin/authors" className="p-6 bg-card rounded-lg shadow hover:shadow-md transition-shadow">
          <h2 className="font-semibold text-xl">Управление авторами</h2>
          <p className="text-muted-foreground mt-2">Просматривайте и управляйте списком авторов.</p>
        </Link>
        <div className="p-6 bg-card rounded-lg shadow">
          <h2 className="font-semibold text-xl">Статистика</h2>
          <p className="text-muted-foreground mt-2">Раздел в разработке.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
