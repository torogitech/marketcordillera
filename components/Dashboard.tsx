import React from 'react';
import { TrendingUp, Users, PhilippinePeso, ShoppingBag, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { RECENT_ORDERS, REVENUE_DATA, PRODUCTS } from '../constants';
import { OrderStatus } from '../types';

const StatCard: React.FC<{
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, trend, trendUp, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <div className={`flex items-center space-x-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        <span>{trend}</span>
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
    <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
  </div>
);

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const styles = {
    Completed: 'bg-green-50 text-green-600 border-green-100',
    Pending: 'bg-orange-50 text-orange-600 border-orange-100',
    Preparing: 'bg-blue-50 text-blue-600 border-blue-100',
    Cancelled: 'bg-red-50 text-red-600 border-red-100',
  };
  
  const icons = {
    Completed: <CheckCircle size={12} className="mr-1" />,
    Pending: <Clock size={12} className="mr-1" />,
    Preparing: <Clock size={12} className="mr-1" />,
    Cancelled: <AlertCircle size={12} className="mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}>
      {icons[status]}
      {status}
    </span>
  );
};

const Dashboard: React.FC = () => {
  // Simple SVG Chart Logic
  const maxRevenue = Math.max(...REVENUE_DATA.map(d => d.value));
  const chartHeight = 150;
  const chartWidth = 100; // percentages
  
  const getPoints = () => {
    return REVENUE_DATA.map((d, i) => {
      const x = (i / (REVENUE_DATA.length - 1)) * 100 * 6; // Scale width roughly
      const y = chartHeight - (d.value / maxRevenue) * chartHeight;
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, Alvin! Here's what's happening today.</p>
        </div>
        <div className="flex space-x-3">
          <select className="bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium focus:outline-none cursor-pointer hover:bg-gray-50">
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-lg shadow-lg shadow-orange-200 text-sm font-medium transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value="₱12,345.00" 
          trend="+15.2%" 
          trendUp={true} 
          icon={<PhilippinePeso size={24} className="text-orange-600" />}
          color="bg-orange-100"
        />
        <StatCard 
          title="Total Orders" 
          value="1,245" 
          trend="+8.5%" 
          trendUp={true} 
          icon={<ShoppingBag size={24} className="text-blue-600" />}
          color="bg-blue-100"
        />
        <StatCard 
          title="Total Customers" 
          value="856" 
          trend="-2.1%" 
          trendUp={false} 
          icon={<Users size={24} className="text-purple-600" />}
          color="bg-purple-100"
        />
        <StatCard 
          title="Average Bill" 
          value="₱42.50" 
          trend="+5.4%" 
          trendUp={true} 
          icon={<TrendingUp size={24} className="text-green-600" />}
          color="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart Area */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800">Revenue Analytics</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Income</span>
               <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>Expense</span>
            </div>
          </div>
          
          <div className="h-64 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox={`0 0 600 ${chartHeight}`}>
               {/* Grid Lines */}
               {[0, 1, 2, 3, 4].map((i) => (
                  <line 
                    key={i} 
                    x1="0" 
                    y1={i * (chartHeight/4)} 
                    x2="600" 
                    y2={i * (chartHeight/4)} 
                    stroke="#f3f4f6" 
                    strokeWidth="1" 
                  />
               ))}
               
               {/* Data Path */}
               <defs>
                 <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                   <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
                   <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                 </linearGradient>
               </defs>
               <path 
                 d={`M0,${chartHeight} ${getPoints()} L600,${chartHeight} Z`} 
                 fill="url(#gradient)" 
               />
               <polyline 
                  fill="none" 
                  stroke="#f97316" 
                  strokeWidth="3" 
                  points={getPoints()} 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
               />
               
               {/* Tooltip dots */}
               {REVENUE_DATA.map((d, i) => {
                  const x = (i / (REVENUE_DATA.length - 1)) * 600;
                  const y = chartHeight - (d.value / maxRevenue) * chartHeight;
                  return (
                    <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#f97316" strokeWidth="2" className="hover:r-6 transition-all cursor-pointer" />
                  );
               })}
            </svg>
            
            {/* X Axis Labels */}
            <div className="flex justify-between mt-4 text-xs text-gray-400">
              {REVENUE_DATA.map((d, i) => (
                <span key={i}>{d.day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Popular Dishes</h3>
          <div className="space-y-6">
            {PRODUCTS.slice(0, 4).map((product, idx) => (
              <div key={product.id} className="flex items-center space-x-4">
                <span className="font-bold text-gray-300 text-lg w-4">0{idx + 1}</span>
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                  <p className="text-xs text-gray-500">{Math.floor(Math.random() * 50) + 10} orders today</p>
                </div>
                <span className="font-bold text-gray-800">₱{product.price}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors">
            View All Items
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">Recent Orders</h3>
          <button className="text-orange-500 text-sm font-medium hover:text-orange-600">See All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Store</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex -space-x-2 overflow-hidden">
                      {order.items.slice(0, 3).map((_, i) => (
                        <div key={i} className="inline-block h-6 w-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-500">
                          {_.charAt(0)}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                         <div className="inline-block h-6 w-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-gray-500">
                           +{order.items.length - 3}
                         </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.store}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">₱{order.total.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-orange-500 transition-colors">
                      <div className="w-8 h-8 rounded-full hover:bg-orange-50 flex items-center justify-center">
                        <ArrowUpRight size={16} />
                      </div>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;