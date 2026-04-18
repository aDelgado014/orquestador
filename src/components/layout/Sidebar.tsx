import React from 'react';
import { NavLink } from 'react-router-dom';
import { Truck, Package, LayoutGrid, Users, BoxesIcon, Layers } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  roles: string[];
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} />, roles: ['admin', 'dispatcher', 'operator'] },
  { to: '/orders', label: 'Pedidos', icon: <Package size={18} />, roles: ['admin', 'dispatcher'] },
  { to: '/trucks', label: 'Flota', icon: <Truck size={18} />, roles: ['admin', 'dispatcher', 'operator'] },
  { to: '/loading', label: 'Carga', icon: <Layers size={18} />, roles: ['admin', 'dispatcher', 'operator'] },
  { to: '/pallets', label: 'Palets', icon: <BoxesIcon size={18} />, roles: ['admin'] },
  { to: '/users', label: 'Usuarios', icon: <Users size={18} />, roles: ['admin'] },
];

export function Sidebar() {
  const { session } = useAuth();
  const role = session?.role ?? '';

  const visible = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-56 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Truck size={22} className="text-emerald-400" />
          <span className="text-sm font-bold text-zinc-100">FlotaAgua</span>
        </div>
        <p className="text-[10px] text-zinc-500 mt-0.5">Gestión de carga</p>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {visible.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-emerald-900/50 text-emerald-300 font-medium'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100',
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-200">
            {session?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-200 truncate">{session?.name}</p>
            <p className="text-[10px] text-zinc-500 capitalize">{session?.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
