import type { Truck, PlacedPallet } from '../types';

export interface GridDimensions {
  cols: number;
  rows: number;
  cellWidthPx: number;
  cellHeightPx: number;
}

// Returns grid dimensions for a given truck using 80cm wide pallets as column unit
// and 120cm deep pallets as row unit
export function getGridDimensions(truck: Truck, containerWidthPx = 900): GridDimensions {
  const cols = Math.floor(truck.floorLengthCm / 80);
  const rows = Math.floor(truck.floorWidthCm / 120);
  const cellWidthPx = Math.floor(containerWidthPx / cols);
  // Maintain real aspect ratio
  const cellHeightPx = Math.round(cellWidthPx * (120 / 80));
  return { cols, rows, cellWidthPx, cellHeightPx };
}

export function isCellOccupied(
  col: number,
  row: number,
  pallets: PlacedPallet[],
  excludeId?: string,
): boolean {
  return pallets.some(
    p => p.id !== excludeId && p.position.col === col && p.position.row === row,
  );
}

export function findNextFreePosition(
  pallets: PlacedPallet[],
  cols: number,
  rows: number,
): { col: number; row: number } | null {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      if (!isCellOccupied(col, row, pallets)) {
        return { col, row };
      }
    }
  }
  return null;
}

// Compute total weight and axle weights based on pallet positions
export function computeWeights(
  pallets: PlacedPallet[],
  cols: number,
): { totalKg: number; frontKg: number; rearKg: number } {
  let totalKg = 0;
  let frontKg = 0;
  let rearKg = 0;
  const frontCutoff = Math.floor(cols * 0.4); // front 40% = cab area

  for (const p of pallets) {
    totalKg += p.weightKg;
    if (p.position.col < frontCutoff) {
      frontKg += p.weightKg;
    } else {
      rearKg += p.weightKg;
    }
  }
  return { totalKg, frontKg, rearKg };
}
