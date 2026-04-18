import React from 'react';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur flex items-center justify-between px-6 shrink-0">
      <h1 className="text-sm font-semibold text-zinc-100">{title}</h1>
      <div className="flex items-center gap-2">
        <button className="p-2 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-800">
          <Bell size={16} />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          Salir
        </button>
      </div>
    </header>
  );
}
