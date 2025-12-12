import { MapPin, Play, Heart, Eye, Users, TrendingUp, Search, Map as MapIcon, ListFilter } from "lucide-react";
import React, { useState, useEffect } from 'react';


interface TrendingVideo {
  id: string;
  title: string;
  creator: string;
  views: string;
  likes: string;
  thumbnail: string;
  category: string;
  icon: string;
}

interface ExplorePageProps {
  location?: string;
}

const ExplorePage: React.FC<ExplorePageProps> = ({ location = "Miami Beach" }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [mapView, setMapView] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock trending videos data
  const trendingVideos: TrendingVideo[] = [
    {
      id: '1',
      title: 'Best Miami Beach Eats',
      creator: '@miamifoodie',
      views: '2.1M views',
      likes: '145K',
      thumbnail: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=600&fit=crop',
      category: 'Food & Drink',
      icon: '🍽️'
    },
    {
      id: '2',
      title: 'Miami Beach Nightlife',
      creator: '@miamibeachlife',
      views: '1.8M views',
      likes: '203K',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=600&fit=crop',
      category: 'Fun with Friends',
      icon: '🌃'
    },
    {
      id: '3',
      title: 'Water Adventures',
      creator: '@miamiadventures',
      views: '950K views',
      likes: '89K',
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop',
      category: 'Adventure & Outdoors',
      icon: '🏄‍♂️'
    },
    {
      id: '4',
      title: 'Beach Paradise',
      creator: '@beachvibes',
      views: '3.2M views',
      likes: '267K',
      thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=600&fit=crop',
      category: 'Special Vibes',
      icon: '🏖️'
    }
  ];

  const moreVideos: TrendingVideo[] = [
    {
      id: '5',
      title: 'Art Deco Tour',
      creator: '@miamiculture',
      views: '1.5M views',
      likes: '178K',
      thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
      category: 'Music & Entertainment',
      icon: '🎨'
    },
    {
      id: '6',
      title: 'Rooftop Bars',
      creator: '@miaminight',
      views: '680K views',
      likes: '95K',
      thumbnail: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=400&h=600&fit=crop',
      category: 'Food & Drink',
      icon: '🍸'
    },
    {
      id: '7',
      title: 'Street Food',
      creator: '@streetfoodmiami',
      views: '2.1M views',
      likes: '245K',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=600&fit=crop',
      category: 'Food & Drink',
      icon: '🌮'
    },
    {
      id: '8',
      title: 'Parasailing',
      creator: '@extrememiami',
      views: '780K views',
      likes: '67K',
      thumbnail: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=600&fit=crop',
      category: 'Adventure & Outdoors',
      icon: '🪂'
    },
    {
      id: '9',
      title: 'Ocean Drive',
      creator: '@miamiwalk',
      views: '1.2M views',
      likes: '134K',
      thumbnail: 'https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=400&h=600&fit=crop',
      category: 'Special Vibes',
      icon: '🌴'
    }
  ];

  const categories = [
    { name: 'Food & Drink', count: 3, color: 'bg-orange-100 text-orange-800' },
    { name: 'Fun with Friends', count: 3, color: 'bg-purple-100 text-purple-800' },
    { name: 'Adventure & Outdoors', count: 1, color: 'bg-green-100 text-green-800' },
    { name: 'Music & Entertainment', count: 1, color: 'bg-blue-100 text-blue-800' },
    { name: 'Special Vibes', count: 1, color: 'bg-pink-100 text-pink-800' },
    { name: 'Budget-Friendly', count: 1, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const mapLocations = [
    { name: 'Fontainebleau Miami Beach', type: 'hotel', lat: 25.8206, lng: -80.1217 },
    { name: 'AC Hotel Miami Beach', type: 'hotel', lat: 25.7907, lng: -80.1300 },
    { name: 'The Daydrift', type: 'hotel', lat: 25.7856, lng: -80.1319 },
    { name: 'The Standard Spa, Miami Beach', type: 'spa', lat: 25.7709, lng: -80.1328 },
    { name: 'Miami Beach Golf Club', type: 'activity', lat: 25.7908, lng: -80.1419 },
    { name: 'Miami Jet Ski Rental Connect', type: 'activity', lat: 25.7753, lng: -80.1344 }
  ];

  const VideoCard: React.FC<{ video: TrendingVideo; size?: 'large' | 'small' }> = ({ video, size = 'large' }) => {
    const isLarge = size === 'large';
    
    return (
      <div className={`relative rounded-2xl overflow-hidden group cursor-pointer ${
        isLarge ? 'aspect-[3/4]' : 'aspect-[4/5]'
      }`}>
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-black ml-1" fill="currentColor" />
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="text-2xl">{video.icon}</span>
        </div>
        
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold text-lg mb-1">{video.title}</h3>
          <p className="text-gray-300 text-sm mb-2">{video.creator}</p>
          
          <div className="flex items-center space-x-4 text-white text-sm">
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{video.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{video.views}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Explore {location}</h1>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">Showing 10 places</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={() => setMapView(!mapView)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  mapView ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapIcon className="w-5 h-5" />
                <span>{mapView ? 'Hide Map' : 'Show Map'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      {mapView && (
        <div className="relative">
          <div className="h-96 bg-gradient-to-br from-blue-100 to-blue-200 relative overflow-hidden">
            {/* Mock Map Background */}
            <img 
              src="https://inner-apps.s3.us-east-2.amazonaws.com/ac083b77-89fd-4da7-b779-bc6cdbefb1f7/fb7f51da-35d3-4b8b-b5fb-4a54522727a4/public/b8c5fb82-43fc-4042-b8ed-c4c14afb6fda.png"
              alt="Miami Beach Map"
              className="w-full h-full object-cover"
            />
            
            {/* Categories Overlay */}
            <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400" />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">({category.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trending Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">Trending in {location}</h2>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium">See All</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingVideos.map((video) => (
              <VideoCard key={video.id} video={video} size="large" />
            ))}
          </div>
        </div>

        {/* More Trending Videos */}
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <span className="text-2xl">📹</span>
            <h2 className="text-2xl font-bold text-gray-900">More Trending Videos</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {moreVideos.map((video) => (
              <VideoCard key={video.id} video={video} size="small" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;