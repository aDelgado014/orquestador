import React, { useState } from 'react';
import { BoxesIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import type { PalletType } from '../types';

function PalletForm({ initial, onSave, onCancel }: {
  initial?: Partial<PalletType>;
  onSave: (data: Omit<PalletType, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [product, setProduct] = useState(initial?.product ?? '');
  const [widthCm, setWidthCm] = useState(initial?.widthCm?.toString() ?? '80');
  const [depthCm, setDepthCm] = useState(initial?.depthCm?.toString() ?? '120');
  const [heightCm, setHeightCm] = useState(initial?.heightCm?.toString() ?? '145');
  const [weightKg, setWeightKg] = useState(initial?.weightKg?.toString() ?? '1080');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      name, product,
      widthCm: Number(widthCm),
      depthCm: Number(depthCm),
      heightCm: Number(heightCm),
      weightKg: Number(weightKg),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nombre del tipo" value={name} onChange={e => setName(e.target.value)} placeholder="Europalet Agua 1.5L" required />
      <Input label="Descripción del producto" value={product} onChange={e => setProduct(e.target.value)} placeholder="Agua 1.5L (6x8 pack)" required />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Ancho (cm)" type="number" value={widthCm} onChange={e => setWidthCm(e.target.value)} min="40" required />
        <Input label="Largo (cm)" type="number" value={depthCm} onChange={e => setDepthCm(e.target.value)} min="40" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Alto (cm)" type="number" value={heightCm} onChange={e => setHeightCm(e.target.value)} min="10" required />
        <Input label="Peso lleno (kg)" type="number" value={weightKg} onChange={e => setWeightKg(e.target.value)} min="50" required />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">Guardar</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}

export function PalletTypesPage() {
  const { palletTypes, savePalletType, deletePalletType } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PalletType | null>(null);

  function openNew() { setEditing(null); setModalOpen(true); }
  function openEdit(p: PalletType) { setEditing(p); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }

  function handleSave(data: Omit<PalletType, 'id' | 'createdAt'>) {
    savePalletType({
      ...data,
      id: editing?.id ?? `pt${Date.now()}`,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    });
    closeModal();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">{palletTypes.length} tipos configurados</p>
        <Button onClick={openNew} size="sm"><Plus size={14} /> Añadir tipo</Button>
      </div>

      {palletTypes.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <BoxesIcon size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500">No hay tipos de palet configurados</p>
          <Button className="mt-4" size="sm" onClick={openNew}><Plus size={14} /> Añadir primer tipo</Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {palletTypes.map(pt => (
            <div key={pt.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-zinc-100">{pt.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{pt.product}</p>
                </div>
                <BoxesIcon size={18} className="text-blue-400 shrink-0" />
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { label: 'Ancho', value: `${pt.widthCm}cm` },
                  { label: 'Largo', value: `${pt.depthCm}cm` },
                  { label: 'Alto', value: `${pt.heightCm}cm` },
                  { label: 'Peso', value: `${pt.weightKg}kg` },
                ].map(f => (
                  <div key={f.label} className="bg-zinc-800 rounded-lg p-2">
                    <p className="text-[10px] text-zinc-500">{f.label}</p>
                    <p className="text-xs font-bold text-zinc-200">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1 border-t border-zinc-800">
                <button onClick={() => openEdit(pt)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors">
                  <Pencil size={12} /> Editar
                </button>
                <button onClick={() => deletePalletType(pt.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors">
                  <Trash2 size={12} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Editar tipo de palet' : 'Añadir tipo de palet'}>
        <PalletForm initial={editing ?? undefined} onSave={handleSave} onCancel={closeModal} />
      </Modal>
    </div>
  );
}
