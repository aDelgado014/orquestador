import type { AppUser, Truck, PalletType, Order, TruckLoadingState, AuthSession } from '../types';

const KEYS = {
  users: 'carga_v1_users',
  trucks: 'carga_v1_trucks',
  palletTypes: 'carga_v1_palletTypes',
  orders: 'carga_v1_orders',
  loadingStates: 'carga_v1_loadingStates',
  session: 'carga_v1_session',
} as const;

function get<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function set<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function getSingle<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function setSingle<T>(key: string, data: T | null): void {
  if (data === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Simple SHA-256 hash using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const computed = await hashPassword(password);
  return computed === hash;
}

// ─── Users ────────────────────────────────────────────────────────────────────
export const userStorage = {
  getAll: (): AppUser[] => get<AppUser>(KEYS.users),
  save: (user: AppUser): void => {
    const all = userStorage.getAll();
    const idx = all.findIndex(u => u.id === user.id);
    if (idx >= 0) all[idx] = user; else all.push(user);
    set(KEYS.users, all);
  },
  delete: (id: string): void => set(KEYS.users, userStorage.getAll().filter(u => u.id !== id)),
  findByEmail: (email: string): AppUser | undefined =>
    userStorage.getAll().find(u => u.email.toLowerCase() === email.toLowerCase()),
};

// ─── Trucks ───────────────────────────────────────────────────────────────────
export const truckStorage = {
  getAll: (): Truck[] => get<Truck>(KEYS.trucks),
  save: (truck: Truck): void => {
    const all = truckStorage.getAll();
    const idx = all.findIndex(t => t.id === truck.id);
    if (idx >= 0) all[idx] = truck; else all.push(truck);
    set(KEYS.trucks, all);
  },
  delete: (id: string): void => set(KEYS.trucks, truckStorage.getAll().filter(t => t.id !== id)),
};

// ─── Pallet Types ─────────────────────────────────────────────────────────────
export const palletTypeStorage = {
  getAll: (): PalletType[] => get<PalletType>(KEYS.palletTypes),
  save: (pt: PalletType): void => {
    const all = palletTypeStorage.getAll();
    const idx = all.findIndex(p => p.id === pt.id);
    if (idx >= 0) all[idx] = pt; else all.push(pt);
    set(KEYS.palletTypes, all);
  },
  delete: (id: string): void =>
    set(KEYS.palletTypes, palletTypeStorage.getAll().filter(p => p.id !== id)),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orderStorage = {
  getAll: (): Order[] => get<Order>(KEYS.orders),
  save: (order: Order): void => {
    const all = orderStorage.getAll();
    const idx = all.findIndex(o => o.id === order.id);
    if (idx >= 0) all[idx] = order; else all.push(order);
    set(KEYS.orders, all);
  },
  delete: (id: string): void => set(KEYS.orders, orderStorage.getAll().filter(o => o.id !== id)),
};

// ─── Loading States ───────────────────────────────────────────────────────────
export const loadingStateStorage = {
  getAll: (): TruckLoadingState[] => get<TruckLoadingState>(KEYS.loadingStates),
  getByTruck: (truckId: string): TruckLoadingState =>
    loadingStateStorage.getAll().find(s => s.truckId === truckId) ?? { truckId, pallets: [] },
  save: (state: TruckLoadingState): void => {
    const all = loadingStateStorage.getAll();
    const idx = all.findIndex(s => s.truckId === state.truckId);
    if (idx >= 0) all[idx] = state; else all.push(state);
    set(KEYS.loadingStates, all);
  },
};

// ─── Session ──────────────────────────────────────────────────────────────────
export const sessionStorage_ = {
  get: (): AuthSession | null => getSingle<AuthSession>(KEYS.session),
  set: (session: AuthSession | null): void => setSingle(KEYS.session, session),
};

// ─── Seed ─────────────────────────────────────────────────────────────────────
export async function seedIfEmpty(): Promise<void> {
  if (userStorage.getAll().length > 0) return;

  const [adminHash, dispatchHash, loaderHash] = await Promise.all([
    hashPassword('admin123'),
    hashPassword('dispatch123'),
    hashPassword('loader123'),
  ]);

  const now = new Date().toISOString();

  // Seed users
  const users: AppUser[] = [
    { id: 'u1', name: 'Administrador', email: 'admin@flota.com', passwordHash: adminHash, role: 'admin', active: true, createdAt: now },
    { id: 'u2', name: 'Despachador', email: 'dispatch@flota.com', passwordHash: dispatchHash, role: 'dispatcher', active: true, createdAt: now },
    { id: 'u3', name: 'Operario', email: 'loader@flota.com', passwordHash: loaderHash, role: 'operator', active: true, createdAt: now },
  ];
  users.forEach(u => userStorage.save(u));

  // Seed pallet types
  const palletTypes: PalletType[] = [
    { id: 'pt1', name: 'Europalet Agua 1.5L', product: 'Agua 1.5L (6x8 pack)', widthCm: 80, depthCm: 120, heightCm: 145, weightKg: 1080, createdAt: now },
    { id: 'pt2', name: 'Europalet Agua 5L', product: 'Agua 5L (3x4 pack)', widthCm: 80, depthCm: 120, heightCm: 145, weightKg: 960, createdAt: now },
    { id: 'pt3', name: 'Palet Industrial Agua', product: 'Agua 1.5L industrial', widthCm: 100, depthCm: 120, heightCm: 150, weightKg: 1200, createdAt: now },
  ];
  palletTypes.forEach(p => palletTypeStorage.save(p));

  // Seed trucks
  const trucks: Truck[] = [
    { id: 't1', plate: '1234-ABC', model: 'Volvo FH', typeName: 'Semirremolque', floorLengthCm: 1360, floorWidthCm: 240, maxWeightKg: 24000, status: 'available', createdAt: now },
    { id: 't2', plate: '5678-DEF', model: 'DAF CF', typeName: 'Semirremolque', floorLengthCm: 1360, floorWidthCm: 240, maxWeightKg: 24000, status: 'available', createdAt: now },
    { id: 't3', plate: '9012-GHI', model: 'Mercedes Actros', typeName: 'Camión rígido', floorLengthCm: 750, floorWidthCm: 240, maxWeightKg: 12000, status: 'available', createdAt: now },
    { id: 't4', plate: '3456-JKL', model: 'Iveco Daily', typeName: 'Furgón grande', floorLengthCm: 450, floorWidthCm: 210, maxWeightKg: 3500, status: 'available', createdAt: now },
  ];
  trucks.forEach(t => truckStorage.save(t));
}
