import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { PlacedPallet } from '../../types';

interface PalletSlotProps {
  col: number;
  row: number;
  cellWidthPx: number;
  cellHeightPx: number;
  pallet: PlacedPallet | null;
  color?: string;
  isDragOver?: boolean;
  canLoad?: boolean;
  onDrop?: (col: number, row: number, data: string) => void;
  onMarkLoaded?: (palletId: string) => void;
}

export function PalletSlot({
  col, row, cellWidthPx, cellHeightPx,
  pallet, color, isDragOver, canLoad, onDrop, onMarkLoaded,
}: PalletSlotProps) {
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    onDrop?.(col, row, e.dataTransfer.getData('application/pallet'));
  }

  if (!pallet) {
    return (
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ width: cellWidthPx, height: cellHeightPx }}
        className={`border border-zinc-700/50 rounded flex items-center justify-center transition-colors cursor-crosshair
          ${isDragOver ? 'bg-emerald-900/40 border-emerald-500' : 'bg-zinc-800/30 hover:bg-zinc-700/30'}`}
      >
        <span className="text-[8px] text-zinc-700 select-none">{col},{row}</span>
      </div>
    );
  }

  const isLoaded = pallet.status === 'loaded';

  return (
    <div
      style={{ width: cellWidthPx, height: cellHeightPx, backgroundColor: color ? `${color}22` : '#16a34a22', borderColor: color ?? '#16a34a' }}
      className={`border-2 rounded flex flex-col items-center justify-center relative transition-all cursor-pointer select-none
        ${isLoaded ? 'opacity-75' : 'hover:brightness-110'}`}
      onClick={() => canLoad && !isLoaded && pallet && onMarkLoaded?.(pallet.id)}
      title={isLoaded ? `Cargado: ${pallet.orderNumber}` : `Click para marcar como cargado: ${pallet.orderNumber}`}
    >
      {isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/30 rounded">
          <CheckCircle2 size={14} className="text-emerald-400" />
        </div>
      )}
      {!isLoaded && (
        <span className="text-[9px] font-bold text-white/80 text-center leading-tight px-1 truncate w-full text-center">
          {pallet.orderNumber.split('-').pop()}
        </span>
      )}
    </div>
  );
}
