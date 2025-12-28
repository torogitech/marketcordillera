import React, { useState } from 'react';
import { Accommodation, AccommodationStatus, RoomType } from '../types';
import { ArrowLeft, Save, Ban, Edit3, Users, BedDouble, Camera, AlertTriangle, CheckCircle2, DollarSign, Layers, Key } from 'lucide-react';

interface AccommodationDetailsProps {
  accommodation: Accommodation;
  onBack: () => void;
  onUpdate: (updatedAccommodation: Accommodation) => void;
}

const AccommodationDetails: React.FC<AccommodationDetailsProps> = ({ accommodation, onBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Accommodation>(accommodation);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' || name === 'floor' || name === 'pricePerNight'
        ? Number(value) 
        : value
    }));
  };

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleSetStatus = (status: AccommodationStatus) => {
    const updated = { ...formData, status };
    if (status !== 'Booked') {
        updated.currentGuest = undefined;
    }
    setFormData(updated);
    onUpdate(updated);
  };

  const getStatusColor = (status: AccommodationStatus) => {
    switch (status) {
      case 'Available': return 'text-green-600 bg-green-50 border-green-200';
      case 'Booked': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Cleaning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Maintenance': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex-1 bg-gray-50 p-4 lg:p-8 lg:ml-64 min-h-screen pb-24 animate-[fadeIn_0.2s_ease-out]">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-4 py-2.5 rounded-xl transition-all hover:bg-gray-50 shadow-sm"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to List</span>
        </button>

        <div className="flex space-x-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 bg-white transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-600 shadow-lg shadow-orange-200 transition-all"
              >
                <Save size={18} />
                <span>Save Changes</span>
              </button>
            </>
          ) : (
            <>
              {formData.status === 'Available' && (
                  <button 
                    onClick={() => handleSetStatus('Maintenance')}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 bg-white transition-all"
                  >
                    <AlertTriangle size={18} />
                    <span>Maintenance</span>
                  </button>
              )}
              {formData.status === 'Maintenance' && (
                  <button 
                    onClick={() => handleSetStatus('Available')}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl border border-green-200 text-green-600 font-medium hover:bg-green-50 bg-white transition-all"
                  >
                    <CheckCircle2 size={18} />
                    <span>Set Available</span>
                  </button>
              )}
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 shadow-lg shadow-gray-200 transition-all"
              >
                <Edit3 size={18} />
                <span>Edit Details</span>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Overview */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden relative group mb-6">
              <img 
                src={formData.image} 
                alt={formData.roomNumber} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                    <Camera size={24} />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Room Status</label>
                <div className={`inline-flex items-center px-4 py-2 rounded-xl border font-medium ${getStatusColor(formData.status)}`}>
                  {formData.status === 'Maintenance' && <AlertTriangle size={18} className="mr-2" />}
                  {formData.status === 'Booked' && <Key size={18} className="mr-2" />}
                  {formData.status === 'Available' && <CheckCircle2 size={18} className="mr-2" />}
                  {formData.status === 'Cleaning' && <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>}
                  
                  {isEditing ? (
                    <select 
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="bg-transparent border-none focus:ring-0 text-sm font-semibold p-0 cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="Booked">Booked</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  ) : (
                    <span>{formData.status}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                 <div>
                    <span className="text-xs text-gray-400 block mb-1">Floor Level</span>
                    <div className="flex items-center text-gray-800 font-bold text-lg">
                      <Layers size={18} className="text-gray-400 mr-2" />
                      {formData.floor}
                    </div>
                 </div>
                 <div>
                    <span className="text-xs text-gray-400 block mb-1">Max Guests</span>
                    <div className="flex items-center text-gray-800 font-bold text-lg">
                      <Users size={18} className="text-gray-400 mr-2" />
                      {formData.capacity}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <BedDouble size={20} className="mr-2 text-orange-500" />
              Room Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                {isEditing ? (
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all"
                    >
                        <option value="Standard">Standard</option>
                        <option value="Deluxe">Deluxe</option>
                        <option value="Suite">Suite</option>
                        <option value="Penthouse">Penthouse</option>
                    </select>
                ) : (
                    <input
                      type="text"
                      value={formData.type}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Per Night</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Guest</label>
                <input
                  type="text"
                  name="currentGuest"
                  value={formData.currentGuest || ''}
                  onChange={handleInputChange}
                  placeholder={formData.status === 'Booked' ? "Guest Name" : "No Guest"}
                  disabled={!isEditing || formData.status !== 'Booked'}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 mb-2">Room Features</label>
                 <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-sm border border-gray-200">
                            {feature}
                        </span>
                    ))}
                    {isEditing && (
                        <button className="px-3 py-1 bg-orange-50 text-orange-600 rounded-lg text-sm border border-orange-100 hover:bg-orange-100">
                            + Add Feature
                        </button>
                    )}
                 </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Internal ID</label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetails;