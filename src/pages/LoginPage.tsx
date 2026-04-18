import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const { login, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (session) {
    navigate(from, { replace: true });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? 'Error al iniciar sesión');
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-900/50 border border-emerald-700 mb-4">
            <Truck size={28} className="text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">FlotaAgua</h1>
          <p className="text-sm text-zinc-500 mt-1">Gestión de carga de camiones</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <Input
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="admin@flota.com"
            required
            autoFocus
          />
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" loading={loading}>
            Iniciar sesión
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-600 mt-4">
          admin@flota.com · admin123
        </p>
      </div>
    </div>
  );
}
