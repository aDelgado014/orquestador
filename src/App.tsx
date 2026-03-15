/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Users, 
  Activity, 
  Cpu, 
  DollarSign, 
  Layout, 
  Play, 
  Pause, 
  RefreshCw,
  MessageSquare,
  ShieldCheck,
  Code,
  PenTool,
  Calendar,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AGENTS, Agent, ActivityLogEntry, AgentRole, runAgentTask } from './types';

const PixelAgent = ({ agent }: { agent: Agent }) => {
  const isWorking = agent.status === 'working' || agent.status === 'thinking';
  
  return (
    <div className="relative flex flex-col items-center group">
      <motion.div 
        animate={isWorking ? { y: [0, -4, 0] } : {}}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className={`w-16 h-16 bg-zinc-800 border-2 ${isWorking ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-zinc-700'} rounded-lg flex items-center justify-center text-3xl relative overflow-hidden`}
      >
        {agent.avatar}
        {isWorking && (
          <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />
        )}
      </motion.div>
      <div className="mt-2 text-center">
        <p className="text-[10px] font-mono uppercase tracking-tighter text-zinc-400">{agent.role}</p>
        <p className="text-xs font-bold text-zinc-100">{agent.name}</p>
      </div>
      
      {/* Tooltip-like status */}
      <AnimatePresence>
        {agent.currentTask && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-700 p-2 rounded shadow-xl z-10 w-48 pointer-events-none"
          >
            <p className="text-[9px] text-emerald-400 font-mono uppercase mb-1">Current Task</p>
            <p className="text-[10px] text-zinc-300 leading-tight line-clamp-2">{agent.currentTask}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
  const [stats, setStats] = useState({
    tasks: 0,
    tokens: 0,
    cost: 0,
  });
  const [inputTask, setInputTask] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (agentId: string, message: string, type: ActivityLogEntry['type'] = 'info', tokens = 0, cost = 0) => {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const newEntry: ActivityLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      agentId,
      agentName: agent.name,
      role: agent.role,
      message,
      type,
      tokens,
      cost,
    };

    setLogs(prev => [...prev, newEntry]);
    if (tokens > 0) {
      setStats(prev => ({
        tasks: prev.tasks + 1,
        tokens: prev.tokens + tokens,
        cost: prev.cost + cost,
      }));
    }
  };

  const updateAgentStatus = (id: string, status: Agent['status'], currentTask?: string) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, status, currentTask } : a));
  };

  const handleStartProcess = async () => {
    if (!inputTask.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const leadAgent = agents.find(a => a.role === 'Lead')!;
    
    // 1. Lead analyzes
    updateAgentStatus(leadAgent.id, 'working', `Analyzing: ${inputTask}`);
    addLog(leadAgent.id, `Received new request: "${inputTask}"`, 'info');
    
    try {
      const leadResult = await runAgentTask(leadAgent, `Analyze this task and decide which agent (Frontend, Backend, QA, Content, Scheduler) should handle it. Task: ${inputTask}. Respond with ONLY the role name.`);
      const targetRole = leadResult.text.trim() as AgentRole;
      addLog(leadAgent.id, `Analysis complete. Delegating to ${targetRole}.`, 'success', leadResult.tokens, leadResult.cost);
      updateAgentStatus(leadAgent.id, 'idle');

      // 2. Target agent works
      const targetAgent = agents.find(a => a.role === targetRole) || agents.find(a => a.role === 'Backend')!;
      updateAgentStatus(targetAgent.id, 'working', `Processing: ${inputTask}`);
      addLog(targetAgent.id, `Starting task: ${inputTask}`, 'info');
      
      const workResult = await runAgentTask(targetAgent, `Execute this task: ${inputTask}`);
      addLog(targetAgent.id, `Task completed: ${workResult.text.substring(0, 50)}...`, 'success', workResult.tokens, workResult.cost);
      updateAgentStatus(targetAgent.id, 'idle');

      // 3. QA validates
      const qaAgent = agents.find(a => a.role === 'QA')!;
      updateAgentStatus(qaAgent.id, 'working', `Validating output from ${targetAgent.name}`);
      addLog(qaAgent.id, `Reviewing ${targetAgent.role} output...`, 'info');
      
      const qaResult = await runAgentTask(qaAgent, `Validate this output for quality and security: ${workResult.text}`);
      addLog(qaAgent.id, `Validation passed: ${qaResult.text.substring(0, 50)}...`, 'success', qaResult.tokens, qaResult.cost);
      updateAgentStatus(qaAgent.id, 'idle');

    } catch (error) {
      addLog('1', 'System error during orchestration', 'error');
    } finally {
      setIsProcessing(false);
      setInputTask('');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-emerald-500/30">
      {/* Top Navigation Bar */}
      <nav className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
            <Terminal className="text-black w-5 h-5" />
          </div>
          <h1 className="font-bold text-lg tracking-tight text-white">ATHENAS <span className="text-emerald-500">IT</span></h1>
          <div className="ml-4 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-mono text-emerald-500 animate-pulse">
            LIVE SYSTEM
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 uppercase">Tasks</span>
              <span className="text-white">{stats.tasks}</span>
            </div>
            <div className="w-px h-6 bg-zinc-800" />
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 uppercase">Tokens</span>
              <span className="text-white">{(stats.tokens / 1000).toFixed(2)}k</span>
            </div>
            <div className="w-px h-6 bg-zinc-800" />
            <div className="flex flex-col items-end">
              <span className="text-zinc-500 uppercase">Cost</span>
              <span className="text-emerald-500">${stats.cost.toFixed(4)}</span>
            </div>
          </div>
          <button className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <RefreshCw className="w-4 h-4 text-zinc-500" />
          </button>
        </div>
      </nav>

      <main className="p-6 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto">
        
        {/* Left Panel: Office View */}
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Virtual Office Floor</h2>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
            </div>
            
            {/* The "RPG" Office View */}
            <div className="aspect-video bg-[#1a1a1a] relative overflow-hidden p-8 flex flex-col items-center justify-center">
              {/* Grid Background */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
              />
              
              <div className="relative z-10 w-full max-w-2xl">
                <div className="text-center mb-12">
                  <h3 className="text-2xl font-black text-white tracking-tighter uppercase italic">GNR Athenas Project</h3>
                  <p className="text-emerald-500 font-mono text-xs">www.gonzalorocca.com.ar</p>
                </div>

                <div className="grid grid-cols-3 gap-y-16 gap-x-8">
                  {agents.map(agent => (
                    <PixelAgent key={agent.id} agent={agent} />
                  ))}
                </div>
              </div>

              {/* Decorative Office Elements */}
              <div className="absolute bottom-4 right-4 text-[10px] font-mono text-zinc-600">
                SECURE_ENCLAVE_V2.0
              </div>
            </div>
          </div>

          {/* Task Input Area */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <h3 className="text-sm font-bold uppercase">Command Center</h3>
            </div>
            <div className="flex gap-4">
              <input 
                type="text" 
                value={inputTask}
                onChange={(e) => setInputTask(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStartProcess()}
                placeholder="Assign a new mission to the team..."
                className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
              <button 
                onClick={handleStartProcess}
                disabled={isProcessing || !inputTask.trim()}
                className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all active:scale-95"
              >
                {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                EXECUTE
              </button>
            </div>
          </div>
        </section>

        {/* Right Panel: Activity Log & Stats */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          {/* Activity Log */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl flex flex-col h-[600px] shadow-xl">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h2 className="text-sm font-bold uppercase tracking-wider">Activity Log</h2>
              </div>
              <span className="text-[10px] font-mono text-zinc-500">REAL-TIME</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-[11px]">
              {logs.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-zinc-600 italic">
                  <Terminal className="w-8 h-8 mb-2 opacity-20" />
                  <p>Waiting for system initialization...</p>
                </div>
              )}
              {logs.map((log) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={log.id} 
                  className="border-l-2 border-zinc-800 pl-3 py-1 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold ${
                      log.type === 'success' ? 'text-emerald-500' : 
                      log.type === 'error' ? 'text-red-500' : 
                      'text-zinc-400'
                    }`}>
                      [{log.role}] {log.agentName}
                    </span>
                    <span className="text-[9px] text-zinc-600">
                      {log.timestamp.toLocaleTimeString([], { hour12: false })}
                    </span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{log.message}</p>
                  {log.tokens ? (
                    <div className="mt-1 flex gap-2 text-[9px] text-zinc-500">
                      <span>TOKENS: {log.tokens}</span>
                      <span>COST: ${log.cost?.toFixed(5)}</span>
                    </div>
                  ) : null}
                </motion.div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase text-zinc-500">Security</span>
              </div>
              <p className="text-xl font-bold text-white">ACTIVE</p>
              <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-full" />
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase text-zinc-500">Load</span>
              </div>
              <p className="text-xl font-bold text-white">{isProcessing ? '84%' : '2%'}</p>
              <div className="w-full bg-zinc-800 h-1 mt-2 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ width: isProcessing ? '84%' : '2%' }}
                  className="bg-emerald-500 h-full" 
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800 p-8 text-center">
        <p className="text-xs text-zinc-600 font-mono">
          &copy; 2026 ATHENAS IT MULTI-AGENT ORCHESTRATOR // BUILT WITH GEMINI 3.1 PRO
        </p>
      </footer>
    </div>
  );
}
