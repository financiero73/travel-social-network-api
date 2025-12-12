import React, { useState } from 'react';
import { Search, MapPin, Star, Clock, DollarSign, Play } from 'lucide-react';
import BookingButton from './BookingButton';

const ExploreCityScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Miami Beach local spots data
  const localSpots = [
    {
      id: 1,
      name: 'Joe\'s Stone Crab',
      category: 'restaurant',
      rating: 4.8,
      price: '$$$',
      time: '12 min',
      trending: true,
      thumbnail: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=300&h=200&fit=crop',
      description: 'Iconic Miami Beach seafood since 1913',
      coordinates: [25.7678, -80.1347],
      bookingInfo: {
        locationName: 'Joe\'s Stone Crab',
        price: '$65/person',
        originalPrice: '$85/person',
        bookingType: 'restaurant' as const,
        affiliateCode: 'MIA001'
      }
    },
    {
      id: 2,
      name: 'Art Deco Historic District',
      category: 'activity',
      rating: 4.6,
      price: 'Free',
      time: '2 hours',
      trending: false,
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      description: 'Colorful architecture walking tour',
      coordinates: [25.7825, -80.1304],
      bookingInfo: {
        locationName: 'Art Deco Walking Tour',
        price: '$25/person',
        bookingType: 'activity' as const,
        affiliateCode: 'MIA002'
      }
    },
    {
      id: 3,
      name: 'The Setai Miami Beach',
      category: 'cafe',
      rating: 4.9,
      price: '$$$$',
      time: '8 min',
      trending: true,
      thumbnail: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=300&h=200&fit=crop',
      description: 'Luxury beachfront resort & spa',
      coordinates: [25.7745, -80.1298],
      bookingInfo: {
        locationName: 'The Setai Miami Beach',
        price: '$850/night',
        originalPrice: '$1,200/night',
        bookingType: 'hotel' as const,
        affiliateCode: 'MIA003'
      }
    },
    {
      id: 4,
      name: 'Lincoln Road Mall',
      category: 'food',
      rating: 4.7,
      price: '$$',
      time: '15 min',
      trending: true,
      thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop',
      description: 'Pedestrian mall with dining & shopping',
      coordinates: [25.7907, -80.1418],
      bookingInfo: {
        locationName: 'Lincoln Road Food Tour',
        price: '$45/person',
        bookingType: 'activity' as const,
        affiliateCode: 'MIA004'
      }
    },
    {
      id: 5,
      name: 'South Beach',
      category: 'activity',
      rating: 4.8,
      price: 'Free',
      time: '5 min',
      trending: true,
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      description: 'World-famous white sand beach',
      coordinates: [25.7753, -80.1301],
      bookingInfo: {
        locationName: 'South Beach Umbrella Rental',
        price: '$35/day',
        bookingType: 'activity' as const,
        affiliateCode: 'MIA005'
      }
    },
    {
      id: 6,
      name: 'LIV Nightclub',
      category: 'nightlife',
      rating: 4.5,
      price: '$$$',
      time: '18 min',
      trending: true,
      thumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=200&fit=crop',
      description: 'Ultra-exclusive nightlife experience',
      coordinates: [25.7804, -80.1263],
      bookingInfo: {
        locationName: 'LIV Nightclub VIP Table',
        price: '$500/table',
        originalPrice: '$750/table',
        bookingType: 'experience' as const,
        affiliateCode: 'MIA006'
      }
    }
  ];

  const categories = [
    { id: 'all', label: 'All', emoji: '🌟' },
    { id: 'restaurant', label: 'Restaurants', emoji: '🍽️' },
    { id: 'cafe', label: 'Cafes', emoji: '☕' },
    { id: 'activity', label: 'Activities', emoji: '🎯' },
    { id: 'food', label: 'Food Tours', emoji: '🍜' },
    { id: 'nightlife', label: 'Nightlife', emoji: '🌙' }
  ];

  const filteredSpots = selectedCategory === 'all' 
    ? localSpots 
    : localSpots.filter(spot => spot.category === selectedCategory);

  return (
    <div className="min-h-screen">
      {/* Futuristic Space Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black" />
      
      {/* Earth Image */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <img 
          src="https://inner-apps.s3.us-east-2.amazonaws.com/ac083b77-89fd-4da7-b779-bc6cdbefb1f7/fb7f51da-35d3-4b8b-b5fb-4a54522727a4/public/80440148-1733-4197-b8c8-05ce4e973db2.png" 
          alt="Earth from space" 
          className="w-full h-full object-cover opacity-20"
          style={{ transform: 'scale(1.4) translateY(40%)' }}
        />
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

      <div className="relative z-10 text-white">
        {/* Header */}
        <div className="p-4 pt-12">
          <div className="flex items-center mb-4">
            <MapPin className="w-6 h-6 text-cyan-400 mr-2" />
            <h1 className="text-2xl font-bold text-cyan-400">Miami Beach</h1>
          </div>
          <p className="text-gray-400 mb-4">Miami Beach, FL • Trending now</p>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search local spots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400"
            />
          </div>
          
          {/* Categories */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center space-x-1 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black' 
                    : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20'
                }`}
              >
                <span>{category.emoji}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Miami Beach Real Map */}
        <div className="px-4 mb-6">
          <div className="relative h-72 bg-white/5 backdrop-blur-sm border border-gray-600 rounded-xl overflow-hidden">
            {/* Real Miami Beach Map */}
            <img 
              src="https://inner-apps.s3.us-east-2.amazonaws.com/ac083b77-89fd-4da7-b779-bc6cdbefb1f7/fb7f51da-35d3-4b8b-b5fb-4a54522727a4/public/1cf66b51-6f5f-481b-a781-31094aea5c09.png"
              alt="Miami Beach Map"
              className="w-full h-full object-cover opacity-80"
            />
            
            {/* Map overlay for better contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
            
            {/* Trending spots indicators on real locations */}
            {localSpots.slice(0, 6).map((spot, index) => {
              // Convert coordinates to percentage positions on the map
              const getMapPosition = (coords: [number, number]) => {
                // These are approximate positions based on the Miami Beach map
                const positions = [
                  { left: '75%', top: '65%' }, // Joe's Stone Crab - South Beach area
                  { left: '78%', top: '50%' }, // Art Deco District - Mid Beach
                  { left: '76%', top: '58%' }, // The Setai - Collins Ave
                  { left: '72%', top: '40%' }, // Lincoln Road - North of 5th
                  { left: '80%', top: '62%' }, // South Beach - Ocean Drive
                  { left: '74%', top: '55%' }  // LIV - Fontainebleau area
                ];
                return positions[index] || { left: '50%', top: '50%' };
              };
              
              const position = getMapPosition(spot.coordinates);
              
              return (
                <button
                  key={spot.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                  style={{
                    left: position.left,
                    top: position.top
                  }}
                >
                  <div className="relative">
                    {/* Pin with category icon */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center animate-pulse shadow-lg ${
                      spot.category === 'restaurant' ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                      spot.category === 'cafe' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                      spot.category === 'activity' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                      spot.category === 'nightlife' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                      'bg-gradient-to-r from-cyan-400 to-blue-500'
                    }`}>
                      {spot.category === 'restaurant' && <span className="text-white text-xs">🍽️</span>}
                      {spot.category === 'cafe' && <span className="text-white text-xs">☕</span>}
                      {spot.category === 'activity' && <span className="text-white text-xs">🎯</span>}
                      {spot.category === 'nightlife' && <span className="text-white text-xs">🌙</span>}
                      {spot.category === 'food' && <span className="text-white text-xs">🛍️</span>}
                    </div>
                    
                    {/* Hover tooltip */}
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                      <div className="bg-black/90 backdrop-blur-sm rounded-lg p-2 text-xs whitespace-nowrap border border-gray-600">
                        <p className="font-semibold text-white">{spot.name}</p>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <span>{spot.rating}⭐</span>
                          <span>{spot.time}</span>
                          <span>{spot.price}</span>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/90"></div>
                    </div>
                  </div>
                </button>
              );
            })}
            
            {/* Map legend */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-gray-300 mb-2 font-semibold">Trending Now</p>
              <div className="flex space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
                  <span className="text-gray-400">Dining</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  <span className="text-gray-400">Activities</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <span className="text-gray-400">Nightlife</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Spots */}
        <div className="px-4 pb-24">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Trending Near You</h2>
            <span className="text-sm text-cyan-400">{filteredSpots.length} spots</span>
          </div>
          
          <div className="space-y-4">
            {filteredSpots.map((spot) => (
              <div key={spot.id} className="bg-white/5 backdrop-blur-sm border border-gray-600 rounded-xl overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={spot.thumbnail}
                    alt={spot.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  
                  {/* Trending Badge */}
                  {spot.trending && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 px-2 py-1 rounded-full">
                      <span className="text-xs font-semibold text-white">🔥 Trending</span>
                    </div>
                  )}
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  
                  {/* Distance */}
                  <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-white" />
                      <span className="text-xs text-white">{spot.time}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{spot.name}</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm">{spot.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{spot.price}</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3">{spot.description}</p>
                  
                  <div className="flex space-x-3 mb-3">
                    {spot.bookingInfo && (
                      <BookingButton
                        locationName={spot.bookingInfo.locationName}
                        price={spot.bookingInfo.price}
                        originalPrice={spot.bookingInfo.originalPrice}
                        videoId={`city-${spot.id}`}
                        creatorId="miami_explorer"
                        affiliateCode={spot.bookingInfo.affiliateCode}
                        bookingType={spot.bookingInfo.bookingType}
                        size="medium"
                        className="flex-1"
                      />
                    )}
                    <button className="px-6 bg-white/10 backdrop-blur-sm py-2 rounded-lg text-gray-300">
                      Save
                    </button>
                  </div>
                  
                  <button className="w-full bg-white/10 backdrop-blur-sm py-2 rounded-lg text-gray-300 text-sm">
                    Get Directions
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCityScreen;