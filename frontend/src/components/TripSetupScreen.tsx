import React, { useState } from 'react';
import { MapPin, Calendar, Users, Heart, UserCheck, Smile, User } from 'lucide-react';

interface TripSetupData {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  tripType: 'family' | 'friends' | 'romantic' | 'solo' | '';
}

interface TripSetupScreenProps {
  onNext: (data: TripSetupData) => void;
}

const TripSetupScreen: React.FC<TripSetupScreenProps> = ({ onNext }) => {
  const [tripData, setTripData] = useState<TripSetupData>({
    destination: '',
    startDate: '',
    endDate: '',
    adults: 2,
    children: 0,
    tripType: ''
  });

  const tripTypes = [
    { id: 'family' as const, label: 'Family Trip', icon: Users, color: 'from-green-500 to-emerald-500', description: 'Kid-friendly adventures' },
    { id: 'friends' as const, label: 'Friends Trip', icon: Smile, color: 'from-orange-500 to-red-500', description: 'Group fun & activities' },
    { id: 'romantic' as const, label: 'Romantic Trip', icon: Heart, color: 'from-pink-500 to-rose-500', description: 'Couples experiences' },
    { id: 'solo' as const, label: 'Solo Trip', icon: User, color: 'from-purple-500 to-indigo-500', description: 'Personal adventure' }
  ];

  const popularDestinations = [
    'Paris, France', 'Tokyo, Japan', 'Bali, Indonesia', 'Santorini, Greece', 
    'New York, USA', 'Dubai, UAE', 'Maldives', 'Rome, Italy', 'Thailand', 'Iceland'
  ];

  const handleSubmit = () => {
    if (tripData.destination && tripData.startDate && tripData.endDate && tripData.tripType) {
      onNext(tripData);
    }
  };

  const isFormValid = tripData.destination && tripData.startDate && tripData.endDate && tripData.tripType;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Beautiful Travel Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"
          alt="Travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-3">Plan Your Perfect Trip</h1>
            <p className="text-xl text-gray-300">Let's start with the basics</p>
          </div>

          {/* Main Form Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl">
            
            {/* Destination */}
            <div className="mb-6">
              <label className="block text-white text-lg font-semibold mb-3">
                <MapPin className="inline w-5 h-5 mr-2 text-cyan-400" />
                Where are you traveling?
              </label>
              <input
                type="text"
                value={tripData.destination}
                onChange={(e) => setTripData({...tripData, destination: e.target.value})}
                placeholder="Search destinations..."
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-4 text-white placeholder-gray-300 text-lg focus:outline-none focus:border-cyan-400 focus:bg-white/30 transition-all"
                list="destinations"
              />
              <datalist id="destinations">
                {popularDestinations.map((dest) => (
                  <option key={dest} value={dest} />
                ))}
              </datalist>
              
              {/* Popular suggestions */}
              <div className="flex flex-wrap gap-2 mt-3">
                {popularDestinations.slice(0, 5).map((dest) => (
                  <button
                    key={dest}
                    onClick={() => setTripData({...tripData, destination: dest})}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm text-gray-300 hover:bg-cyan-400/30 hover:text-white transition-all"
                  >
                    {dest}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="mb-6">
              <label className="block text-white text-lg font-semibold mb-3">
                <Calendar className="inline w-5 h-5 mr-2 text-cyan-400" />
                When are you going?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Start Date</label>
                  <input
                    type="date"
                    value={tripData.startDate}
                    onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/30 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">End Date</label>
                  <input
                    type="date"
                    value={tripData.endDate}
                    onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
                    className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/30 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div className="mb-8">
              <label className="block text-white text-lg font-semibold mb-3">
                <Users className="inline w-5 h-5 mr-2 text-cyan-400" />
                How many travelers?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Adults</label>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl">
                    <button
                      onClick={() => setTripData({...tripData, adults: Math.max(1, tripData.adults - 1)})}
                      className="px-4 py-3 text-white text-xl hover:bg-white/10 transition-all"
                    >-</button>
                    <span className="flex-1 text-center text-white text-lg py-3">{tripData.adults}</span>
                    <button
                      onClick={() => setTripData({...tripData, adults: tripData.adults + 1})}
                      className="px-4 py-3 text-white text-xl hover:bg-white/10 transition-all"
                    >+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Children</label>
                  <div className="flex items-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl">
                    <button
                      onClick={() => setTripData({...tripData, children: Math.max(0, tripData.children - 1)})}
                      className="px-4 py-3 text-white text-xl hover:bg-white/10 transition-all"
                    >-</button>
                    <span className="flex-1 text-center text-white text-lg py-3">{tripData.children}</span>
                    <button
                      onClick={() => setTripData({...tripData, children: tripData.children + 1})}
                      className="px-4 py-3 text-white text-xl hover:bg-white/10 transition-all"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Trip Type */}
            <div className="mb-8">
              <label className="block text-white text-lg font-semibold mb-4">
                What type of trip is this?
              </label>
              <div className="grid grid-cols-2 gap-4">
                {tripTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = tripData.tripType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setTripData({...tripData, tripType: type.id})}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                        isSelected 
                          ? 'border-white bg-white/20 shadow-lg' 
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-r ${type.color}`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold mb-1">{type.label}</h3>
                      <p className="text-gray-300 text-sm">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl text-lg font-bold transition-all transform ${
                isFormValid
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:scale-105 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isFormValid ? 'Continue to Preferences' : 'Please fill all fields'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripSetupScreen;