
import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [email, setEmail] = useState('saiful.uiux@gmail.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-[50%] h-full bg-orange-50 -z-10 rounded-l-[200px] transform translate-x-20"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-orange-200 rounded-full blur-[80px] -z-10"></div>
      <div className="absolute top-40 left-[15%] w-24 h-24 bg-purple-100 rounded-full blur-[60px] -z-10"></div>

      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
        {/* Left Side: Branding/Welcome */}
        <div className="p-12 lg:p-16 bg-gray-900 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full transform -translate-y-10 translate-x-10 blur-3xl"></div>
          
          <div className="space-y-4 relative z-10">
             <button 
               onClick={onBackToLanding}
               className="flex items-center space-x-2 text-orange-400 font-bold text-sm hover:text-orange-300 transition-colors mb-12"
             >
               <ArrowLeft size={16} />
               <span>Back to Marketplace</span>
             </button>
             
             <div className="flex items-center space-x-2 mb-8">
               <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-orange-500/20">
                 M
               </div>
               <span className="text-2xl font-black tracking-tight">MarketCordi<span className="text-orange-500">.</span></span>
             </div>

             <h1 className="text-4xl font-black leading-tight tracking-tighter">
                Control your business with <span className="text-orange-500">precision</span>.
             </h1>
             <p className="text-gray-400 font-medium">
                The ultimate administrative dashboard for Cordillera's growing merchant network.
             </p>
          </div>

          <div className="pt-12 relative z-10">
             <div className="flex items-center space-x-4 mb-8">
                <div className="flex -space-x-3">
                   {[1,2,3].map(i => (
                     <img key={i} src={`https://picsum.photos/seed/${i+10}/50/50`} className="w-10 h-10 rounded-full border-2 border-gray-900" alt="Avatar" />
                   ))}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Joined by 200+ partners</p>
             </div>
             
             <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center space-x-4">
                <div className="bg-orange-500/20 p-2 rounded-lg text-orange-500">
                   <ShieldCheck size={20} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed tracking-wider">
                   Secured by enterprise-grade <br/> Cordi-Guard™ Protocols
                </p>
             </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Welcome Back</h2>
            <p className="text-gray-500 text-sm font-medium">Please enter your administrative credentials.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest block pl-1">Admin Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800"
                  placeholder="admin@marketcordi.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center pl-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest block">Password</label>
                <a href="#" className="text-xs font-bold text-orange-500 hover:text-orange-600">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 mb-4">
               <input type="checkbox" id="remember" className="w-4 h-4 accent-orange-500 rounded border-gray-300 focus:ring-orange-500" />
               <label htmlFor="remember" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Stay logged in for 30 days</label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl hover:bg-orange-500 transition-all shadow-xl shadow-gray-200 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign into Dashboard</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">
                Problems signing in? <br/> Contact <a href="mailto:support@marketcordi.com" className="text-orange-500 hover:underline">MarketCordi Tech Support</a>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
