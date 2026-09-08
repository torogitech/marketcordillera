import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, MapPin, ShoppingBag, Utensils, Star, Phone, Instagram, 
  Facebook, Twitter, ChevronRight, ArrowLeft, Filter, CheckCircle2, 
  Store, Rocket, BarChart3, ShieldCheck, Mail, User, Building, Globe,
  Send, MessageSquare, Headphones, Loader2, Package, ShoppingCart,
  Heart, Plus, Flame, Info, AlertTriangle, Clock, Navigation, ExternalLink,
  Megaphone, Tag, ArrowRight
} from 'lucide-react';
import { RESTAURANTS, CATEGORIES, PRODUCTS, STORES } from '../constants';
import { Product, Store as StoreType, StoreStatus, Ad } from '../types';

interface LandingPageProps {
  onLoginClick: () => void;
  ads: Ad[];
}

const STORE_CATEGORIES = [
  { id: 'all', name: 'All Stores' },
  { id: 'Grocery', name: 'Grocery' },
  { id: 'Electronics', name: 'Electronics' },
  { id: 'Pharmacy', name: 'Pharmacy' },
  { id: 'Boutique', name: 'Boutique' },
  { id: 'General', name: 'General Supply' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onLoginClick, ads }) => {
  const [view, setView] = useState<'home' | 'partners' | 'become-partner' | 'contact' | 'products' | 'store-location'>('home');
  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Dynamic partner calculation
  const totalPartners = RESTAURANTS.length + STORES.length;

  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           restaurant.cuisineType.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || 
                             restaurant.cuisineType.toLowerCase().includes(activeCategory.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const filteredStores = useMemo(() => {
    return STORES.filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           store.address.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || store.type === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Display Switch Logic: Strictly show only 'Active' campaigns targeting 'Store'
  const activeStoreAds = useMemo(() => {
    return ads.filter(ad => ad.status === 'Active' && ad.targetType === 'Store');
  }, [ads]);

  // Strictly show only 'Active' campaigns targeting 'Restaurant'
  const activeRestaurantAds = useMemo(() => {
    return ads.filter(ad => ad.status === 'Active' && ad.targetType === 'Restaurant');
  }, [ads]);

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

  const handleViewLocation = (store: StoreType) => {
    setSelectedStore(store);
    setView('store-location');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-medium">
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
                 <p className="text-3xl font-black text-gray-900">{totalPartners}</p>
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

      {/* Store Partners Section - Strictly Store-targeted active ads */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Store Partners <span className="text-orange-500">.</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">Explore exclusive deals and featured offerings from our highly-rated network of local merchants.</p>
          </div>
          
          {activeStoreAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {activeStoreAds.map(ad => (
                <CampaignFeaturedCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm max-w-2xl mx-auto">
               <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 shadow-inner">
                  <Megaphone size={48} />
               </div>
               <h3 className="text-2xl font-black text-gray-900">Highland Harvest Incoming</h3>
               <p className="text-gray-400 mt-2 font-medium">No active store partner campaigns right now. New regional retail offers are added every Monday.</p>
               <button 
                  onClick={() => setView('products')}
                  className="mt-8 text-orange-500 font-bold uppercase text-xs tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"
                >
                  View All Stores <ArrowRight size={16} />
               </button>
            </div>
          )}

          <div className="mt-20 text-center">
            <button 
              onClick={() => setView('products')}
              className="px-12 py-5 bg-gray-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-orange-500 transition-all shadow-2xl shadow-gray-200 active:scale-95"
            >
              Explore Full Merchant Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section - Strictly featuring active restaurant campaigns from ads manager */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Popular Restaurants</h2>
              <p className="text-gray-500 mt-2 font-medium">Strictly featuring featured restaurant campaigns from our partner network.</p>
            </div>
            <button 
              onClick={() => setView('partners')}
              className="flex items-center space-x-2 text-orange-500 font-bold hover:text-orange-600 transition-colors"
            >
              <span>View all partners</span>
              <ChevronRight size={20} />
            </button>
          </div>

          {activeRestaurantAds.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {activeRestaurantAds.map(ad => (
                <CampaignFeaturedCard key={ad.id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
               <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm">
                  <Utensils size={32} />
               </div>
               <h3 className="text-xl font-black text-gray-900">No Active Restaurant Campaigns</h3>
               <p className="text-gray-400 mt-2 font-medium">Check back soon for new gourmet offers and highland delicacies.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );

  const renderProducts = () => (
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
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Explore Stores</h1>
                <p className="text-gray-500 mt-2">Find the best local shops and retail partners in Cordillera</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search stores..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-50 transition-all text-sm font-medium w-full sm:w-80 shadow-sm"
                    />
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {STORE_CATEGORIES.map(cat => (
                <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                        activeCategory === cat.id 
                        ? 'bg-gray-900 text-white shadow-xl shadow-gray-200' 
                        : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
                    }`}
                >
                    {cat.name}
                </button>
            ))}
        </div>

        {filteredStores.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredStores.map(store => (
                    <StoreItemCard key={store.id} store={store} onViewLocation={() => handleViewLocation(store)} />
                ))}
            </div>
        ) : (
            <div className="py-20 text-center bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Store size={40} />
                </div>
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">No stores found</h3>
                <p className="text-gray-500 mt-2">Try adjusting your search or category selection.</p>
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

  const renderStoreLocation = () => (
    <section className="pt-32 pb-20 min-h-screen bg-gray-50 animate-[fadeIn_0.3s_ease-out]">
      <div className="max-w-7xl mx-auto px-4">
        <button 
          onClick={() => setView('products')}
          className="flex items-center space-x-2 text-gray-600 font-bold hover:text-orange-500 transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Explore Stores</span>
        </button>

        {selectedStore && (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <div className="bg-white p-4 rounded-[3rem] shadow-xl border border-gray-100 h-[600px] relative overflow-hidden">
                <StoreLocationMap store={selectedStore} />
                <div className="absolute bottom-10 left-10 z-20">
                  <div className="bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl border border-white shadow-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Navigation size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Target Coordinates</p>
                      <p className="text-sm font-black text-gray-900">{selectedStore.lat?.toFixed(4)}, {selectedStore.lng?.toFixed(4)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                
                <div className="aspect-video w-full rounded-[2rem] overflow-hidden mb-8 border-4 border-gray-50">
                  <img src={selectedStore.image} className="w-full h-full object-cover" alt={selectedStore.name} />
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2 block">Merchant Name</span>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic leading-tight">{selectedStore.name}</h2>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0 shadow-inner">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Physical Address</span>
                      <p className="text-sm font-bold text-gray-800 leading-relaxed">{selectedStore.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0 shadow-inner">
                      <User size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Store Manager</span>
                      <p className="text-sm font-bold text-gray-800">{selectedStore.ownerName}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                    <a href={`tel:${selectedStore.ownerPhone}`} className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-3xl hover:bg-orange-50 transition-colors group">
                      <Phone size={20} className="text-gray-400 group-hover:text-orange-500 mb-2" />
                      <span className="text-[9px] font-black uppercase text-gray-400 group-hover:text-orange-600">Contact</span>
                    </a>
                    <button className="flex items-center justify-center p-4 bg-gray-900 text-white rounded-3xl hover:bg-orange-600 transition-colors shadow-lg">
                      <ExternalLink size={20} className="mb-2" />
                      <span className="text-[9px] font-black uppercase">Directions</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform group-hover:scale-150 transition-transform"></div>
                <h4 className="text-xl font-black mb-2 tracking-tight">Open for delivery!</h4>
                <p className="text-white/80 text-sm font-medium mb-6 leading-relaxed">Orders placed from this location typically arrive in <span className="font-black underline italic">25-30 mins</span>.</p>
                <button className="w-full bg-white text-orange-600 font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-orange transition-all flex items-center justify-center gap-2">
                  <ShoppingCart size={18} /> Order Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
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
                <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">Our Restaurant Partners</h1>
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
                        className="pl-12 pr-4 py-3.5 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-50 transition-all text-sm font-medium w-full sm:w-80 shadow-sm"
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
                <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter italic">
                    Grow your business with <span className="text-orange-500">Mossy Market</span>.
                </h1>
                <p className="text-gray-500 text-lg mt-6 leading-relaxed max-w-xl font-medium">
                    Join over {totalPartners} successful partners in the Cordillera region. From small stalls to major restaurants, we provide the tools to reach thousands of customers daily.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                        <Rocket size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight uppercase">Boost Sales</h3>
                    <p className="text-gray-500 text-sm font-medium">Tap into our massive customer base and see your daily revenue grow significantly.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <BarChart3 size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight uppercase">Smart Analytics</h3>
                    <p className="text-gray-500 text-sm font-medium">Access real-time data on your best-selling items and busy hours with our Merchant Dashboard.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight uppercase">Secure Payments</h3>
                    <p className="text-gray-500 text-sm font-medium">Never worry about cash handling. All payments are processed securely and paid out on time.</p>
                </div>
                <div className="space-y-4">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <Globe size={24} />
                    </div>
                    <h3 className="font-black text-gray-900 tracking-tight uppercase">Local Reach</h3>
                    <p className="text-gray-500 text-sm font-medium">We specialize in the Cordillera region, understanding local logistics better than anyone else.</p>
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
                        <p className="text-gray-900 font-black text-lg tracking-tight italic">Trusted by {totalPartners} local merchants</p>
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
                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter italic">Application Sent!</h2>
                    <p className="text-gray-500 leading-relaxed mb-8 font-medium">
                        Thank you for your interest in joining Mossy Market. Our onboarding team will contact you within 24-48 hours to discuss the next steps.
                    </p>
                    <button 
                        onClick={() => setView('home')}
                        className="w-full bg-gray-900 text-white font-black py-4 rounded-3xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-200 uppercase tracking-widest text-xs"
                    >
                        Return to Homepage
                    </button>
                </div>
            ) : (
                <div className="bg-white p-10 lg:p-12 rounded-[50px] shadow-2xl border border-gray-100">
                    <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic">Merchant Application</h2>
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
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Contact Person</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                <input required type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 font-medium text-gray-800" placeholder="Full Name" />
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                                    <input required type="email" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 font-medium text-gray-800" placeholder="contact@email.com" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                    <input required type="tel" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 font-medium text-gray-800" placeholder="+63 900 000 0000" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                <input required type="text" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-orange-50 font-medium text-gray-800" placeholder="Baguio, Benguet, etc." />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl hover:bg-orange-500 transition-all shadow-2xl shadow-gray-200 active:translate-y-1 flex items-center justify-center space-x-3 disabled:opacity-70 uppercase tracking-widest text-xs"
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
                <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tighter uppercase italic">
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
                    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Global Support</h3>
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
                    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Partner Relations</h3>
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
                    <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">Headquarters</h3>
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
                    <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic">Send us a message</h2>
                    {contactSubmitted ? (
                         <div className="text-center py-12 animate-[fadeIn_0.5s_ease-out]">
                            <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight uppercase italic">Message Received</h3>
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
                                className="w-full bg-gray-900 text-white font-black py-5 rounded-3xl hover:bg-orange-500 transition-all shadow-xl shadow-orange-200 active:translate-y-1 flex items-center justify-center space-x-3 disabled:opacity-70 uppercase tracking-widest text-xs"
                            >
                                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <><Send size={20} /> <span>Send Message</span></>}
                            </button>
                        </form>
                    )}
                </div>

                <div className="space-y-12 lg:pt-8">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tighter uppercase italic">Connect with our Partners</h2>
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
                    
                    <div className="bg-orange-500 p-10 rounded-[40px] text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-2xl font-black mb-4 tracking-tight uppercase italic">Need a faster response?</h3>
                        <p className="text-white/80 font-medium mb-8">Chat with our AI-powered assistant or talk to a live agent through our mobile app.</p>
                        <button className="bg-white text-orange-600 font-black px-8 py-3 rounded-2xl hover:bg-orange transition-all flex items-center space-x-2 uppercase tracking-widest text-xs">
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
            <span className="text-2xl font-black text-gray-900 tracking-tight">Mossy<span className="text-orange-500"> Market</span></span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 text-sm font-bold uppercase tracking-widest text-gray-600">
            <button onClick={() => setView('home')} className={`hover:text-orange-500 transition-colors ${view === 'home' ? 'text-orange-500' : ''}`}>Home</button>
            <button onClick={() => { setView('products'); setActiveCategory('all'); }} className={`hover:text-orange-500 transition-colors ${view === 'products' ? 'text-orange-500' : ''}`}>Products</button>
            <button onClick={() => { setView('partners'); setActiveCategory('all'); }} className={`hover:text-orange-500 transition-colors ${view === 'partners' ? 'text-orange-500' : ''}`}>Restaurants</button>
            <button onClick={() => setView('become-partner')} className={`hover:text-orange-500 transition-colors ${view === 'become-partner' ? 'text-orange-500' : ''}`}>Become a Partner</button>
            <button onClick={() => setView('contact')} className={`hover:text-orange-500 transition-colors ${view === 'contact' ? 'text-orange-500' : ''}`}>Contact</button>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={onLoginClick}
              className="text-gray-900 font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full hover:bg-gray-50 transition-colors"
            >
              Merchant Login
            </button>
            <button 
                onClick={() => setView('products')}
                className="bg-orange-500 text-white font-bold text-xs uppercase tracking-widest px-8 py-2.5 rounded-full shadow-xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 transition-all"
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
      {view === 'products' && renderProducts()}
      {view === 'store-location' && renderStoreLocation()}

      {/* Footer */}
      <footer className="bg-gray-900 pt-20 pb-10 text-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('home')}>
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-black text-xl italic">
                M
              </div>
              <span className="text-2xl font-black tracking-tight uppercase italic">Mossy Market</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Serving the Cordillera region with the freshest food and fastest delivery. Supporting local businesses one order at a time.
            </p>
            <div className="flex space-x-4">
               <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-500 transition-all"><Facebook size={20} /></a>
               <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-500 transition-all"><Instagram size={20} /></a>
               <a href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-500 transition-all"><Twitter size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 tracking-tight uppercase italic">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-bold uppercase tracking-widest">
              <li><button onClick={() => setView('home')} className="hover:text-white transition-colors">Home</button></li>
              <li><button onClick={onLoginClick} className="hover:text-white transition-colors">Merchant Login</button></li>
              <li><button onClick={() => setView('become-partner')} className="hover:text-white transition-colors">Become a Partner</button></li>
              <li><button onClick={() => setView('contact')} className="hover:text-white transition-colors">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 tracking-tight uppercase italic">Help & Support</h4>
            <ul className="space-y-4 text-gray-400 text-sm font-bold uppercase tracking-widest">
              <li><a href="#" className="hover:text-white transition-colors">Customer Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-black mb-8 tracking-tight uppercase italic">Download App</h4>
            <div className="space-y-4">
              <button className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-4 hover:bg-white/10 transition-all text-left">
                 <Phone size={24} className="text-orange-500" />
                 <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Available on</p>
                   <p className="text-sm font-black italic">App Store</p>
                 </div>
              </button>
              <button className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center space-x-4 hover:bg-white/10 transition-all text-left">
                 <Phone size={24} className="text-orange-500" />
                 <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Get it on</p>
                   <p className="text-sm font-black italic">Google Play</p>
                 </div>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">© 2024 Mossy Market Logistics Inc. All rights reserved.</p>
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

// Map Component for Store Location
const StoreLocationMap: React.FC<{ store: StoreType }> = ({ store }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);

    useEffect(() => {
        const L = (window as any).L;
        if (!L || !mapRef.current || !store.lat || !store.lng) return;

        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current, { zoomControl: false }).setView([store.lat, store.lng], 16);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
            }).addTo(mapInstance.current);
            L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);
        } else {
            mapInstance.current.setView([store.lat, store.lng], 16);
        }

        const markerColor = '#f97316'; 
        const customIcon = L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: ${markerColor}; width: 20px; height: 20px; border: 4px solid white; border-radius: 50%; box-shadow: 0 0 15px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(mapInstance.current);
        marker.bindPopup(`<b class="font-black text-gray-900">${store.name}</b><br/><span class="text-xs text-gray-500">${store.address}</span>`, {
            closeButton: false,
            offset: [0, -10]
        }).openPopup();

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [store]);

    return <div ref={mapRef} className="w-full h-full z-10" />;
};

const RestaurantCard: React.FC<{ restaurant: any }> = ({ restaurant }) => (
  <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gray-200 transition-all group">
    <div className="h-64 overflow-hidden relative">
      <img 
        src={restaurant.image} 
        alt={restaurant.name} 
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
      />
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center space-x-1 shadow-lg border border-white/50">
        <Star size={14} className="text-yellow-400 fill-yellow-400" />
        <span className="text-sm font-black text-gray-900">{restaurant.rating}</span>
      </div>
      <div className="absolute bottom-4 left-4 flex gap-2">
        <span className="bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Free Delivery</span>
        <span className="bg-gray-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">15-20 min</span>
      </div>
    </div>
    <div className="p-8">
      <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2 truncate group-hover:text-orange-500 transition-colors uppercase italic">{restaurant.name}</h3>
      <p className="text-sm text-gray-500 mb-4 flex items-center truncate font-medium">
        <MapPin size={14} className="mr-1.5 text-orange-500" />
        {restaurant.address}
      </p>
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{restaurant.cuisineType}</span>
        <button className="text-orange-500 font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center">
          Order Now <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  </div>
);

const StoreItemCard: React.FC<{ store: StoreType; onViewLocation: () => void }> = ({ store, onViewLocation }) => (
    <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all group flex flex-col h-full">
        <div className="aspect-square overflow-hidden relative bg-gray-50">
            <img 
                src={store.image} 
                alt={store.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="bg-gray-900 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                    {store.type}
                </span>
            </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-base font-black text-gray-900 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 uppercase italic">
                    {store.name}
                </h3>
            </div>
            
            <div className="flex items-center gap-3 mb-8 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-orange-500" />
                    <span className="truncate max-w-[150px]">{store.address}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Package size={12} className="text-blue-500" />
                    <span>{store.inventoryCount} items</span>
                </div>
            </div>

            <div className="mt-auto">
                <button 
                  onClick={onViewLocation}
                  className="w-full bg-gray-900 text-white font-black py-3 rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-orange-500 transition-all flex items-center justify-center space-x-2 shadow-lg shadow-gray-100"
                >
                    <MapPin size={16} />
                    <span>View Location</span>
                </button>
            </div>
        </div>
    </div>
);

const CampaignFeaturedCard: React.FC<{ ad: Ad }> = ({ ad }) => {
    // Perform dynamic lookup for the merchant's name based on registry input
    const merchant = ad.targetType === 'Restaurant' 
        ? RESTAURANTS.find(r => r.id === ad.targetId)
        : STORES.find(s => s.id === ad.targetId);

    return (
        <div className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-500 group flex flex-col h-full relative border-t-4 border-t-orange-500/10">
            <div className="aspect-[16/10] overflow-hidden relative bg-gray-100">
                <img 
                    src={ad.image} 
                    alt={ad.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" 
                />
                <div className="absolute top-5 right-5 bg-orange-500 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.15em] shadow-2xl flex items-center gap-2 border border-white/20">
                   <Tag size={12} /> Special Offer
                </div>
                <div className="absolute bottom-5 left-5">
                    <span className="bg-gray-900/90 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest flex items-center gap-2 border border-white/10">
                        {ad.targetType === 'Restaurant' ? <Utensils size={10}/> : <Store size={10}/>}
                        {ad.targetType}
                    </span>
                </div>
            </div>
            <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                   <div className="w-5 h-px bg-orange-500"></div>
                   <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                      By {merchant?.name || 'Authorized Partner'}
                   </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 leading-tight group-hover:text-orange-500 transition-colors uppercase italic mb-4">
                    {ad.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium line-clamp-3 mb-10 leading-relaxed italic">
                    {ad.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-8 border-t border-gray-50">
                    <div className="flex items-center gap-2.5">
                       <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                          <Clock size={16} />
                       </div>
                       <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Limited Time</p>
                          <p className="text-[10px] font-black text-gray-900 uppercase">Ends: {ad.endDate}</p>
                       </div>
                    </div>
                    <button className="bg-gray-900 group-hover:bg-orange-500 text-white p-4 rounded-2xl transition-all shadow-xl shadow-gray-200 group-hover:shadow-orange-200 active:scale-90">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductItemCard: React.FC<{ product: Product }> = ({ product }) => (
    <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all group flex flex-col h-full">
        <div className="aspect-square overflow-hidden relative bg-gray-50">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            />
            <div className="absolute bottom-4 left-4">
                <span className="bg-gray-900 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-lg">
                    {product.category}
                </span>
            </div>
        </div>
        <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="text-sm font-black text-gray-900 leading-tight group-hover:text-orange-500 transition-colors line-clamp-2 uppercase italic">
                    {product.name}
                </h3>
            </div>
            
            <div className="flex items-center gap-3 mb-4 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                {product.calories && (
                    <div className="flex items-center gap-1 text-orange-600">
                        <Flame size={12} />
                        <span>{product.calories} kcal</span>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span>4.5</span>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between">
                <span className="text-lg font-black text-gray-900 tracking-tighter italic">₱{product.price.toFixed(2)}</span>
            </div>
        </div>
    </div>
);

export default LandingPage;