import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type AgentRole = 'Lead' | 'Frontend' | 'Backend' | 'QA' | 'Content' | 'Scheduler';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  status: 'idle' | 'working' | 'thinking' | 'done' | 'error';
  currentTask?: string;
  avatar: string;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  agentId: string;
  agentName: string;
  role: AgentRole;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  tokens?: number;
  cost?: number;
}

export const AGENTS: Agent[] = [
  { id: '1', name: 'Mission Controller', role: 'Lead', status: 'idle', avatar: '👨‍💼' },
  { id: '2', name: 'UI Architect', role: 'Frontend', status: 'idle', avatar: '🎨' },
  { id: '3', name: 'Logic Master', role: 'Backend', status: 'idle', avatar: '⚙️' },
  { id: '4', name: 'Bug Hunter', role: 'QA', status: 'idle', avatar: '🔍' },
  { id: '5', name: 'Social Strategist', role: 'Content', status: 'idle', avatar: '✍️' },
  { id: '6', name: 'Queue Master', role: 'Scheduler', status: 'idle', avatar: '📅' },
];

export async function runAgentTask(agent: Agent, task: string) {
  const systemInstructions = {
    Lead: "You are the Lead Agent. Analyze requests, decide priorities, and delegate tasks. Be concise and authoritative.",
    Frontend: "You are the Frontend Agent. Develop UI features and resolve UI bugs. Focus on React and Tailwind.",
    Backend: "You are the Backend Agent. Develop server-side logic and infrastructure. Focus on Node.js and APIs.",
    QA: "You are the QA Agent. Test code, find vulnerabilities, and validate quality. Be meticulous.",
    Content: "You are the Content Agent. Generate and publish posts for LinkedIn. Be engaging and professional.",
    Scheduler: "You are the Scheduler Agent. Orchestrate the work queue and manage timing.",
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: task,
      config: {
        systemInstruction: systemInstructions[agent.role],
      },
    });

    return {
      text: response.text,
      tokens: 100, // Mock token count as SDK doesn't always expose it directly in a simple way
      cost: 0.0002, // Mock cost
    };
  } catch (error) {
    console.error(`Error running agent ${agent.role}:`, error);
    throw error;
  }
}

// ─── SaaS Domain Types ────────────────────────────────────────────────────────

export type UserRole = 'admin' | 'dispatcher' | 'operator';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
  expiresAt: string;
}

export type TruckStatus = 'available' | 'loading' | 'in_transit' | 'maintenance';

export interface Truck {
  id: string;
  plate: string;
  model: string;
  typeName: string;
  floorLengthCm: number;
  floorWidthCm: number;
  maxWeightKg: number;
  status: TruckStatus;
  createdAt: string;
}

export interface PalletType {
  id: string;
  name: string;
  product: string;
  widthCm: number;
  depthCm: number;
  heightCm: number;
  weightKg: number;
  createdAt: string;
}

export interface GridPosition {
  col: number;
  row: number;
}

export type SlotStatus = 'empty' | 'placed' | 'loaded';

export interface PlacedPallet {
  id: string;
  orderId: string;
  orderNumber: string;
  palletTypeId: string;
  position: GridPosition;
  status: SlotStatus;
  weightKg: number;
  loadedAt?: string;
  loadedByUserId?: string;
}

export interface TruckLoadingState {
  truckId: string;
  pallets: PlacedPallet[];
}

export type OrderStatus =
  | 'pending'
  | 'assigned'
  | 'loading'
  | 'loaded'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface OrderLine {
  id: string;
  palletTypeId: string;
  palletTypeName: string;
  quantity: number;
  weightPerPallet: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientName: string;
  destination: string;
  lines: OrderLine[];
  totalPallets: number;
  totalWeightKg: number;
  status: OrderStatus;
  assignedTruckId?: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}
