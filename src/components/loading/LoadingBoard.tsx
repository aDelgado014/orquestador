import React, { useRef, useState } from 'react';
import { Truck, Weight, Package, GripHorizontal } from 'lucide-react';
import type { Truck as TruckType, PlacedPallet, Order } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getGridDimensions, computeWeights, isCellOccupied } from '../../utils/loadingGrid';
import { PalletSlot } from './PalletSlot';

const ORDER_COLORS = [
  '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
];

interface LoadingBoardProps {
  truck: TruckType;
}

export function LoadingBoard({ truck }: LoadingBoardProps) {
  const { getLoadingState, saveLoadingState, orders } = useAppContext();
  const { hasRole } = useAuth();
  const canLoad = hasRole(['admin', 'dispatcher', 'operator']);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState<{ col: number; row: number } | null>(null);

  const state = getLoadingState(truck.id);
  const pallets = state.pallets;

  const containerWidthPx = Math.min((containerRef.current?.clientWidth ?? 900) - 32, 900);
  const grid = getGridDimensions(truck, containerWidthPx);
  const { totalKg, frontKg, rearKg } = computeWeights(pallets, grid.cols);

  // Map orderIds to colors
  const assignedOrders = orders.filter(o => o.assignedTruckId === truck.id);
  const orderColorMap = new Map<string, string>(
    assignedOrders.map((o, i) => [o.id, ORDER_COLORS[i % ORDER_COLORS.length]])
  );

  const weightPct = Math.min(Math.round((totalKg / truck.maxWeightKg) * 100), 100);
  const palletCapacity = grid.cols * grid.rows;
  const palletPct = Math.min(Math.round((pallets.length / palletCapacity) * 100), 100);
  const frontPct = totalKg > 0 ? Math.round((frontKg / totalKg) * 100) : 0;

  function getPalletAt(col: number, row: number): PlacedPallet | null {
    return pallets.find(p => p.position.col === col && p.position.row === row) ?? null;
  }

  function handleDrop(col: number, row: number, data: string) {
    if (!data) return;
    try {
      const { orderId, orderNumber, palletTypeId, weightKg } = JSON.parse(data) as {
        orderId: string; orderNumber: string; palletTypeId: string; weightKg: number;
      };
      if (isCellOccupied(col, row, pallets)) return;
      const newPallet: PlacedPallet = {
        id: `pp${Date.now()}`,
        orderId, orderNumber, palletTypeId,
        position: { col, row },
        status: 'placed',
        weightKg,
      };
      saveLoadingState({ truckId: truck.id, pallets: [...pallets, newPallet] });
    } catch { /* ignore bad drag data */ }
    setDragOver(null);
  }

  function handleMarkLoaded(palletId: string) {
    const updated = pallets.map(p =>
      p.id === palletId
        ? { ...p, status: 'loaded' as const, loadedAt: new Date().toISOString() }
        : p
    );
    saveLoadingState({ truckId: truck.id, pallets: updated });
  }

  const loadedCount = pallets.filter(p => p.status === 'loaded').length;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Truck size={20} className="text-emerald-400" />
          <div>
            <p className="font-semibold text-zinc-100">{truck.plate}</p>
            <p className="text-xs text-zinc-500">{truck.model} · {truck.typeName} · {(truck.floorLengthCm / 100).toFixed(1)}m × {(truck.floorWidthCm / 100).toFixed(1)}m</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Package size={14} />
            <span><strong className="text-zinc-200">{pallets.length}/{palletCapacity}</strong> palets</span>
            {loadedCount > 0 && <span className="text-emerald-400">({loadedCount} cargados)</span>}
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Weight size={14} />
            <span><strong className={weightPct > 90 ? 'text-red-400' : 'text-zinc-200'}>{(totalKg / 1000).toFixed(1)}t</strong> / {(truck.maxWeightKg / 1000).toFixed(0)}t</span>
          </div>
        </div>
      </div>

      {/* Capacity bars */}
      <div className="px-4 py-3 border-b border-zinc-800 space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 w-16 shrink-0">Palets</span>
          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${palletPct}%` }} />
          </div>
          <span className="text-[10px] text-zinc-400 w-8 text-right">{palletPct}%</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500 w-16 shrink-0">Peso</span>
          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${weightPct > 90 ? 'bg-red-500' : weightPct > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
              style={{ width: `${weightPct}%` }}
            />
          </div>
          <span className="text-[10px] text-zinc-400 w-8 text-right">{weightPct}%</span>
        </div>
        {totalKg > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-500 w-16 shrink-0">Eje (F/R)</span>
            <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-purple-500" style={{ width: `${frontPct}%` }} />
              <div className="h-full bg-orange-500" style={{ width: `${100 - frontPct}%` }} />
            </div>
            <span className="text-[10px] text-zinc-400 w-16 text-right">{frontPct}% / {100 - frontPct}%</span>
          </div>
        )}
      </div>

      {/* Grid */}
      <div ref={containerRef} className="p-4 overflow-x-auto">
        <div className="flex items-center gap-2 mb-2 text-[10px] text-zinc-500">
          <span className="px-2 py-0.5 bg-zinc-800 rounded">CABINA →</span>
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="px-2 py-0.5 bg-zinc-800 rounded">← PUERTA</span>
        </div>

        <div
          className="grid gap-0.5"
          style={{
            gridTemplateColumns: `repeat(${grid.cols}, ${grid.cellWidthPx}px)`,
            gridTemplateRows: `repeat(${grid.rows}, ${grid.cellHeightPx}px)`,
          }}
        >
          {Array.from({ length: grid.cols }).flatMap((_, col) =>
            Array.from({ length: grid.rows }).map((_, row) => {
              const pallet = getPalletAt(col, row);
              const color = pallet ? orderColorMap.get(pallet.orderId) : undefined;
              const isOver = dragOver?.col === col && dragOver?.row === row;
              return (
                <PalletSlot
                  key={`${col}-${row}`}
                  col={col}
                  row={row}
                  cellWidthPx={grid.cellWidthPx}
                  cellHeightPx={grid.cellHeightPx}
                  pallet={pallet}
                  color={color}
                  isDragOver={isOver}
                  canLoad={canLoad}
                  onDrop={handleDrop}
                  onMarkLoaded={handleMarkLoaded}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      {assignedOrders.length > 0 && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
          <p className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wide">Pedidos asignados</p>
          <div className="flex flex-wrap gap-2">
            {assignedOrders.map((o, i) => {
              const color = ORDER_COLORS[i % ORDER_COLORS.length];
              const placed = pallets.filter(p => p.orderId === o.id).length;
              const loaded = pallets.filter(p => p.orderId === o.id && p.status === 'loaded').length;
              return (
                <div key={o.id} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-zinc-400">{o.orderNumber}</span>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-500">{o.clientName}</span>
                  <span className="text-zinc-600">·</span>
                  <span className={loaded === placed && placed > 0 ? 'text-emerald-400' : 'text-zinc-400'}>{loaded}/{placed}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Drag instructions */}
      {assignedOrders.length > 0 && (
        <div className="px-4 pb-3 flex items-center gap-1.5 text-[10px] text-zinc-600">
          <GripHorizontal size={12} />
          Arrastra palets desde el panel lateral · Haz clic en un palet para marcarlo como cargado
        </div>
      )}
    </div>
  );
}
