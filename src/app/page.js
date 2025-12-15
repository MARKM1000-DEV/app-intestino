'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Check, X, Calendar, BarChart2, Trophy, Settings, 
  Droplets, Activity, Info, Trash2, LogIn, LogOut, AlertTriangle
} from 'lucide-react';

// ============================================================================
// COMPONENTE DE NOTIFICAÇÃO (TOAST) - NOVO!
// ============================================================================
const NotificationToast = ({ message, type, onClose }) => {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-gray-800';

  return (
    <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl text-white ${bgColor} animate-in slide-in-from-top-4 fade-in duration-300`}>
      {type === 'success' ? <Check className="w-5 h-5" /> : <Info className="w-5 h-5" />}
      <span className="font-medium text-sm">{message}</span>
    </div>
  );
};

// ============================================================================
// UI COMPONENTS
// ============================================================================
const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-200 ${onClick ? 'active:scale-95 cursor-pointer hover:shadow-md' : ''} ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = "", onClick, disabled }) => {
  const baseStyle = "w-full py-4 rounded-full font-semibold text-[17px] flex items-center justify-center transition-transform active:scale-95 duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  return (
    <button className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

// ============================================================================
// DATA & CONFIG
// ============================================================================
const BRISTOL_TYPES = [
  { id: 1, type: 1, label: "Tipo 1", desc: "Duros e separados", color: "bg-orange-100 text-orange-800" },
  { id: 2, type: 2, label: "Tipo 2", desc: "Salsicha encaroçada", color: "bg-orange-100 text-orange-800" },
  { id: 3, type: 3, label: "Tipo 3", desc: "Com rachaduras", color: "bg-green-100 text-green-800" },
  { id: 4, type: 4, label: "Tipo 4", desc: "Lisa e macia (Ideal)", color: "bg-green-100 text-green-800" }, 
  { id: 5, type: 5, label: "Tipo 5", desc: "Pedaços macios", color: "bg-yellow-100 text-yellow-800" },
  { id: 6, type: 6, label: "Tipo 6", desc: "Pastoso / Mole", color: "bg-yellow-100 text-yellow-800" },
  { id: 7, type: 7, label: "Tipo 7", desc: "Líquido total", color: "bg-red-100 text-red-800" },
];

const BADGES = [
  { id: 1, title: "Iniciante", icon: "🌱", desc: "Primeiro registro", condition: (logs) => logs.length >= 1 },
  { id: 2, title: "Consistente", icon: "🔥", desc: "3 registros seguidos", condition: (logs) => logs.length >= 3 },
  { id: 3, title: "Hidratado", icon: "💧", desc: "Meta de água batida", condition: () => false },
];

// ============================================================================
// LOGIN SCREEN
// ============================================================================
const LoginScreen = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email ou senha incorretos.");
      setLoading(false);
    } else {
      onLoginSuccess(data.session);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center text-blue-600 mb-4 text-3xl">💩</div>
          <h1 className="text-2xl font-bold text-gray-900">Bem-vindo</h1>
          <p className="text-gray-500 text-sm">Acesse seu diário de saúde.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Senha</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all" placeholder="••••••••" required />
          </div>
          {error && <p className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'} <LogIn className="ml-2 w-4 h-4" /></Button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE DE ALERTA DE CONSTIPAÇÃO
// ============================================================================
const StatusAlert = ({ daysWithout }) => {
  if (daysWithout < 2) return null; // Tudo ok

  const isCritical = daysWithout >= 3;

  return (
    <div className={`rounded-2xl p-4 mb-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 ${isCritical ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
      <div className={`p-2 rounded-full ${isCritical ? 'bg-red-100' : 'bg-yellow-100'}`}>
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-lg">{isCritical ? 'Alerta de Constipação' : 'Atenção'}</h3>
        <p className="text-sm opacity-90 leading-relaxed mt-1">
          {isCritical 
            ? `Você não registra uma evacuação há ${daysWithout} dias. É importante se hidratar e consumir fibras hoje.` 
            : `Faz ${daysWithout} dias desde seu último registro. Tudo bem?`}
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-VIEWS
// ============================================================================
const HomeView = ({ onLogClick, streak, userProfile, onOpenProfile, daysWithout }) => (
  <div className="space-y-6 pb-24 animate-in fade-in zoom-in duration-300">
    <div className="flex justify-between items-end px-2">
      <div>
        <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wide mb-1">Hoje</h2>
        <h1 className="text-3xl font-bold text-gray-900">Olá, Usuário</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="bg-white px-3 py-1 rounded-full border border-gray-200 font-bold text-orange-500 flex items-center shadow-sm">🔥 {streak}</div>
        <button onClick={onOpenProfile} className="p-2 bg-white rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"><Settings className="w-5 h-5" /></button>
      </div>
    </div>

    {/* Alerta Inteligente */}
    <StatusAlert daysWithout={daysWithout} />

    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-1">Registro Diário</h3>
        <p className="text-blue-100 text-sm mb-6">Como está sua saúde hoje?</p>
        <p className="font-medium text-lg mb-4">Foi ao banheiro?</p>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => onLogClick(true)} className="bg-white text-blue-700 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center"><Check className="w-5 h-5 mr-2" /> Sim</button>
          <button onClick={() => onLogClick(false)} className="bg-blue-800/50 text-white py-3 rounded-xl font-bold border border-white/10 active:scale-95 transition-transform flex items-center justify-center"><X className="w-5 h-5 mr-2" /> Não</button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3">
      <Card className="flex flex-col items-center justify-center py-6 gap-2">
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Activity className="w-5 h-5" /></div>
        <span className="text-2xl font-bold text-gray-900">Bristol 4</span>
        <span className="text-xs text-gray-500 font-medium">Média</span>
      </Card>
      <Card className="flex flex-col items-center justify-center py-6 gap-2" onClick={onOpenProfile}>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Droplets className="w-5 h-5" /></div>
        <span className="text-2xl font-bold text-gray-900">{(userProfile.waterGoal / 1000).toFixed(1)}L</span>
        <span className="text-xs text-gray-500 font-medium">Meta Água</span>
      </Card>
    </div>
  </div>
);

const LogFlow = ({ onComplete, onCancel, isSaving }) => {
  const [step, setStep] = useState(1);
  const [bristol, setBristol] = useState(4);
  const [effort, setEffort] = useState('normal');
  const handleNext = () => { if (step === 2) onComplete({ bristol, effort }); else setStep(2); };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="px-6 py-4 border-b flex justify-between items-center pt-8">
        <button onClick={onCancel} className="text-blue-600 font-medium" disabled={isSaving}>Cancelar</button>
        <span className="font-bold">Novo Registro</span><span className="w-16"></span>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {step === 1 ? (
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-center mb-6">Formato das fezes?</h2>
            {BRISTOL_TYPES.map((item) => (
              <div key={item.id} onClick={() => setBristol(item.type)} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all bg-white ${bristol === item.type ? 'border-blue-600 shadow-md ring-1 ring-blue-100' : 'border-transparent shadow-sm'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-4 ${item.color}`}>{item.type}</div>
                <div className="flex-1"><h4 className="font-bold text-gray-900">{item.label}</h4><p className="text-xs text-gray-500">{item.desc}</p></div>
                {bristol === item.type && <Check className="text-blue-600" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
             <h2 className="text-2xl font-bold text-center mb-6">Houve esforço?</h2>
             {[{id: 'none', label: 'Nenhum', emoji: '😌', color: 'green'},{id: 'normal', label: 'Algum', emoji: '😐', color: 'yellow'},{id: 'hard', label: 'Muito', emoji: '🥵', color: 'red'}].map(opt => (
                <div key={opt.id} onClick={() => setEffort(opt.id)} className={`bg-white p-5 rounded-xl border-2 flex items-center justify-between cursor-pointer ${effort === opt.id ? `border-${opt.color}-500 shadow-md` : 'border-transparent shadow-sm'}`}>
                  <span className="text-3xl mr-4">{opt.emoji}</span><span className="font-bold text-gray-900 flex-1">{opt.label}</span>{effort === opt.id && <Check className={`text-${opt.color}-600`} />}
                </div>
             ))}
          </div>
        )}
      </div>
      <div className="p-6 bg-white border-t pb-8"><Button onClick={handleNext} disabled={isSaving}>{isSaving ? 'Salvando...' : (step === 2 ? 'Salvar' : 'Continuar')}</Button></div>
    </div>
  );
};

const ProfileModal = ({ currentProfile, onSave, onCancel, isSaving }) => {
  const [age, setAge] = useState(currentProfile.age || '');
  const [weight, setWeight] = useState(currentProfile.weight || '');
  const [calculatedGoal, setCalculatedGoal] = useState(null);

  useEffect(() => {
    if (age && weight) {
      let mlPerKg = 35;
      const ageNum = parseInt(age);
      const weightNum = parseFloat(weight);
      if (ageNum <= 30) mlPerKg = 40; else if (ageNum > 55) mlPerKg = 30;
      setCalculatedGoal(Math.round(weightNum * mlPerKg));
    }
  }, [age, weight]);

  const handleLogout = async () => { await supabase.auth.signOut(); window.location.reload(); };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
      <div className="px-6 py-4 border-b flex justify-between items-center pt-8">
        <button onClick={onCancel} className="text-blue-600 font-medium">Cancelar</button>
        <span className="font-bold">Meu Perfil</span>
        <button onClick={() => onSave({ age, weight, waterGoal: calculatedGoal || 2000 })} className="text-blue-600 font-bold" disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
      <div className="p-6 space-y-6 bg-gray-50 flex-1">
        <Card className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Idade</label><input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="Ex: 30"/></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label><input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200" placeholder="Ex: 70"/></div>
        </Card>
        {calculatedGoal && (
          <Card className="bg-blue-50 border-blue-100 flex flex-col items-center text-center p-6 animate-in fade-in">
            <span className="text-xs font-bold text-blue-600 uppercase">Meta Recomendada</span>
            <div className="text-4xl font-bold text-blue-600 mb-1">{(calculatedGoal / 1000).toFixed(1)}L</div>
            <p className="text-blue-400 text-sm">Diários</p>
          </Card>
        )}
        <div className="pt-8 border-t"><button onClick={handleLogout} className="w-full py-4 text-red-500 font-medium flex items-center justify-center bg-red-50 rounded-xl hover:bg-red-100 transition-colors"><LogOut className="w-5 h-5 mr-2" /> Sair do App</button></div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================
export default function Home() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home');
  const [showLogModal, setShowLogModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [streak, setStreak] = useState(0);
  const [userProfile, setUserProfile] = useState({ age: '', weight: '', waterGoal: 2000 });
  const [history, setHistory] = useState([]);
  const [daysWithout, setDaysWithout] = useState(0);
  
  // NOVO ESTADO: Notificação
  const [notification, setNotification] = useState(null);

  // --- FUNÇÃO DE NOTIFICAÇÃO ---
  const showToast = (msg, type = 'normal') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000); // Some em 3 segundos
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) { fetchData(); } }, [session]);

  const fetchData = async () => { await Promise.all([fetchLogs(), fetchProfile()]); };

  const fetchLogs = async () => {
    const { data } = await supabase.from('logs').select('*').order('created_at', { ascending: false });
    if (data) { 
      setHistory(data); 
      setStreak(data.length); 
      calculateConstipation(data); 
    }
  };

  const calculateConstipation = (logs) => {
    const lastPoopLog = logs.find(log => log.type === 'log');
    if (lastPoopLog) {
      const diffTime = Math.abs(new Date() - new Date(lastPoopLog.created_at));
      setDaysWithout(Math.floor(diffTime / (1000 * 60 * 60 * 24))); 
    } else { setDaysWithout(0); }
  };

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    if (data) { setUserProfile({ age: data.age, weight: data.weight, waterGoal: data.water_goal }); }
  };

  const handleSaveProfile = async (newProfile) => {
    setIsSaving(true);
    const { error } = await supabase.from('profiles').upsert({ id: session.user.id, age: newProfile.age, weight: newProfile.weight, water_goal: newProfile.waterGoal });
    if (!error) { 
        setUserProfile(newProfile); 
        setShowProfileModal(false); 
        showToast("Perfil atualizado!", "success");
    } else { alert("Erro ao salvar perfil."); }
    setIsSaving(false);
  };

  const handleLogClick = async (didPoop) => {
    if (didPoop) { setShowLogModal(true); } else {
      setIsSaving(true);
      const logData = { date_display: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' }), type: 'skipped', user_id: session.user.id };
      await supabase.from('logs').insert([logData]);
      await fetchLogs();
      setIsSaving(false);
      // Feedback Visual Aqui:
      showToast("Anotado! Lembre de beber água. 💧", "info");
    }
  };

  const handleSaveFullLog = async (data) => {
    setIsSaving(true);
    const logData = { date_display: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' }), type: 'log', bristol: data.bristol, effort: data.effort, user_id: session.user.id };
    await supabase.from('logs').insert([logData]);
    await fetchLogs();
    setShowLogModal(false);
    setIsSaving(false);
    showToast("Registro salvo com sucesso!", "success");
  };

  const handleDeleteLog = async (id) => {
    if (confirm("Tem certeza que deseja apagar este registro?")) {
      const { error } = await supabase.from('logs').delete().eq('id', id);
      if (!error) { 
          await fetchLogs(); 
          showToast("Registro apagado.", "info");
      } else alert("Erro ao deletar.");
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!session) return <LoginScreen onLoginSuccess={(s) => setSession(s)} />;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center text-gray-900 font-sans">
      {/* TOAST FLUTUANTE */}
      {notification && <NotificationToast message={notification.msg} type={notification.type} />}

      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        <main className="flex-1 overflow-y-auto pt-10 px-4 scrollbar-hide pb-28">
          {view === 'home' && <HomeView streak={streak} userProfile={userProfile} onLogClick={handleLogClick} onOpenProfile={() => setShowProfileModal(true)} daysWithout={daysWithout} />}
          {view === 'stats' && (
            <div className="space-y-4 animate-in fade-in">
              <h1 className="text-2xl font-bold px-2">Histórico</h1>
              {history.length === 0 ? <div className="text-center p-12 text-gray-400 border-2 border-dashed rounded-3xl"><p>Vazio.</p></div> : (
                <div className="space-y-3">
                  {history.map(log => (
                    <Card key={log.id} className={`flex items-center justify-between ${log.type === 'skipped' ? 'border-l-4 border-gray-300' : 'border-l-4 border-blue-500'}`}>
                      <div className="flex-1"><p className="text-xs text-gray-400 font-bold uppercase">{log.date_display}</p>{log.type === 'skipped' ? <p className="font-bold text-gray-500">Não foi</p> : (<div className="flex items-center gap-2"><span className="font-bold text-lg text-gray-900">Tipo {log.bristol}</span>{log.effort === 'hard' && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">ESFORÇO</span>}</div>)}</div>
                      <div className="flex items-center gap-4"><div className="text-2xl">{log.type === 'skipped' ? '😶' : (log.bristol >= 3 && log.bristol <= 5 ? '🙂' : '⚠️')}</div><button onClick={(e) => { e.stopPropagation(); handleDeleteLog(log.id); }} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 className="w-5 h-5" /></button></div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          {view === 'awards' && (<div className="space-y-6 animate-in fade-in"><div className="px-2"><h1 className="text-3xl font-bold text-gray-900">Conquistas</h1></div><div className="grid grid-cols-2 gap-4">{BADGES.map((badge) => { const unlocked = badge.condition(history); return (<Card key={badge.id} className={`flex flex-col items-center text-center gap-3 ${!unlocked ? 'opacity-50 grayscale bg-gray-50' : ''}`}><div className="text-5xl">{badge.icon}</div><h3 className="font-bold text-sm">{badge.title}</h3>{unlocked && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">DESBLOQUEADO</span>}</Card>)})}</div></div>)}
        </main>
        <nav className="border-t bg-white/95 backdrop-blur pb-8 pt-2 px-6 flex justify-between z-40 absolute bottom-0 w-full shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
           <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 w-16 transition-all ${view === 'home' ? 'text-blue-600' : 'text-gray-400'}`}><Calendar className="w-6 h-6" /><span className="text-[10px] font-medium">Hoje</span></button>
           <button onClick={() => setView('stats')} className={`flex flex-col items-center gap-1 w-16 transition-all ${view === 'stats' ? 'text-blue-600' : 'text-gray-400'}`}><BarChart2 className="w-6 h-6" /><span className="text-[10px] font-medium">Histórico</span></button>
           <button onClick={() => setView('awards')} className={`flex flex-col items-center gap-1 w-16 transition-all ${view === 'awards' ? 'text-blue-600' : 'text-gray-400'}`}><Trophy className="w-6 h-6" /><span className="text-[10px] font-medium">Prêmios</span></button>
        </nav>
        {showLogModal && <LogFlow onComplete={handleSaveFullLog} onCancel={() => setShowLogModal(false)} isSaving={isSaving} />}
        {showProfileModal && <ProfileModal currentProfile={userProfile} onSave={handleSaveProfile} onCancel={() => setShowProfileModal(false)} isSaving={isSaving} />}
      </div>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}