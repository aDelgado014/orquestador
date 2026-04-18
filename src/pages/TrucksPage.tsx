import React, { useState } from 'react';
import { Truck, Plus, Pencil, Trash2, Weight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import type { Truck as TruckType } from '../types';

const TRUCK_PRESETS = [
  { label: 'Semirremolque (13.6m)', typeName: 'Semirremolque', floorLengthCm: 1360, floorWidthCm: 240, maxWeightKg: 24000 },
  { label: 'Camión rígido (7.5m)', typeName: 'Camión rígido', floorLengthCm: 750, floorWidthCm: 240, maxWeightKg: 12000 },
  { label: 'Furgón grande (4.5m)', typeName: 'Furgón grande', floorLengthCm: 450, floorWidthCm: 210, maxWeightKg: 3500 },
  { label: 'Personalizado', typeName: 'Personalizado', floorLengthCm: 0, floorWidthCm: 0, maxWeightKg: 0 },
];

const STATUS_OPTIONS = [
  { value: 'available', label: 'Disponible' },
  { value: 'loading', label: 'En carga' },
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'maintenance', label: 'Mantenimiento' },
];

function statusColor(s: string) {
  return { available: 'green', loading: 'blue', in_transit: 'yellow', maintenance: 'red' }[s] as 'green' | 'blue' | 'yellow' | 'red';
}
function statusLabel(s: string) {
  return { available: 'Disponible', loading: 'En carga', in_transit: 'En tránsito', maintenance: 'Mantenimiento' }[s] ?? s;
}

function TruckForm({ initial, onSave, onCancel }: {
  initial?: Partial<TruckType>;
  onSave: (data: Omit<TruckType, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [plate, setPlate] = useState(initial?.plate ?? '');
  const [model, setModel] = useState(initial?.model ?? '');
  const [presetIdx, setPresetIdx] = useState(0);
  const [floorLengthCm, setFloorLengthCm] = useState(initial?.floorLengthCm?.toString() ?? '1360');
  const [floorWidthCm, setFloorWidthCm] = useState(initial?.floorWidthCm?.toString() ?? '240');
  const [maxWeightKg, setMaxWeightKg] = useState(initial?.maxWeightKg?.toString() ?? '24000');
  const [typeName, setTypeName] = useState(initial?.typeName ?? 'Semirremolque');
  const [status, setStatus] = useState<TruckType['status']>(initial?.status ?? 'available');

  function applyPreset(idx: number) {
    setPresetIdx(idx);
    const p = TRUCK_PRESETS[idx];
    setTypeName(p.typeName);
    if (p.floorLengthCm > 0) {
      setFloorLengthCm(p.floorLengthCm.toString());
      setFloorWidthCm(p.floorWidthCm.toString());
      setMaxWeightKg(p.maxWeightKg.toString());
    }
  }

  const cols = Math.floor(Number(floorLengthCm) / 80);
  const rows = Math.floor(Number(floorWidthCm) / 120);
  const capacity = cols * rows;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      plate: plate.toUpperCase(),
      model,
      typeName,
      floorLengthCm: Number(floorLengthCm),
      floorWidthCm: Number(floorWidthCm),
      maxWeightKg: Number(maxWeightKg),
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Matrícula" value={plate} onChange={e => setPlate(e.target.value)} placeholder="1234-ABC" required />
        <Input label="Modelo" value={model} onChange={e => setModel(e.target.value)} placeholder="Volvo FH" required />
      </div>

      <Select
        label="Tipo de camión (preset)"
        value={presetIdx.toString()}
        onChange={e => applyPreset(Number(e.target.value))}
        options={TRUCK_PRESETS.map((p, i) => ({ value: i.toString(), label: p.label }))}
      />

      <div className="grid grid-cols-3 gap-3">
        <Input label="Largo cajón (cm)" type="number" value={floorLengthCm} onChange={e => setFloorLengthCm(e.target.value)} required min="100" />
        <Input label="Ancho cajón (cm)" type="number" value={floorWidthCm} onChange={e => setFloorWidthCm(e.target.value)} required min="100" />
        <Input label="Peso máx. (kg)" type="number" value={maxWeightKg} onChange={e => setMaxWeightKg(e.target.value)} required min="1000" />
      </div>

      {capacity > 0 && (
        <div className="bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 flex gap-4">
          <span>Capacidad estimada: <strong className="text-emerald-400">{capacity} palets</strong> ({cols} col × {rows} fil)</span>
          <span>Carga máx: <strong className="text-emerald-400">{(Number(maxWeightKg) / 1000).toFixed(1)}t</strong></span>
        </div>
      )}

      <Select
        label="Estado inicial"
        value={status}
        onChange={e => setStatus(e.target.value as TruckType['status'])}
        options={STATUS_OPTIONS}
      />

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">Guardar</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}

export function TrucksPage() {
  const { trucks, saveTruck, deleteTruck } = useAppContext();
  const { hasRole } = useAuth();
  const isAdmin = hasRole(['admin']);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TruckType | null>(null);

  function openNew() { setEditing(null); setModalOpen(true); }
  function openEdit(t: TruckType) { setEditing(t); setModalOpen(true); }
  function closeModal() { setModalOpen(false); setEditing(null); }

  function handleSave(data: Omit<TruckType, 'id' | 'createdAt'>) {
    saveTruck({
      ...data,
      id: editing?.id ?? `t${Date.now()}`,
      createdAt: editing?.createdAt ?? new Date().toISOString(),
    });
    closeModal();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-zinc-500">{trucks.length} camiones registrados</p>
        </div>
        {isAdmin && (
          <Button onClick={openNew} size="sm">
            <Plus size={14} /> Añadir camión
          </Button>
        )}
      </div>

      {trucks.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Truck size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500">No hay camiones registrados</p>
          {isAdmin && <Button className="mt-4" size="sm" onClick={openNew}><Plus size={14} /> Añadir primer camión</Button>}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trucks.map(truck => {
            const cols = Math.floor(truck.floorLengthCm / 80);
            const rows = Math.floor(truck.floorWidthCm / 120);
            const capacity = cols * rows;
            return (
              <div key={truck.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Truck size={18} className="text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-zinc-100">{truck.plate}</p>
                      <p className="text-xs text-zinc-500">{truck.model} · {truck.typeName}</p>
                    </div>
                  </div>
                  <Badge color={statusColor(truck.status)}>{statusLabel(truck.status)}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <p className="text-[10px] text-zinc-500">Largo</p>
                    <p className="text-sm font-bold text-zinc-200">{(truck.floorLengthCm / 100).toFixed(1)}m</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <p className="text-[10px] text-zinc-500">Ancho</p>
                    <p className="text-sm font-bold text-zinc-200">{(truck.floorWidthCm / 100).toFixed(1)}m</p>
                  </div>
                  <div className="bg-zinc-800 rounded-lg p-2">
                    <p className="text-[10px] text-zinc-500">Palets</p>
                    <p className="text-sm font-bold text-emerald-400">{capacity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <Weight size={12} />
                  Carga máx: {(truck.maxWeightKg / 1000).toFixed(0)} t
                </div>

                {isAdmin && (
                  <div className="flex gap-2 pt-1 border-t border-zinc-800">
                    <button onClick={() => openEdit(truck)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors">
                      <Pencil size={12} /> Editar
                    </button>
                    <button onClick={() => deleteTruck(truck.id)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors">
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal} title={editing ? 'Editar camión' : 'Añadir camión'} size="lg">
        <TruckForm
          initial={editing ?? undefined}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
