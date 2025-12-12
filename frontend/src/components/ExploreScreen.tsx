import { Search, Play, Heart, MapPin, ListFilter } from "lucide-react";
import React, { useState } from 'react';
import BookingButton from './BookingButton';


const ExploreScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('world');

  // Mock video locations data with booking info
  const videoLocations = [
    { 
      id: 1, 
      lat: 40.7128, 
      lng: -74.0060, 
      title: 'NYC Hidden Gems', 
      views: '2.3M', 
      thumbnail: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&h=200&fit=crop',
      creator: '@nyc_insider',
      bookingInfo: {
        locationName: 'NYC Secret Spots Tour',
        price: '$45/person',
        originalPrice: '$65/person',
        bookingType: 'activity' as const,
        affiliateCode: 'NYC001'
      }
    },
    { 
      id: 2, 
      lat: 48.8566, 
      lng: 2.3522, 
      title: 'Paris Secret Spots', 
      views: '1.8M', 
      thumbnail: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=200&h=200&fit=crop',
      creator: '@paris_explorer',
      bookingInfo: {
        locationName: 'Paris Hidden Gems Walking Tour',
        price: '€35/person',
        bookingType: 'activity' as const,
        affiliateCode: 'PAR002'
      }
    },
    { 
      id: 3, 
      lat: 35.6762, 
      lng: 139.6503, 
      title: 'Tokyo Food Tour', 
      views: '3.1M', 
      thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=200&h=200&fit=crop',
      creator: '@tokyo_foodie',
      bookingInfo: {
        locationName: 'Tokyo Street Food Experience',
        price: '¥8,500/person',
        originalPrice: '¥12,000/person',
        bookingType: 'activity' as const,
        affiliateCode: 'TOK003'
      }
    },
    { 
      id: 4, 
      lat: -33.8688, 
      lng: 151.2093, 
      title: 'Sydney Adventures', 
      views: '1.5M', 
      thumbnail: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=200&h=200&fit=crop',
      creator: '@sydney_adventures',
      bookingInfo: {
        locationName: 'Sydney Harbor Kayak Tour',
        price: 'AU$75/person',
        bookingType: 'activity' as const,
        affiliateCode: 'SYD004'
      }
    },
    { 
      id: 5, 
      lat: 25.2048, 
      lng: 55.2708, 
      title: 'Dubai Luxury', 
      views: '2.7M', 
      thumbnail: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&h=200&fit=crop',
      creator: '@dubai_luxury',
      bookingInfo: {
        locationName: 'Burj Khalifa VIP Experience',
        price: 'AED 650/person',
        originalPrice: 'AED 950/person',
        bookingType: 'activity' as const,
        affiliateCode: 'DUB005'
      }
    },
  ];

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
          <h1 className="text-2xl font-bold text-cyan-400 mb-4">Explore the World</h1>
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input 
              type="text"
              placeholder="Search destinations, experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-sm border border-gray-600 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-400"
            />
            <button className="absolute right-2 top-2 p-2 bg-cyan-400/20 rounded-lg">
              <ListFilter className="w-4 h-4 text-cyan-400" />
            </button>
          </div>
          
          {/* Region Selector */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {['World', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  selectedRegion === region.toLowerCase()
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black' 
                    : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="px-4 mb-6">
          <div className="relative h-64 bg-white/5 backdrop-blur-sm border border-gray-600 rounded-xl overflow-hidden">
            {/* Map Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-slate-900/50" />
            
            {/* Mock World Map with Video Pins */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Interactive map with video locations</p>
                <p className="text-xs text-gray-500 mt-1">Tap pins to see travel videos from each location</p>
              </div>
            </div>
            
            {/* Video Location Pins (positioned absolutely for demo) */}
            {videoLocations.map((location) => (
              <button
                key={location.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${20 + (location.id * 15)}%`,
                  top: `${30 + (location.id * 8)}%`
                }}
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                    <Play className="w-4 h-4 text-black" />
                  </div>
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 text-xs whitespace-nowrap">
                      <p className="font-semibold">{location.title}</p>
                      <p className="text-gray-400">{location.views} views</p>
                      <p className="text-cyan-400">{location.bookingInfo.price}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trending Videos */}
        <div className="px-4 pb-24">
          <h2 className="text-xl font-bold mb-4">Trending Worldwide</h2>
          <div className="space-y-4">
            {videoLocations.map((video) => (
              <div key={video.id} className="flex bg-white/5 backdrop-blur-sm border border-gray-600 rounded-xl p-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden mr-4">
                  <img 
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{video.title}</h3>
                  <p className="text-gray-400 text-sm mb-2">{video.views} views</p>
                  <div className="flex items-center space-x-4">
                    <button className="flex items-center space-x-1 text-sm text-gray-400">
                      <Heart className="w-4 h-4" />
                      <span>Like</span>
                    </button>
                    <BookingButton
                      locationName={video.bookingInfo.locationName}
                      price={video.bookingInfo.price}
                      originalPrice={video.bookingInfo.originalPrice}
                      videoId={`explore-${video.id}`}
                      creatorId={video.creator}
                      affiliateCode={video.bookingInfo.affiliateCode}
                      bookingType={video.bookingInfo.bookingType}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreScreen;