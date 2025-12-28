
import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, ShoppingBag, Utensils, Star, Phone, Instagram, 
  Facebook, Twitter, ChevronRight, ArrowLeft, Filter, CheckCircle2, 
  Store, Rocket, BarChart3, ShieldCheck, Mail, User, Building, Globe,
  Send, MessageSquare, Headphones, Loader2
} from 'lucide-react';
import { RESTAURANTS, CATEGORIES } from '../constants';

interface LandingPageProps {
  onLoginClick: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick }) => {
  const [view, setView] = useState<'home' | 'partners' | 'become-partner' | 'contact'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || 
                             restaurant.cuisineType.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setContactSubmitted(true);
    }, 1500);
  };

  const renderHome = () => (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-orange-50 -z-10 rounded-l-[100px] opacity-50 transform translate-x-20"></div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-[fadeIn_0.5s_ease-out]">
            <div className="inline-flex items-center space-x-2 bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Now Serving Cordillera Region
            </div>
            <h1 className="text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tighter">
              Get your favorite <span className="text-orange-500">food</span> delivered at your door.
            </h1>
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed">
              Order from the best local restaurants and stores in the city. Fast delivery and real-time tracking at your fingertips.
            </p>
            
            <div className="max-w-md">
              <div className="relative flex items-center bg-white border-2 border-gray-100 p-2 rounded-full shadow-2xl focus-within:border-orange-200 transition-all">
                <div className="pl-4 pr-2 text-gray-400">
                  <MapPin size={20} />
                </div>
                <input 
                  type="text" 
                  placeholder="Enter your delivery address..."
                  className="w-full py-3 text-sm font-medium focus:outline-none"
                />
                <button className="bg-gray-900 text-white font-bold px-8 py-3 rounded-full hover:bg-orange-500 transition-all whitespace-nowrap">
                  Find Food
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-8 pt-4">
               <div>
                 <p className="text-3xl font-black text-gray-900">500+</p>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Partners</p>
               </div>
               <div className="h-10 w-px bg-gray-200"></div>
               <div>
                 <p className="text-3xl font-black text-gray-900">10k+</p>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Deliveries</p>
               </div>
               <div className="h-10 w-px bg-gray-200"></div>
               <div>
                 <p className="text-3xl font-black text-gray-900">4.8</p>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">App Rating</p>
               </div>
            </div>
          </div>
          
          <div className="relative animate-[fadeIn_0.7s_ease-out]">
            <div className="aspect-square bg-gradient-to-br from-orange-400 to-orange-600 rounded-[60px] transform rotate-6 animate-pulse opacity-10 absolute inset-0 -z-10"></div>
            <img 
              src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=1000" 
              alt="Food delivery"
              className="rounded-[60px] shadow-2xl object-cover h-[500px] w-full"
            />
            
            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-2xl border border-gray-50 animate-bounce-slow">
               <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-2xl text-green-600">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">Order Successful</p>
                    <p className="text-xs font-bold text-gray-400">Arriving in 15 mins</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">What are you craving for?</h2>
          <p className="text-gray-500 mb-12">Browse our diverse categories and find your mood</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {CATEGORIES.filter(c => c.id !== 'all').map(category => (
              <button 
                key={category.id} 
                onClick={() => {
                    setActiveCategory(category.id);
                    setView('partners');
                }}
                className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-orange-500 hover:shadow-xl hover:shadow-orange-500/5 transition-all group flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-4 border-orange-50 group-hover:border-orange-500 transition-colors shadow-sm">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <p className="font-black text-gray-800 tracking-tight text-sm uppercase">{category.name}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Popular Restaurants</h2>
              <p className="text-gray-500 mt-2">Highly rated local favorites chosen for you</p>
            </div>
            <button 
              onClick={() => setView('partners')}
              className="flex items-center space-x-2 text-orange-500 font-bold hover:text-orange-600 transition-colors"
            >
              <span>View all partners</span>
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESTAURANTS.slice(0, 6).map(restaurant => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </section>
    </>
  );

  const renderPartners = () => (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-7xl mx-auto px-4">
        <button 
            onClick={() => {
                setView('home');
                setActiveCategory('all');
                setSearchQuery('');
            }}
            className="flex items-center space-x-2 text-gray-600 font-bold hover:text-orange-500 transition-colors mb-8 group"
        >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Our Restaurant Partners</h1>
                <p className="text-gray-500 mt-2">Discover {filteredRestaurants.length} amazing food places in Cordillera</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search restaurants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all text-sm font-medium w-full sm:w-80 shadow-sm"
                    />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            <button 
                onClick={() => setActiveCategory('all')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                    activeCategory === 'all' 
                    ? 'bg-orange-500 text-white shadow-xl shadow-orange-200' 
                    : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                }`}
            >
                All Cuisines
            </button>
            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                        activeCategory === cat.id 
                        ? 'bg-orange-500 text-white shadow-xl shadow-orange-200' 
                        : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        {filteredRestaurants.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredRestaurants.map(restaurant => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
            </div>
        ) : (
            <div className="py-20 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Search size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">No partners found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or filters to find what you're craving.</p>
                <button 
                    onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                    }}
                    className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-500 transition-all"
                >
                    Clear All Filters
                </button>
            </div>
        )}
      </div>
    </section>
  );

  const renderBecomePartner = () => (
    <section className="pt-32 pb-20 min-h-screen bg-white animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-12">
            <div>
                <button 
                    onClick={() => setView('home')}
                    className="flex items-center space-x-2 text-gray-500 font-bold hover:text-orange-500 transition-colors mb-6 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
                <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                    Grow your business with <span className="text-orange-500">MarketCordi</span>.
                </h1>
                <p className="text-gray-500 text-lg mt-6 leading-relaxed max-w-xl">
                    Join over 500+ successful partners in the Cordillera region. From small stalls to major restaurants, we provide the tools to reach thousands of customers daily.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                        <Rocket size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight">Boost Sales</h3>
                    <p className="text-gray-500 text-sm">Tap into our massive customer base and see your daily revenue grow significantly.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <BarChart3 size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight">Smart Analytics</h3>
                    <p className="text-gray-500 text-sm">Access real-time data on your best-selling items and busy hours with our Merchant Dashboard.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight">Secure Payments</h3>
                    <p className="text-gray-500 text-sm">Never worry about cash handling. All payments are processed securely and paid out on time.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <Globe size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight">Local Reach</h3>
                    <p className="text-gray-500 text-sm">We specialize in the Cordillera region, understanding local logistics better than anyone else.</p>
                </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-[40px] border border-gray-100">
                <div className="flex items-center space-x-6">
                    <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => (
                            <img key={i} src={`https://picsum.photos/seed/p${i}/100/100`} className="w-14 h-14 rounded-full border-4 border-white object-cover shadow-lg" alt="" />
                        ))}
                    </div>
                    <div>
                        <p className="text-gray-900 font-black text-lg tracking-tight">Trusted by 500+ local merchants</p>
                        <p className="text-gray-500 text-sm font-medium">Be part of the region's fastest growing delivery network.</p>
                    </div>
                </div>
            </div>
          </div>

          <div className="relative">
            {submitted ? (
                <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-50 text-center animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">Application Sent!</h2>
                    <p className="text-gray-500 leading-relaxed mb-8">
                        Thank you for your interest in joining MarketCordi. Our onboarding team will contact you within 24-48 hours to discuss the next steps.
                    </p>
                    <button 
                        onClick={() => setView('home')}
                        className="w-full bg-gray-900 text-white font-black py-4 rounded-3xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-200"
                    >
                        Return to Homepage
                    </button>
                </div>
            ) : (
                <div className="bg-white p-10 lg:p-12 rounded-[50px] shadow-2xl border border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter">Merchant Application</h2>
                    <form onSubmit={handlePartnerSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Business Name</label>
                                <div className="relative group">
                                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input required type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="e.g. Cordillera Grills" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Business Type</label>
                                <select className="w-full px-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800 appearance-none cursor-pointer">
                                    <option>Restaurant</option>
                                    <option>Grocery Store</option>
                                    <option>Pharmacy</option>
                                    <option>Boutique</option>
                                    <option>Accommodations</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Contact Person</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input required type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="Full Name" />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input required type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="contact@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input required type="tel" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="+63 900 000 0000" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input required type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="Baguio, Benguet, etc." />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl hover:bg-orange-500 transition-all shadow-2xl shadow-gray-200 active:translate-y-1 flex items-center justify-center space-x-3 disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <span>Submit Application</span>
                                )}
                            </button>
                            <p className="text-[10px] text-center text-gray-400 mt-6 font-bold uppercase tracking-widest">
                                By clicking submit, you agree to our <a href="#" className="text-orange-500">Merchant Terms</a>
                            </p>
                        </div>
                    </form>
                </div>
            )}
            
            <div className="absolute -z-10 -top-20 -right-20 w-64 h-64 bg-orange-100 rounded-full blur-[100px] opacity-60"></div>
            <div className="absolute -z-10 -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderContact = () => (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 animate-[fadeIn_0.3s_ease-out]">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
                <button 
                    onClick={() => setView('home')}
                    className="inline-flex items-center space-x-2 text-gray-500 font-bold hover:text-orange-500 transition-colors mb-4 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Home</span>
                </button>
                <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter">
                    We're here to <span className="text-orange-500">help</span> you.
                </h1>
                <p className="text-lg text-gray-500 font-medium">
                    Have questions about our service? Want to know more about our partners? Or maybe you just want to say hi? Reach out to us.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-20">
                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <Headphones size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Global Support</h3>
                    <p className="text-gray-500 text-sm font-medium mb-6">Our team is available 24/7 to assist you with any delivery issues.</p>
                    <div className="space-y-3">
                        <a href="mailto:support@marketcordi.com" className="flex items-center space-x-3 text-orange-500 font-bold hover:underline">
                            <Mail size={16} />
                            <span>support@marketcordi.com</span>
                        </a>
                        <p className="flex items-center space-x-3 text-gray-600 font-bold">
                            <Phone size={16} />
                            <span>+63 900 000 0000</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Building size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Partner Relations</h3>
                    <p className="text-gray-500 text-sm font-medium mb-6">Interested in listing your business? Talk to our merchant success team.</p>
                    <div className="space-y-3">
                        <a href="mailto:partners@marketcordi.com" className="flex items-center space-x-3 text-blue-500 font-bold hover:underline">
                            <Mail size={16} />
                            <span>partners@marketcordi.com</span>
                        </a>
                        <p className="flex items-center space-x-3 text-gray-600 font-bold">
                            <Phone size={16} />
                            <span>+63 900 111 2222</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                    <div className="w-16 h-16 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                        <MapPin size={32} />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">Headquarters</h3>
                    <p className="text-gray-500 text-sm font-medium mb-6">Visit our main office located in the heart of the Cordilleras.</p>
                    <div className="space-y-3">
                        <p className="flex items-center space-x-3 text-gray-600 font-bold">
                            <MapPin size={16} />
                            <span>Baguio City, Benguet, Philippines</span>
                        </p>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-7">Open: Mon - Fri, 9AM - 6PM</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
                <div className="bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100">
                    <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Send us a message</h2>
                    {contactSubmitted ? (
                         <div className="text-center py-12 animate-[fadeIn_0.5s_ease-out]">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Message Received</h3>
                            <p className="text-gray-500 font-medium">We'll get back to you as soon as possible!</p>
                            <button onClick={() => setContactSubmitted(false)} className="mt-8 text-orange-500 font-bold hover:underline">Send another message</button>
                         </div>
                    ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Your Name</label>
                                    <input required type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                    <input required type="email" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="john@example.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Subject</label>
                                <input required type="text" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800" placeholder="How can we help?" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Message</label>
                                <textarea required rows={5} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 focus:border-orange-500 outline-none transition-all font-medium text-gray-800 resize-none" placeholder="Tell us more about your inquiry..."></textarea>
                            </div>
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl hover:bg-orange-500 transition-all shadow-xl shadow-gray-200 active:translate-y-1 flex items-center justify-center space-x-3 disabled:opacity-70"
                            >
                                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <><Send size={20} /> <span>Send Message</span></>}
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-12 lg:pt-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter">Connect with our Partners</h2>
                        <p className="text-gray-500 font-medium mb-8">You can also reach out directly to our merchant partners for specific inquiries regarding their products or locations.</p>
                        
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 scrollbar-hide">
                            {RESTAURANTS.map(restaurant => (
                                <div key={restaurant.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-orange-200 transition-all">
                                    <div className="flex items-center space-x-4">
                                        <img src={restaurant.image} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                        <div>
                                            <p className="font-black text-gray-900">{restaurant.name}</p>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{restaurant.ownerName}</p>
                                        </div>
                                    </div>
                                    <a href={`mailto:${restaurant.ownerEmail}`} className="p-3 bg-gray-50 text-gray-400 rounded-xl group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                                        <Mail size={20} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-orange-500 p-10 rounded-[40px] text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight">Need a faster response?</h3>
                        <p className="text-white/80 font-medium mb-8">Chat with our AI-powered assistant or talk to a live agent through our mobile app.</p>
                        <button className="bg-white text-orange-600 font-black px-8 py-3 rounded-2xl hover:bg-orange-50 transition-all flex items-center space-x-2">
                            <MessageSquare size={18} />
                            <span>Launch Live Chat</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-orange-100 selection:text-orange-600">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-orange-200">
              M
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight">Market<span className="text-orange-500">Cordi</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
            <button onClick={() => setView('home')} className={`hover:text-orange-500 transition-colors ${view === 'home' ? 'text-orange-500' : ''}`}>Home</button>
            <button onClick={() => setView('partners')} className={`hover:text-orange-500 transition-colors ${view === 'partners' ? 'text-orange-500' : ''}`}>Restaurants</button>
            <button onClick={() => setView('become-partner')} className={`hover:text-orange-500 transition-colors ${view === 'become-partner' ? 'text-orange-500' : ''}`}>Become a Partner</button>
            <button onClick={() => setView('contact')} className={`hover:text-orange-500 transition-colors ${view === 'contact' ? 'text-orange-500' : ''}`}>Contact</button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="text-gray-900 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              Merchant Login
            </button>
            <button 
                onClick={() => setView('partners')}
                className="bg-orange-500 text-white font-bold text-sm px-8 py-2.5 rounded-full shadow-xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Order Online
            </button>
          </div>
        </div>
      </nav>

      {view === 'home' && renderHome()}
      {view === 'partners' && renderPartners()}
      {view === 'become-partner' && renderBecomePartner()}
      {view === 'contact' && renderContact()}

      {/* Footer */}
      <footer className="bg-gray-900 pt-20 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl italic">
                M
              </div>
              <span className="text-2xl font-black tracking-tight">MarketCordi</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Serving the Cordillera region with the freshest food and fastest delivery. Supporting local businesses one order at a time.
            </p>
            <div className="flex space-x-4">
               <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-500 transition-all"><Facebook size={20} /></a>
               <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-500 transition-all"><Instagram size={20} /></a>
               <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-500 transition-all"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 tracking-tight">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={onLoginClick} className="hover:text-white transition-colors">Merchant Login</button></li>
              <li><button onClick={() => setView('become-partner')} className="hover:text-white transition-colors">Become a Partner</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 tracking-tight">Help & Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-bold">
              <li><a href="#" className="hover:text-white transition-colors">Customer Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 tracking-tight">Download App</h4>
            <div className="space-y-4">
              <button className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-4 hover:bg-white/10 transition-all text-left">
                 <Phone size={24} className="text-orange-500" />
                 <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400">Available on</p>
                   <p className="text-sm font-black">App Store</p>
                 </div>
              </button>
              <button className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-4 hover:bg-white/10 transition-all text-left">
                 <Phone size={24} className="text-orange-500" />
                 <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400">Get it on</p>
                   <p className="text-sm font-black">Google Play</p>
                 </div>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-500 text-xs font-bold">© 2024 MarketCordi Logistics Inc. All rights reserved.</p>
           <div className="flex items-center space-x-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span>English</span>
              <span>Philippines</span>
           </div>
        </div>
      </footer>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const RestaurantCard: React.FC<{ restaurant: any }> = ({ restaurant }) => (
  <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all group">
    <div className="h-64 overflow-hidden relative">
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center space-x-1 shadow-lg">
        <Star size={14} className="text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-black text-gray-900">{restaurant.rating}</span>
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Free Delivery</span>
        <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">15-20 min</span>
      </div>
    </div>
    <div className="p-8">
      <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 truncate">{restaurant.name}</h3>
      <p className="text-sm text-gray-500 mb-4 flex items-center truncate">
        <MapPin size={14} className="mr-1.5 text-orange-500" />
        {restaurant.address}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{restaurant.cuisineType}</span>
        <button className="text-orange-500 font-black text-sm uppercase tracking-wider hover:translate-x-1 transition-transform flex items-center">
          Order Now <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  </div>
);

export default LandingPage;
