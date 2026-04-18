import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Truck, PalletType, Order, TruckLoadingState, AppUser, OrderStatus } from '../types';
import {
  truckStorage,
  palletTypeStorage,
  orderStorage,
  loadingStateStorage,
  userStorage,
  seedIfEmpty,
} from '../storage/localStorage';

interface AppContextValue {
  // Data
  trucks: Truck[];
  palletTypes: PalletType[];
  orders: Order[];
  loadingStates: TruckLoadingState[];
  users: AppUser[];
  isSeeding: boolean;

  // Truck actions
  saveTruck: (truck: Truck) => void;
  deleteTruck: (id: string) => void;

  // PalletType actions
  savePalletType: (pt: PalletType) => void;
  deletePalletType: (id: string) => void;

  // Order actions
  saveOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus, truckId?: string) => void;
  deleteOrder: (id: string) => void;

  // Loading state actions
  saveLoadingState: (state: TruckLoadingState) => void;
  getLoadingState: (truckId: string) => TruckLoadingState;

  // User actions
  saveUser: (user: AppUser) => void;
  deleteUser: (id: string) => void;

  // Reload from storage
  refresh: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [palletTypes, setPalletTypes] = useState<PalletType[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingStates, setLoadingStates] = useState<TruckLoadingState[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [isSeeding, setIsSeeding] = useState(true);

  function refresh() {
    setTrucks(truckStorage.getAll());
    setPalletTypes(palletTypeStorage.getAll());
    setOrders(orderStorage.getAll());
    setLoadingStates(loadingStateStorage.getAll());
    setUsers(userStorage.getAll());
  }

  useEffect(() => {
    seedIfEmpty().then(() => {
      refresh();
      setIsSeeding(false);
    });
  }, []);

  // Truck actions
  function saveTruck(truck: Truck) {
    truckStorage.save(truck);
    setTrucks(truckStorage.getAll());
  }
  function deleteTruck(id: string) {
    truckStorage.delete(id);
    setTrucks(truckStorage.getAll());
  }

  // PalletType actions
  function savePalletType(pt: PalletType) {
    palletTypeStorage.save(pt);
    setPalletTypes(palletTypeStorage.getAll());
  }
  function deletePalletType(id: string) {
    palletTypeStorage.delete(id);
    setPalletTypes(palletTypeStorage.getAll());
  }

  // Order actions
  function saveOrder(order: Order) {
    orderStorage.save(order);
    setOrders(orderStorage.getAll());
  }
  function updateOrderStatus(id: string, status: OrderStatus, truckId?: string) {
    const all = orderStorage.getAll();
    const order = all.find(o => o.id === id);
    if (!order) return;
    const updated = {
      ...order,
      status,
      updatedAt: new Date().toISOString(),
      ...(truckId !== undefined ? { assignedTruckId: truckId } : {}),
    };
    orderStorage.save(updated);
    setOrders(orderStorage.getAll());
  }
  function deleteOrder(id: string) {
    orderStorage.delete(id);
    setOrders(orderStorage.getAll());
  }

  // Loading state actions
  function saveLoadingState(state: TruckLoadingState) {
    loadingStateStorage.save(state);
    setLoadingStates(loadingStateStorage.getAll());
  }
  function getLoadingState(truckId: string): TruckLoadingState {
    return loadingStates.find(s => s.truckId === truckId) ?? { truckId, pallets: [] };
  }

  // User actions
  function saveUser(user: AppUser) {
    userStorage.save(user);
    setUsers(userStorage.getAll());
  }
  function deleteUser(id: string) {
    userStorage.delete(id);
    setUsers(userStorage.getAll());
  }

  return (
    <AppContext.Provider value={{
      trucks, palletTypes, orders, loadingStates, users, isSeeding,
      saveTruck, deleteTruck,
      savePalletType, deletePalletType,
      saveOrder, updateOrderStatus, deleteOrder,
      saveLoadingState, getLoadingState,
      saveUser, deleteUser,
      refresh,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used inside AppProvider');
  return ctx;
}
