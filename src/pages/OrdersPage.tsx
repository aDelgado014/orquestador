import React, { useState } from 'react';
import { Package, Plus, Trash2, ChevronDown, ChevronUp, Zap, AlertCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { autoAssignOrders } from '../utils/truckAssignment';
import { findNextFreePosition, getGridDimensions } from '../utils/loadingGrid';
import type { Order, OrderLine, PlacedPallet } from '../types';

const ORDER_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente' },
  { value: 'assigned', label: 'Asignado' },
  { value: 'loading', label: 'En carga' },
  { value: 'loaded', label: 'Cargado' },
  { value: 'in_transit', label: 'En tránsito' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
];

function statusBadgeColor(s: string): 'yellow' | 'blue' | 'green' | 'purple' | 'red' | 'zinc' {
  const map: Record<string, 'yellow' | 'blue' | 'green' | 'purple' | 'red' | 'zinc'> = {
    pending: 'yellow', assigned: 'blue', loading: 'blue',
    loaded: 'green', in_transit: 'purple', delivered: 'green', cancelled: 'red',
  };
  return map[s] ?? 'zinc';
}
function statusLabel(s: string) {
  return { pending: 'Pendiente', assigned: 'Asignado', loading: 'En carga', loaded: 'Cargado', in_transit: 'En tránsito', delivered: 'Entregado', cancelled: 'Cancelado' }[s] ?? s;
}

function OrderForm({ onSave, onCancel, userId }: {
  onSave: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  userId: string;
}) {
  const { palletTypes } = useAppContext();
  const [clientName, setClientName] = useState('');
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<{ palletTypeId: string; quantity: number }[]>([
    { palletTypeId: palletTypes[0]?.id ?? '', quantity: 1 }
  ]);

  function addLine() {
    setLines([...lines, { palletTypeId: palletTypes[0]?.id ?? '', quantity: 1 }]);
  }
  function removeLine(i: number) {
    setLines(lines.filter((_, idx) => idx !== i));
  }
  function updateLine(i: number, field: 'palletTypeId' | 'quantity', val: string) {
    setLines(lines.map((l, idx) => idx === i ? { ...l, [field]: field === 'quantity' ? Number(val) : val } : l));
  }

  const orderLines: OrderLine[] = lines.map((l, i) => {
    const pt = palletTypes.find(p => p.id === l.palletTypeId);
    return {
      id: `ol${i}`,
      palletTypeId: l.palletTypeId,
      palletTypeName: pt?.name ?? '',
      quantity: l.quantity,
      weightPerPallet: pt?.weightKg ?? 0,
    };
  });
  const totalPallets = orderLines.reduce((acc, l) => acc + l.quantity, 0);
  const totalWeightKg = orderLines.reduce((acc, l) => acc + l.quantity * l.weightPerPallet, 0);
  const orderCount = useAppContext().orders.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      orderNumber: `ORD-${new Date().getFullYear()}-${String(orderCount + 1).padStart(4, '0')}`,
      clientName, destination, lines: orderLines,
      totalPallets, totalWeightKg,
      status: 'pending',
      createdByUserId: userId,
      notes: notes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Cliente" value={clientName} onChange={e => setClientName(e.target.value)} required />
        <Input label="Destino" value={destination} onChange={e => setDestination(e.target.value)} required />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-zinc-400">Líneas de pedido</label>
          <button type="button" onClick={addLine} className="text-xs text-emerald-400 hover:text-emerald-300">+ Añadir línea</button>
        </div>
        <div className="space-y-2">
          {lines.map((line, i) => (
            <div key={i} className="flex gap-2 items-end">
              <Select
                options={palletTypes.map(p => ({ value: p.id, label: p.name }))}
                value={line.palletTypeId}
                onChange={e => updateLine(i, 'palletTypeId', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                value={line.quantity.toString()}
                onChange={e => updateLine(i, 'quantity', e.target.value)}
                min="1"
                className="w-20"
              />
              {lines.length > 1 && (
                <button type="button" onClick={() => removeLine(i)} className="text-red-500 hover:text-red-400 pb-2">×</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 flex gap-4">
        <span>Total: <strong className="text-emerald-400">{totalPallets} palets</strong></span>
        <span>Peso: <strong className="text-emerald-400">{totalWeightKg.toLocaleString()} kg</strong></span>
      </div>

      <Input label="Notas (opcional)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instrucciones especiales..." />

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">Crear pedido</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}

export function OrdersPage() {
  const { orders, palletTypes, trucks, loadingStates, saveOrder, deleteOrder, updateOrderStatus, saveLoadingState, getLoadingState } = useAppContext();
  const { session, hasRole } = useAuth();
  const canWrite = hasRole(['admin', 'dispatcher']);

  const [modalOpen, setModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [assignResults, setAssignResults] = useState<{ id: string; msg: string; ok: boolean }[]>([]);

  function handleSaveOrder(data: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    saveOrder({ ...data, id: `o${Date.now()}`, createdAt: now, updatedAt: now });
    setModalOpen(false);
  }

  async function handleAutoAssign() {
    setAssigning(true);
    const pending = orders.filter(o => o.status === 'pending');
    const results = autoAssignOrders(pending, trucks, palletTypes, loadingStates);

    const msgs: { id: string; msg: string; ok: boolean }[] = [];
    for (const r of results) {
      const order = orders.find(o => o.id === r.orderId)!;
      if (r.truckId) {
        const truck = trucks.find(t => t.id === r.truckId)!;
        updateOrderStatus(r.orderId, 'assigned', r.truckId);

        // Place pallets in the truck's loading state
        const grid = getGridDimensions(truck);
        const state = getLoadingState(r.truckId);
        const pallets = [...state.pallets];

        for (const line of order.lines) {
          const pt = palletTypes.find(p => p.id === line.palletTypeId);
          for (let i = 0; i < line.quantity; i++) {
            const pos = findNextFreePosition(pallets, grid.cols, grid.rows);
            if (pos) {
              pallets.push({
                id: `pp${Date.now()}-${Math.random().toString(36).slice(2)}`,
                orderId: order.id,
                orderNumber: order.orderNumber,
                palletTypeId: line.palletTypeId,
                position: pos,
                status: 'placed',
                weightKg: pt?.weightKg ?? 0,
              });
            }
          }
        }

        saveLoadingState({ truckId: r.truckId, pallets });
        msgs.push({ id: r.orderId, msg: `${order.orderNumber} → ${truck.plate}`, ok: true });
      } else {
        msgs.push({ id: r.orderId, msg: `${order.orderNumber}: ${r.reason}`, ok: false });
      }
    }

    setAssignResults(msgs);
    setAssigning(false);
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-zinc-500">{orders.length} pedidos · {pendingCount} pendientes</p>
        <div className="flex gap-2">
          {canWrite && pendingCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleAutoAssign} loading={assigning}>
              <Zap size={14} /> Asignar automáticamente ({pendingCount})
            </Button>
          )}
          {canWrite && (
            <Button size="sm" onClick={() => setModalOpen(true)}>
              <Plus size={14} /> Nuevo pedido
            </Button>
          )}
        </div>
      </div>

      {assignResults.length > 0 && (
        <div className="space-y-1">
          {assignResults.map((r, i) => (
            <div key={i} className={`text-xs px-3 py-2 rounded-lg flex items-center gap-2 ${r.ok ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'}`}>
              {r.ok ? '✓' : <AlertCircle size={12} />} {r.msg}
            </div>
          ))}
          <button className="text-xs text-zinc-500 hover:text-zinc-400" onClick={() => setAssignResults([])}>Cerrar</button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <Package size={32} className="mx-auto text-zinc-700 mb-3" />
          <p className="text-zinc-500">No hay pedidos registrados</p>
          {canWrite && <Button className="mt-4" size="sm" onClick={() => setModalOpen(true)}><Plus size={14} /> Crear primer pedido</Button>}
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order, idx) => {
            const color = ORDER_COLORS[idx % ORDER_COLORS.length];
            const truck = trucks.find(t => t.id === order.assignedTruckId);
            const isExpanded = expandedId === order.id;

            return (
              <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                >
                  <div className="w-2 h-8 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-zinc-100">{order.orderNumber}</span>
                      <span className="text-sm text-zinc-400">{order.clientName}</span>
                      <Badge color={statusBadgeColor(order.status)}>{statusLabel(order.status)}</Badge>
                      {truck && <span className="text-xs text-zinc-500">→ {truck.plate}</span>}
                    </div>
                    <div className="text-xs text-zinc-500 mt-0.5">
                      {order.destination} · {order.totalPallets} palets · {order.totalWeightKg.toLocaleString()} kg
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-zinc-500 shrink-0" /> : <ChevronDown size={16} className="text-zinc-500 shrink-0" />}
                </div>

                {isExpanded && (
                  <div className="border-t border-zinc-800 p-4 space-y-3">
                    <div className="grid gap-1">
                      {order.lines.map(line => (
                        <div key={line.id} className="flex items-center justify-between text-sm">
                          <span className="text-zinc-400">{line.palletTypeName}</span>
                          <span className="text-zinc-300">{line.quantity} palets · {(line.quantity * line.weightPerPallet).toLocaleString()} kg</span>
                        </div>
                      ))}
                    </div>
                    {order.notes && <p className="text-xs text-zinc-500 italic">{order.notes}</p>}
                    {canWrite && (
                      <div className="flex gap-2 pt-1">
                        <Select
                          options={STATUS_OPTIONS}
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as Order['status'])}
                          className="flex-1 text-xs"
                        />
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Trash2 size={12} /> Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nuevo pedido" size="lg">
        <OrderForm
          userId={session?.userId ?? ''}
          onSave={handleSaveOrder}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
