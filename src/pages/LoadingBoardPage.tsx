import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, ChevronLeft, GripVertical } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { LoadingBoard } from '../components/loading/LoadingBoard';
import { Select } from '../components/ui/Input';
import type { OrderLine } from '../types';

export function LoadingBoardPage() {
  const { truckId } = useParams<{ truckId?: string }>();
  const navigate = useNavigate();
  const { trucks, orders, palletTypes, getLoadingState, saveLoadingState } = useAppContext();
  const { hasRole } = useAuth();
  const canManage = hasRole(['admin', 'dispatcher', 'operator']);

  const [selectedTruckId, setSelectedTruckId] = useState(truckId ?? trucks[0]?.id ?? '');
  const [dragLine, setDragLine] = useState<{ line: OrderLine; orderId: string; orderNumber: string } | null>(null);

  const truck = trucks.find(t => t.id === selectedTruckId);
  const truckOrders = orders.filter(o => o.assignedTruckId === selectedTruckId);

  if (trucks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Layers size={40} className="text-zinc-700 mb-4" />
        <p className="text-zinc-500 text-sm">No hay camiones registrados.</p>
        <button onClick={() => navigate('/trucks')} className="mt-4 text-xs text-emerald-400 hover:underline">Ir a gestión de flota →</button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Truck selector */}
      <div className="flex items-center gap-3">
        <Select
          options={trucks.map(t => ({ value: t.id, label: `${t.plate} · ${t.model} (${t.typeName})` }))}
          value={selectedTruckId}
          onChange={e => setSelectedTruckId(e.target.value)}
          className="max-w-sm"
        />
        {truckOrders.length === 0 && (
          <p className="text-xs text-zinc-500">Sin pedidos asignados. Asigna pedidos en la sección <button onClick={() => navigate('/orders')} className="text-emerald-400 hover:underline">Pedidos</button></p>
        )}
      </div>

      {truck && (
        <div className="flex gap-5 items-start">
          {/* Loading board */}
          <div className="flex-1 min-w-0">
            <LoadingBoard truck={truck} />
          </div>

          {/* Side panel: draggable pallets from assigned orders */}
          {canManage && truckOrders.length > 0 && (
            <div className="w-56 shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-3">Palets para cargar</p>
              <div className="space-y-3">
                {truckOrders.map(order => {
                  const state = getLoadingState(truck.id);
                  return (
                    <div key={order.id}>
                      <p className="text-xs font-medium text-zinc-400 mb-1">{order.orderNumber} · {order.clientName}</p>
                      {order.lines.map(line => {
                        const pt = palletTypes.find(p => p.id === line.palletTypeId);
                        const placedCount = state.pallets.filter(p => p.orderId === order.id && p.palletTypeId === line.palletTypeId).length;
                        const remaining = line.quantity - placedCount;
                        if (remaining <= 0) return null;
                        return (
                          <div
                            key={line.id}
                            draggable
                            onDragStart={e => {
                              e.dataTransfer.setData('application/pallet', JSON.stringify({
                                orderId: order.id,
                                orderNumber: order.orderNumber,
                                palletTypeId: line.palletTypeId,
                                weightKg: pt?.weightKg ?? 0,
                              }));
                              setDragLine({ line, orderId: order.id, orderNumber: order.orderNumber });
                            }}
                            onDragEnd={() => setDragLine(null)}
                            className="flex items-center gap-2 p-2 mb-1 bg-zinc-800 rounded-lg cursor-grab active:cursor-grabbing hover:bg-zinc-700 transition-colors"
                          >
                            <GripVertical size={12} className="text-zinc-600 shrink-0" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[10px] font-medium text-zinc-300 truncate">{pt?.name ?? line.palletTypeId}</p>
                              <p className="text-[9px] text-zinc-500">{remaining} restantes · {pt?.weightKg}kg c/u</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-zinc-800 pt-3 text-[10px] text-zinc-600">
                Arrastra un palet a la celda del cajón para colocarlo
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
