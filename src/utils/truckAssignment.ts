import type { Order, Truck, PalletType, TruckLoadingState } from '../types';

export interface AssignmentResult {
  orderId: string;
  truckId: string | null;
  reason?: string;
}

function getPalletCapacity(truck: Truck, palletTypes: PalletType[]): number {
  // Use the most common pallet footprint (80x120cm) as grid unit
  const cols = Math.floor(truck.floorLengthCm / 80);
  const rows = Math.floor(truck.floorWidthCm / 120);
  return cols * rows;
}

function getUsedCapacity(truckId: string, loadingStates: TruckLoadingState[]): { pallets: number; weightKg: number } {
  const state = loadingStates.find(s => s.truckId === truckId);
  if (!state) return { pallets: 0, weightKg: 0 };
  return {
    pallets: state.pallets.length,
    weightKg: state.pallets.reduce((acc, p) => acc + p.weightKg, 0),
  };
}

export function autoAssignOrders(
  pendingOrders: Order[],
  trucks: Truck[],
  palletTypes: PalletType[],
  loadingStates: TruckLoadingState[],
): AssignmentResult[] {
  const results: AssignmentResult[] = [];

  // Sort orders heaviest first (FFD heuristic)
  const sorted = [...pendingOrders].sort((a, b) => b.totalWeightKg - a.totalWeightKg);

  // Working copy of loading states to track in-flight assignments
  const workingStates = new Map<string, { pallets: number; weightKg: number }>(
    trucks.map(t => [t.id, getUsedCapacity(t.id, loadingStates)])
  );

  for (const order of sorted) {
    let assigned = false;

    // Find available / loading trucks, sorted by remaining capacity ascending (best-fit)
    const candidates = trucks
      .filter(t => t.status === 'available' || t.status === 'loading')
      .map(t => {
        const capacity = getPalletCapacity(t, palletTypes);
        const used = workingStates.get(t.id) ?? { pallets: 0, weightKg: 0 };
        return {
          truck: t,
          remainingPallets: capacity - used.pallets,
          remainingWeight: t.maxWeightKg - used.weightKg,
        };
      })
      .filter(c => c.remainingPallets >= order.totalPallets && c.remainingWeight >= order.totalWeightKg)
      .sort((a, b) => a.remainingPallets - b.remainingPallets); // best-fit: smallest that fits

    if (candidates.length > 0) {
      const best = candidates[0];
      results.push({ orderId: order.id, truckId: best.truck.id });
      // Update working state
      const prev = workingStates.get(best.truck.id) ?? { pallets: 0, weightKg: 0 };
      workingStates.set(best.truck.id, {
        pallets: prev.pallets + order.totalPallets,
        weightKg: prev.weightKg + order.totalWeightKg,
      });
      assigned = true;
    }

    if (!assigned) {
      results.push({
        orderId: order.id,
        truckId: null,
        reason: `Sin camión disponible con capacidad suficiente (${order.totalPallets} palets · ${order.totalWeightKg} kg)`,
      });
    }
  }

  return results;
}
