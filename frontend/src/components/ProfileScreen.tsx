import { Settings, Heart, Bookmark, Play, Map, Plus } from "lucide-react";
import React, { useState } from 'react';


const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'itineraries'>('posts');

  const mockUserData = {
    username: '@travel_explorer',
    displayName: 'Alex Johnson',
    bio: 'Adventure seeker 🏔️ | Food lover 🍜 | Sharing hidden gems worldwide ✨',
    followers: '12.5K',
    following: '892',
    posts: '156',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  };

  const mockPosts = [
    { id: 1, thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6b?w=300&h=400&fit=crop', likes: '2.1K', type: 'video' },
    { id: 2, thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop', likes: '1.8K', type: 'video' },
    { id: 3, thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=400&fit=crop', likes: '3.2K', type: 'video' },
    { id: 4, thumbnail: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=300&h=400&fit=crop', likes: '1.5K', type: 'video' },
    { id: 5, thumbnail: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=400&fit=crop', likes: '4.2K', type: 'video' },
    { id: 6, thumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=300&h=400&fit=crop', likes: '1.9K', type: 'video' },
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
        <div className="flex justify-between items-center p-4 pt-12">
          <h1 className="text-2xl font-bold text-cyan-400">{mockUserData.username}</h1>
          <button className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="px-4 mb-6">
          <div className="flex items-center mb-4">
            <img 
              src={mockUserData.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full border-2 border-cyan-400 mr-4"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{mockUserData.displayName}</h2>
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="font-bold text-cyan-400">{mockUserData.posts}</div>
                  <div className="text-xs text-gray-400">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-cyan-400">{mockUserData.followers}</div>
                  <div className="text-xs text-gray-400">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-cyan-400">{mockUserData.following}</div>
                  <div className="text-xs text-gray-400">Following</div>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4">{mockUserData.bio}</p>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black py-2 rounded-full font-semibold">
              Edit Profile
            </button>
            <button className="px-6 bg-white/10 backdrop-blur-sm py-2 rounded-full">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mx-4">
          {[{id: 'posts', label: 'Posts', icon: Play}, 
            {id: 'saved', label: 'Saved', icon: Bookmark}, 
            {id: 'itineraries', label: 'Trips', icon: Map}].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id 
                    ? 'border-b-2 border-cyan-400 text-cyan-400' 
                    : 'text-gray-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="p-4">
          {activeTab === 'posts' && (
            <div className="grid grid-cols-3 gap-1">
              {mockPosts.map((post) => (
                <div key={post.id} className="relative aspect-[3/4] bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={post.thumbnail}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-2 right-2">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-white" />
                    <span className="text-white text-xs">{post.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeTab === 'saved' && (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Your saved content will appear here</p>
            </div>
          )}
          
          {activeTab === 'itineraries' && (
            <div className="text-center py-12">
              <Map className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Your travel itineraries will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;