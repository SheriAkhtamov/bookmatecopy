
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpenIcon } from '../components/icons';

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Пароли не совпадают.');
            return;
        }
        setError('');
        setLoading(true);
        const success = await register(username, password);
        setLoading(false);
        if (success) {
            navigate('/');
        } else {
            setError('Пользователь с таким именем уже существует.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40">
            <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-md">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center space-x-2 text-primary mb-4">
                        <BookOpenIcon className="w-8 h-8" />
                        <span className="font-bold text-2xl">Bookish</span>
                    </Link>
                    <h2 className="text-2xl font-bold">Создание аккаунта</h2>
                     <p className="text-muted-foreground">Присоединяйтесь к нашему сообществу.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium">Имя пользователя</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium">Пароль</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword"className="block text-sm font-medium">Подтвердите пароль</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    {error && <p className="text-sm text-destructive">{error}</p>}
                    <div>
                        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                    </div>
                </form>
                 <p className="text-center text-sm text-muted-foreground">
                    Уже есть аккаунт?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Войти
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
