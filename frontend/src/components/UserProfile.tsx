import { Settings, Grid3X3, Bookmark, MapPin, Calendar, Users, Heart, Camera, Plus, ListFilter } from "lucide-react";
import React, { useState, useEffect } from 'react';

import { socialServicesGetUserSavedPosts, socialServicesGetSavedLocations } from '@/lib/sdk';

interface SavedPost {
  saved_info: {
    id: string;
    collection_name?: string;
    location_category?: string;
    personal_notes?: string;
    created_at: string;
  };
  post: {
    id: string;
    caption: string;
    images: string[];
    location_name: string;
    country: string;
    post_type: string;
    booking_info?: {
      price?: string;
      booking_url?: string;
    };
  };
  author: {
    username: string;
    display_name: string;
    profile_image_url?: string;
    is_verified: boolean;
  };
}

interface SavedLocation {
  location: string;
  count: number;
}

interface UserProfileProps {
  userId: string;
  isOwnProfile?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, isOwnProfile = true }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved'>('posts');
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLocationFilter, setShowLocationFilter] = useState(false);

  // Mock user data - in real app this would come from API
  const userProfile = {
    id: userId,
    username: 'sarah_wanderlust',
    display_name: 'Sarah Chen',
    bio: '✈️ Digital nomad | 📸 Travel photographer | 🌍 47 countries & counting | Currently exploring Southeast Asia',
    profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b812b0c1?w=400&h=400&fit=crop&crop=face',
    cover_image_url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800&h=300&fit=crop',
    followers_count: 15420,
    following_count: 1240,
    posts_count: 12,
    is_verified: true,
    is_creator: true,
    location: 'Currently in Bali, Indonesia',
    travel_style: ['adventure', 'photography', 'wellness']
  };

  useEffect(() => {
    if (activeTab === 'saved') {
      loadSavedContent();
      loadSavedLocations();
    }
  }, [activeTab, selectedLocation, selectedCollection]);

  const loadSavedContent = async () => {
    try {
      setLoading(true);
      const response = await socialServicesGetUserSavedPosts({
        body: {
          user_id: userId,
          location_filter: selectedLocation,
          collection_filter: selectedCollection
        }
      });
      setSavedPosts(response.data || []);
    } catch (error) {
      console.error('Error loading saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedLocations = async () => {
    try {
      const response = await socialServicesGetSavedLocations({
        body: { user_id: userId }
      });
      setSavedLocations(response.data || []);
    } catch (error) {
      console.error('Error loading saved locations:', error);
    }
  };

  const getUniqueCollections = () => {
    const collections = savedPosts
      .map(item => item.saved_info.collection_name)
      .filter(name => name)
      .filter((name, index, arr) => arr.indexOf(name) === index);
    return collections as string[];
  };

  const groupPostsByLocation = () => {
    const grouped: Record<string, SavedPost[]> = {};
    savedPosts.forEach(post => {
      const location = post.saved_info.location_category || 'Other';
      if (!grouped[location]) grouped[location] = [];
      grouped[location].push(post);
    });
    return grouped;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-br from-purple-600 to-blue-600 relative overflow-hidden">
          {userProfile.cover_image_url && (
            <img 
              src={userProfile.cover_image_url} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30" />
          
          {isOwnProfile && (
            <button className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2">
              <Settings className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        
        {/* Profile Info */}
        <div className="relative px-4 pb-4">
          <div className="flex items-end space-x-4 -mt-16">
            {/* Profile Picture */}
            <div className="w-32 h-32 rounded-full border-4 border-black overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500 p-1">
              <div className="w-full h-full rounded-full overflow-hidden">
                {userProfile.profile_image_url ? (
                  <img 
                    src={userProfile.profile_image_url} 
                    alt={userProfile.display_name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-2xl font-bold">{userProfile.display_name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 pb-2">
              {!isOwnProfile && (
                <div className="flex space-x-2 mb-2">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Follow
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    Message
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* User Info */}
          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-2xl font-bold">{userProfile.display_name}</h1>
              {userProfile.is_verified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
              {userProfile.is_creator && (
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Creator
                </span>
              )}
            </div>
            
            <div className="text-gray-400 mb-2">@{userProfile.username}</div>
            
            {userProfile.bio && (
              <p className="text-white text-sm mb-3 leading-relaxed">{userProfile.bio}</p>
            )}
            
            {userProfile.location && (
              <div className="flex items-center space-x-1 text-gray-400 text-sm mb-3">
                <MapPin className="w-4 h-4" />
                <span>{userProfile.location}</span>
              </div>
            )}
            
            {/* Stats */}
            <div className="flex space-x-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-lg">{userProfile.posts_count}</div>
                <div className="text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{userProfile.followers_count.toLocaleString()}</div>
                <div className="text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{userProfile.following_count}</div>
                <div className="text-gray-400">Following</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-3 flex items-center justify-center space-x-2 ${
              activeTab === 'posts' 
                ? 'text-white border-b-2 border-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-5 h-5" />
            <span className="font-medium">Posts</span>
          </button>
          
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 py-3 flex items-center justify-center space-x-2 ${
                activeTab === 'saved' 
                  ? 'text-white border-b-2 border-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="font-medium">Saved</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'posts' ? (
          /* Posts Grid */
          <div className="p-4">
            <div className="grid grid-cols-3 gap-1">
              {/* Real travel videos */}
              {[
                { thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop', duration: '2:34', views: '125K' }, // Bali rice terraces
                { thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop', duration: '1:18', views: '89K' }, // Tokyo ramen
                { thumbnail: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop', duration: '3:45', views: '201K' }, // Matterhorn
                { thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop', duration: '2:12', views: '156K' }, // Secret lagoon
                { thumbnail: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=400&fit=crop', duration: '1:56', views: '312K' }, // Bali beach sunset
                { thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=400&fit=crop', duration: '2:43', views: '98K' }, // Tokyo skyline
                { thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop', duration: '4:21', views: '267K' }, // Mountain landscape
                { thumbnail: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=400&fit=crop', duration: '1:39', views: '143K' }, // City rooftop
                { thumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=400&fit=crop', duration: '2:07', views: '87K' }, // Tokyo street
                { thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop', duration: '3:12', views: '176K' }, // Bali temple
                { thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', duration: '0:58', views: '234K' }, // Food photography
                { thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b812b0c1?w=400&h=400&fit=crop', duration: '1:45', views: '78K' }  // Portrait
              ].map((video, index) => (
                <div key={index} className="aspect-square bg-gray-800 relative overflow-hidden group cursor-pointer">
                  <img 
                    src={video.thumbnail}
                    alt={`Travel video ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Video Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Video Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-white text-xs font-medium">{video.duration}</span>
                  </div>
                  
                  {/* Views Count */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-white text-xs">{video.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Saved Content */
          <div className="p-4">
            {/* Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">My Travel Wishlist</h2>
                <button 
                  onClick={() => setShowLocationFilter(!showLocationFilter)}
                  className="bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 flex items-center space-x-2 transition-colors"
                >
                  <ListFilter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
              </div>
              
              {showLocationFilter && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Location Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Filter by Location</label>
                      <select 
                        value={selectedLocation || ''}
                        onChange={(e) => setSelectedLocation(e.target.value || null)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="">All Locations</option>
                        {savedLocations.map(location => (
                          <option key={location.location} value={location.location}>
                            {location.location} ({location.count})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Collection Filter */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Filter by Collection</label>
                      <select 
                        value={selectedCollection || ''}
                        onChange={(e) => setSelectedCollection(e.target.value || null)}
                        className="w-full bg-black border border-gray-700 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="">All Collections</option>
                        {getUniqueCollections().map(collection => (
                          <option key={collection} value={collection}>
                            {collection}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading saved posts...</div>
            ) : savedPosts.length === 0 ? (
              <div className="text-center py-12">
                <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No saved posts yet</h3>
                <p className="text-gray-400 mb-4">Start saving posts to build your travel wishlist!</p>
              </div>
            ) : (
              /* Saved Posts by Location */
              <div className="space-y-8">
                {Object.entries(groupPostsByLocation()).map(([location, posts]) => (
                  <div key={location}>
                    <div className="flex items-center space-x-3 mb-4">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <h3 className="text-lg font-semibold">{location}</h3>
                      <span className="bg-white/10 rounded-full px-2 py-1 text-xs">{posts.length}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {posts.map((item) => (
                        <div key={item.saved_info.id} className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition-colors">
                          <div className="aspect-square relative overflow-hidden">
                            {item.post.images.length > 0 && (
                              <img 
                                src={item.post.images[0]} 
                                alt="Saved post" 
                                className="w-full h-full object-cover"
                              />
                            )}
                            <div className="absolute top-2 right-2">
                              <Bookmark className="w-5 h-5 text-yellow-400 fill-current" />
                            </div>
                          </div>
                          
                          <div className="p-3">
                            <h4 className="font-medium text-sm mb-1 line-clamp-2">{item.post.caption}</h4>
                            <div className="text-xs text-gray-400 mb-2">{item.post.location_name}</div>
                            
                            {item.saved_info.collection_name && (
                              <span className="inline-block bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full mb-2">
                                {item.saved_info.collection_name}
                              </span>
                            )}
                            
                            {item.post.booking_info && (
                              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-lg transition-colors">
                                Book Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;