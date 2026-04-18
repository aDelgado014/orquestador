# PLANTA DE ACTUALIZACIONES — SaaS Carga de Camiones

> Documento de seguimiento de todos los cambios planificados y realizados.
> Estados: ✅ Hecho | 🔄 En progreso | ⏳ Pendiente | ❌ No realizado / Pospuesto

---

## FASE 0 — Documento de Seguimiento

| # | Cambio | Estado |
|---|--------|--------|
| 0.1 | Crear `PLANTA_ACTUALIZACIONES.md` en raíz del repo | ✅ Hecho |

---

## FASE 1 — Fundación (Router + Context + Storage + Auth)

| # | Cambio | Archivo(s) | Estado |
|---|--------|-----------|--------|
| 1.1 | Instalar `react-router-dom` v7 | `package.json` | ✅ Hecho |
| 1.2 | Instalar `@types/react` y `@types/react-dom` v19 | `package.json` | ✅ Hecho |
| 1.3 | Añadir tipos TypeScript del dominio al archivo existente | `src/types.ts` | ✅ Hecho |
| 1.4 | Crear adaptador localStorage (CRUD tipado + seed) | `src/storage/localStorage.ts` | ✅ Hecho |
| 1.5 | Crear AuthContext (login/logout/currentUser) | `src/context/AuthContext.tsx` | ✅ Hecho |
| 1.6 | Crear AppContext (trucks, orders, palletTypes, users) | `src/context/AppContext.tsx` | ✅ Hecho |
| 1.7 | Modificar `main.tsx` — BrowserRouter + providers | `src/main.tsx` | ✅ Hecho |
| 1.8 | Crear LoginPage con formulario email/password | `src/pages/LoginPage.tsx` | ✅ Hecho |
| 1.9 | Crear layout: Sidebar, Header, ProtectedRoute | `src/components/layout/` | ✅ Hecho |
| 1.10 | Crear componentes UI base: Button, Modal, Badge, Input, Select | `src/components/ui/` | ✅ Hecho |
| 1.11 | Modificar `App.tsx` — reemplazar por router con rutas protegidas | `src/App.tsx` | ✅ Hecho |
| 1.12 | Mover UI del orquestador existente a OrchestratorPage | `src/pages/OrchestratorPage.tsx` | ✅ Hecho |

---

## FASE 2 — Gestión de Flota y Tipos de Palet

| # | Cambio | Archivo(s) | Estado |
|---|--------|-----------|--------|
| 2.1 | Crear TrucksPage — lista de camiones con CRUD | `src/pages/TrucksPage.tsx` | ✅ Hecho |
| 2.2 | Crear PalletTypesPage — configuración de tipos de palet | `src/pages/PalletTypesPage.tsx` | ✅ Hecho |
| 2.3 | Seed de datos: 4 camiones + 3 tipos palet de agua | `src/storage/localStorage.ts` | ✅ Hecho |

---

## FASE 3 — Pedidos y Asignación Automática

| # | Cambio | Archivo(s) | Estado |
|---|--------|-----------|--------|
| 3.1 | Algoritmo de asignación automática best-fit (FFD) | `src/utils/truckAssignment.ts` | ✅ Hecho |
| 3.2 | Cálculo de grilla del cajón (posiciones por palet) | `src/utils/loadingGrid.ts` | ✅ Hecho |
| 3.3 | OrdersPage — lista de pedidos con estados y asignación | `src/pages/OrdersPage.tsx` | ✅ Hecho |
| 3.4 | Formulario de creación de pedidos con líneas | `src/pages/OrdersPage.tsx` | ✅ Hecho |
| 3.5 | Botón "Asignar automáticamente" — asigna todos los pendientes | `src/pages/OrdersPage.tsx` | ✅ Hecho |
| 3.6 | Al asignar, coloca palets automáticamente en grilla del camión | `src/pages/OrdersPage.tsx` | ✅ Hecho |

---

## FASE 4 — Plano Visual del Cajón (Feature Principal)

| # | Cambio | Archivo(s) | Estado |
|---|--------|-----------|--------|
| 4.1 | LoadingBoardPage — página con selector de camión | `src/pages/LoadingBoardPage.tsx` | ✅ Hecho |
| 4.2 | TruckFloorGrid — grilla CSS con dimensiones reales | `src/components/loading/LoadingBoard.tsx` | ✅ Hecho |
| 4.3 | PalletSlot — celda interactiva (vacía / colocada / cargada) | `src/components/loading/PalletSlot.tsx` | ✅ Hecho |
| 4.4 | Panel lateral de palets arrastrables (drag & drop) | `src/pages/LoadingBoardPage.tsx` | ✅ Hecho |
| 4.5 | Barra de peso y capacidad de palets con colores | `src/components/loading/LoadingBoard.tsx` | ✅ Hecho |
| 4.6 | Distribución de peso ejes delantero/trasero (F/R) | `src/components/loading/LoadingBoard.tsx` | ✅ Hecho |
| 4.7 | Leyenda de pedidos con colores + contador cargados | `src/components/loading/LoadingBoard.tsx` | ✅ Hecho |
| 4.8 | Operario: click en palet para marcar como cargado | `src/components/loading/PalletSlot.tsx` | ✅ Hecho |

---

## FASE 5 — Usuarios, Dashboard y Pulido

| # | Cambio | Archivo(s) | Estado |
|---|--------|-----------|--------|
| 5.1 | UsersPage — CRUD de usuarios con asignación de roles | `src/pages/UsersPage.tsx` | ✅ Hecho |
| 5.2 | DashboardPage — KPIs: flota, pedidos, palets cargados | `src/pages/DashboardPage.tsx` | ✅ Hecho |
| 5.3 | Protección de rutas por rol en todas las páginas | `src/App.tsx` | ✅ Hecho |
| 5.4 | Estados vacíos (empty states) en listas | Múltiples páginas | ✅ Hecho |

---

## CAMBIOS FUTUROS / MIGRACIONES

| # | Cambio | Prioridad | Estado |
|---|--------|-----------|--------|
| F.1 | Migrar storage de localStorage a Express + SQLite | Alta | ⏳ Pendiente |
| F.2 | Autenticación real con JWT y sesiones persistentes | Alta | ⏳ Pendiente |
| F.3 | Rol Conductor: vista de su camión asignado | Media | ⏳ Pendiente |
| F.4 | Rol Viewer: solo lectura de pedidos y flota | Baja | ⏳ Pendiente |
| F.5 | Integración Gemini AI para sugerencia de distribución | Media | ⏳ Pendiente |
| F.6 | Notificaciones en tiempo real (WebSockets) | Media | ⏳ Pendiente |
| F.7 | Exportación de manifiesto de carga en PDF | Media | ⏳ Pendiente |
| F.8 | Split de bundle con dynamic import() para mejorar carga | Baja | ⏳ Pendiente |

---

## CREDENCIALES DE ACCESO INICIAL (Seed)

```
Admin:       admin@flota.com     /  admin123
Despachador: dispatch@flota.com  /  dispatch123
Operario:    loader@flota.com    /  loader123
```

---

## HISTORIAL DE COMMITS

| Fecha | Fase | Descripción |
|-------|------|-------------|
| 2026-04-18 | 0–5 | feat: implementación completa del SaaS de carga de camiones |

---

## RUTAS DE LA APLICACIÓN

| Ruta | Descripción | Roles permitidos |
|------|-------------|-----------------|
| `/login` | Inicio de sesión | Público |
| `/dashboard` | Panel de KPIs | Todos |
| `/trucks` | Gestión de flota | Admin, Despachador, Operario |
| `/orders` | Gestión de pedidos | Admin, Despachador |
| `/loading` | Plano visual de carga | Admin, Despachador, Operario |
| `/pallets` | Tipos de palet | Admin |
| `/users` | Gestión de usuarios | Admin |
| `/orchestrator` | AI Orchestrator (original) | Admin |
