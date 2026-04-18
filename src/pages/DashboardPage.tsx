import React from 'react';
import { Truck, Package, CheckCircle, Clock, AlertTriangle, BarChart3 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

function StatCard({ label, value, sub, icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wide">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
        </div>
        <div className={`p-2 rounded-lg bg-zinc-800 ${color}`}>{icon}</div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { trucks, orders, loadingStates } = useAppContext();
  const { session } = useAuth();

  const availableTrucks = trucks.filter(t => t.status === 'available').length;
  const loadingTrucks = trucks.filter(t => t.status === 'loading').length;
  const inTransit = trucks.filter(t => t.status === 'in_transit').length;

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const assignedOrders = orders.filter(o => o.status === 'assigned' || o.status === 'loading').length;
  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const totalPalletsLoaded = loadingStates.reduce(
    (acc, s) => acc + s.pallets.filter(p => p.status === 'loaded').length, 0
  );
  const totalPalletsPlaced = loadingStates.reduce((acc, s) => acc + s.pallets.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-zinc-100">Bienvenido, {session?.name}</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Resumen de operaciones del día</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Camiones disponibles"
          value={availableTrucks}
          sub={`de ${trucks.length} en flota`}
          icon={<Truck size={18} />}
          color="text-emerald-400"
        />
        <StatCard
          label="En carga / tránsito"
          value={loadingTrucks + inTransit}
          sub={`${loadingTrucks} cargando · ${inTransit} en ruta`}
          icon={<BarChart3 size={18} />}
          color="text-blue-400"
        />
        <StatCard
          label="Pedidos pendientes"
          value={pendingOrders}
          sub={`${assignedOrders} asignados`}
          icon={<Clock size={18} />}
          color="text-yellow-400"
        />
        <StatCard
          label="Pedidos hoy"
          value={todayOrders}
          sub={`${totalPalletsLoaded}/${totalPalletsPlaced} palets cargados`}
          icon={<Package size={18} />}
          color="text-purple-400"
        />
      </div>

      {/* Fleet status */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Truck size={16} className="text-emerald-400" />
          Estado de la flota
        </h3>
        {trucks.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">No hay camiones registrados</p>
        ) : (
          <div className="space-y-2">
            {trucks.map(truck => {
              const state = loadingStates.find(s => s.truckId === truck.id);
              const placed = state?.pallets.length ?? 0;
              const loaded = state?.pallets.filter(p => p.status === 'loaded').length ?? 0;
              const cols = Math.floor(truck.floorLengthCm / 80);
              const rows = Math.floor(truck.floorWidthCm / 120);
              const capacity = cols * rows;
              const usedPct = capacity > 0 ? Math.round((placed / capacity) * 100) : 0;

              const statusColors: Record<string, string> = {
                available: 'text-emerald-400',
                loading: 'text-blue-400',
                in_transit: 'text-yellow-400',
                maintenance: 'text-red-400',
              };
              const statusLabels: Record<string, string> = {
                available: 'Disponible',
                loading: 'En carga',
                in_transit: 'En tránsito',
                maintenance: 'Mantenimiento',
              };

              return (
                <div key={truck.id} className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-lg">
                  <Truck size={16} className={statusColors[truck.status]} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-200">{truck.plate}</span>
                      <span className="text-xs text-zinc-500">{truck.model}</span>
                      <span className={`text-xs ${statusColors[truck.status]}`}>{statusLabels[truck.status]}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all"
                          style={{ width: `${usedPct}%` }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 shrink-0">{placed}/{capacity} palets · {loaded} cargados</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent orders */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
          <Package size={16} className="text-emerald-400" />
          Pedidos recientes
        </h3>
        {orders.length === 0 ? (
          <p className="text-sm text-zinc-500 text-center py-8">No hay pedidos</p>
        ) : (
          <div className="space-y-2">
            {orders.slice(-5).reverse().map(order => {
              const statusColors: Record<string, string> = {
                pending: 'text-yellow-400', assigned: 'text-blue-400',
                loading: 'text-blue-400', loaded: 'text-emerald-400',
                in_transit: 'text-purple-400', delivered: 'text-emerald-300',
                cancelled: 'text-red-400',
              };
              const statusLabel: Record<string, string> = {
                pending: 'Pendiente', assigned: 'Asignado', loading: 'En carga',
                loaded: 'Cargado', in_transit: 'En tránsito', delivered: 'Entregado',
                cancelled: 'Cancelado',
              };
              return (
                <div key={order.id} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-zinc-200">{order.orderNumber}</span>
                    <span className="text-xs text-zinc-500 ml-2">{order.clientName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">{order.totalPallets} palets · {order.totalWeightKg.toLocaleString()} kg</span>
                    <span className={`text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabel[order.status]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
