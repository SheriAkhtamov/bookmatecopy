
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { BookOpenIcon, LogOutIcon, MoonIcon, SunIcon, UserIcon } from '../icons';
import SmartSearch from '../SmartSearch';

const Header: React.FC = () => {
    const { user, logout } = useAuth();
    const [theme, toggleTheme] = useTheme();

    return (
        <header className="bg-card shadow-sm sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2 text-primary">
                            <BookOpenIcon className="w-6 h-6" />
                            <span className="font-bold text-lg">Bookish</span>
                        </Link>
                        <nav className="hidden md:flex items-center space-x-4">
                            <NavLink to="/" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                                Главная
                            </NavLink>
                             <NavLink to="/catalog" className={({isActive}) => `text-sm font-medium ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                                Каталог
                            </NavLink>
                        </nav>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                       <div className="hidden md:block">
                         <SmartSearch />
                       </div>
                        
                        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-muted">
                            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                        </button>

                        {user ? (
                             <div className="relative group">
                                <Link to="/profile" className="p-2 rounded-full hover:bg-muted flex items-center">
                                    <UserIcon className="w-5 h-5" />
                                </Link>
                                <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b">
                                            <p className="text-sm font-semibold truncate">{user.username}</p>
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-muted">Профиль</Link>
                                        { 'role' in user && user.role === 'admin' && (
                                            <Link to="/admin" className="block px-4 py-2 text-sm hover:bg-muted">Админ панель</Link>
                                        )}
                                        <button onClick={logout} className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-muted">
                                            <LogOutIcon className="w-4 h-4 mr-2"/>
                                            Выйти
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                                Войти
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
