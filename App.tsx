
import React, { useState, useEffect, useCallback } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Zap, 
  Search, 
  Bell, 
  User,
  Plus,
  ArrowUpRight,
  Sparkles,
  Send,
  Loader2,
  BrainCircuit
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { analyzeContent, getSmartSuggestions } from './services/gemini';
import { Message, MetricData } from './types';

// Components
const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 group ${
      active ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
    }`}
  >
    <Icon size={20} className={active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, icon: Icon }: { title: string, value: string, trend: number, icon: any }) => (
  <div className="glass p-6 rounded-2xl flex flex-col gap-4">
    <div className="flex justify-between items-start">
      <div className="p-3 bg-indigo-500/10 rounded-lg">
        <Icon size={22} className="text-indigo-400" />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
        {trend >= 0 ? '+' : ''}{trend}%
        <ArrowUpRight size={14} className={trend < 0 ? 'rotate-90' : ''} />
      </div>
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const chartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setIsTyping(true);

    try {
      const response = await analyzeContent(prompt);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const fetchSuggestions = useCallback(async () => {
    const data = await getSmartSuggestions("Current productivity trends and project management optimization.");
    setSuggestions(data);
  }, []);

  useEffect(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#030712]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/10 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Zap size={24} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold font-outfit tracking-tight">Lumina AI</span>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={MessageSquare} 
            label="AI Chat" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          <SidebarItem 
            icon={BarChart3} 
            label="Analytics" 
            active={activeTab === 'analytics'} 
            onClick={() => setActiveTab('analytics')} 
          />
          <SidebarItem 
            icon={BrainCircuit} 
            label="Insights" 
            active={activeTab === 'insights'} 
            onClick={() => setActiveTab('insights')} 
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
          <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
          <div className="p-4 glass rounded-xl mt-4">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Storage</p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-slate-400 mt-2">7.2 GB of 10 GB used</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-[#030712]/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/10 w-full max-w-md">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search data, insights, or commands..." 
              className="bg-transparent border-none outline-none text-sm w-full text-slate-200 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl hover:bg-white/5 text-slate-400 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full bg-white/5 border border-white/10 hover:border-white/20 transition-all">
              <span className="text-sm font-medium px-2">Alex Rivera</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </button>
          </div>
        </header>

        {/* Dynamic Section Rendering */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-3xl font-bold font-outfit">Workspace Overview</h1>
                  <p className="text-slate-400 mt-1">Welcome back. Here's what's happening today.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-600/20">
                  <Plus size={20} />
                  New Analysis
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Users" value="24.8k" trend={12} icon={User} />
                <StatCard title="AI Operations" value="1.2M" trend={45} icon={Zap} />
                <StatCard title="Analysis Speed" value="142ms" trend={-8} icon={Sparkles} />
                <StatCard title="Revenue" value="$42,800" trend={22} icon={BarChart3} />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass p-8 rounded-2xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-lg">System Performance</h3>
                    <select className="bg-white/5 border border-white/10 text-xs rounded-lg px-3 py-1.5 outline-none">
                      <option>Last 7 days</option>
                      <option>Last 30 days</option>
                    </select>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }} 
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                        />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass p-8 rounded-2xl">
                  <h3 className="font-bold text-lg mb-6">AI Suggestions</h3>
                  <div className="space-y-4">
                    {suggestions.length > 0 ? suggestions.map((s, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                            <Zap size={16} />
                          </div>
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{s.type}</span>
                        </div>
                        <h4 className="font-semibold text-sm text-slate-200">{s.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{s.description}</p>
                      </div>
                    )) : (
                      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                        <Loader2 className="animate-spin mb-3" />
                        <p className="text-sm">Calculating insights...</p>
                      </div>
                    )}
                  </div>
                  <button className="w-full mt-6 py-2.5 border border-white/10 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 transition-all">
                    View All Insights
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="h-[calc(100vh-12rem)] flex flex-col glass rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                    <div className="p-4 bg-indigo-600/20 rounded-3xl mb-6">
                      <BrainCircuit size={48} className="text-indigo-400" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 font-outfit">How can I assist you today?</h2>
                    <p className="text-slate-400">Ask Lumina AI to analyze your workspace metrics, generate strategy proposals, or debug technical workflows.</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-2xl flex flex-col gap-1 ${
                        msg.role === 'user' 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <span className="text-[10px] opacity-50 self-end mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-6 border-t border-white/10 bg-black/20 backdrop-blur-xl">
                <div className="relative flex items-center gap-4">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Type a message or command..." 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 pr-16 outline-none focus:border-indigo-500/50 transition-all text-slate-200"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button className="p-2 text-slate-400 hover:text-white transition-colors">
                        <Sparkles size={18} />
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={handleSend}
                    disabled={!prompt.trim() || isTyping}
                    className="p-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 rounded-xl text-white transition-all shadow-lg shadow-indigo-600/20"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'analytics' || activeTab === 'insights') && (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center animate-pulse">
              <BarChart3 size={64} className="text-slate-800 mb-6" />
              <h2 className="text-xl font-bold text-slate-600">Modules loading...</h2>
              <p className="text-slate-500 mt-2 max-w-xs mx-auto">This section is being synchronized with your real-time data clusters.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
