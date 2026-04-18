import React, { useState } from 'react';
import { Users, Plus, Pencil, Trash2, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { hashPassword } from '../storage/localStorage';
import type { AppUser, UserRole } from '../types';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'dispatcher', label: 'Despachador' },
  { value: 'operator', label: 'Operario' },
];

function roleColor(r: UserRole): 'purple' | 'blue' | 'green' {
  return { admin: 'purple', dispatcher: 'blue', operator: 'green' }[r] as 'purple' | 'blue' | 'green';
}
function roleLabel(r: UserRole) {
  return { admin: 'Administrador', dispatcher: 'Despachador', operator: 'Operario' }[r];
}

function UserForm({ initial, onSave, onCancel }: {
  initial?: Partial<AppUser>;
  onSave: (data: Omit<AppUser, 'id' | 'createdAt' | 'passwordHash'> & { password: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [role, setRole] = useState<UserRole>(initial?.role ?? 'operator');
  const [password, setPassword] = useState('');
  const isEditing = !!initial?.id;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEditing && !password) return;
    onSave({ name, email, role, active: true, password: password || '' });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre" value={name} onChange={e => setName(e.target.value)} required />
      <Input label="Correo electrónico" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <Select label="Rol" options={ROLE_OPTIONS} value={role} onChange={e => setRole(e.target.value as UserRole)} />
      <Input
        label={isEditing ? 'Nueva contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required={!isEditing}
        placeholder={isEditing ? 'Sin cambios' : 'Mínimo 6 caracteres'}
        minLength={isEditing ? 0 : 6}
      />
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">Guardar</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}

export function UsersPage() {
  const { users, saveUser, deleteUser } = useAppContext();
  const { session } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AppUser | null>(null);

  function openNew() { setEditing(null); setModalOpen(true); }
  function openEdit(u: AppUser) { setEditing(u); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }

  async function handleSave(data: Omit<AppUser, 'id' | 'createdAt' | 'passwordHash'> & { password: string }) {
    const passwordHash = data.password
      ? await hashPassword(data.password)
      : (editing?.passwordHash ?? '');

    saveUser({
      id: editing?.id ?? `u${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      active: data.active,
      passwordHash,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    });
    closeModal();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{users.length} usuarios registrados</p>
        <Button onClick={openNew} size="sm"><Plus size={14} /> Añadir usuario</Button>
      </div>

      {users.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Users size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500">No hay usuarios</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left p-4 text-xs text-zinc-500 font-medium">Nombre</th>
                <th className="text-left p-4 text-xs text-zinc-500 font-medium">Email</th>
                <th className="text-left p-4 text-xs text-zinc-500 font-medium">Rol</th>
                <th className="text-left p-4 text-xs text-zinc-500 font-medium">Estado</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-zinc-800/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                        {user.name[0]?.toUpperCase()}
                      </div>
                      <span className="text-zinc-200">{user.name}</span>
                      {user.id === session?.userId && (
                        <span className="text-[10px] text-emerald-400">(tú)</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-zinc-400">{user.email}</td>
                  <td className="p-4">
                    <Badge color={roleColor(user.role)}>
                      <ShieldCheck size={10} className="mr-1" />
                      {roleLabel(user.role)}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge color={user.active ? 'green' : 'red'}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => openEdit(user)} className="p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 rounded-lg transition-colors">
                        <Pencil size={13} />
                      </button>
                      {user.id !== session?.userId && (
                        <button onClick={() => deleteUser(user.id)} className="p-1.5 text-red-600 hover:text-red-400 hover:bg-zinc-700 rounded-lg transition-colors">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Editar usuario' : 'Añadir usuario'}>
        <UserForm initial={editing ?? undefined} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </div>
  );
}
