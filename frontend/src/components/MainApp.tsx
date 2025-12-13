import { User, Calendar, Globe, MapPin, Play, Mountain, Search, Heart, House } from "lucide-react";



import React, { useState } from 'react';
import { useUser, UserButton } from '@clerk/clerk-react';
import { useKeepAlive } from '../hooks/useKeepAlive';

import TravelFeedScreen from './TravelFeedScreen';
import ProfileScreen from './ProfileScreen';
import PlanTripScreen from './PlanTripScreen';
import ExploreScreen from './ExploreScreen';
import ExploreCityScreen from './ExploreCityScreen';
import OffGridScreen from './OffGridScreen';
import SocialFeed from './SocialFeed';
import UserProfile from './UserProfile';
import ExplorePage from './ExplorePage';
// import TripPlannerApp from './TripPlannerApp';
import ActivityVideoScreen from './ActivityVideoScreen';

type TabType = 'profile' | 'plan' | 'explore' | 'city' | 'feed' | 'offgrid' | 'social' | 'social_profile' | 'videos';

interface Tab {
  id: TabType;
  icon: any;
  label: string;
  isCenter?: boolean;
}

const MainApp: React.FC = () => {
  // Keep backend alive with automatic pings every 10 minutes
  useKeepAlive();
  
  const [activeTab, setActiveTab] = useState<TabType>('social');
  const [videoActivity, setVideoActivity] = useState<{title: string, id: string} | null>(null);
  
  // Get current user from Clerk
  const { user, isLoaded } = useUser();
  const [currentUserId, setCurrentUserId] = React.useState<string>("b0a16eea-68b3-4e0f-8409-176b2ff77a8a");
  
  // Get or create user UUID when Clerk user is loaded
  React.useEffect(() => {
    const getUserUuid = async () => {
      if (user) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'https://travel-social-network-api.onrender.com';
          const response = await fetch(`${apiUrl}/api/user_services/get_user_uuid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              clerk_user_id: user.id,
              username: user.username || user.id,
              email: user.primaryEmailAddress?.emailAddress || 'user@example.com',
              display_name: user.fullName || user.username || 'User',
              profile_image_url: user.imageUrl
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            setCurrentUserId(data.user_id);
            console.log('✅ User UUID obtained:', data.user_id);
          }
        } catch (error) {
          console.error('❌ Error getting user UUID:', error);
        }
      }
    };
    
    getUserUuid();
  }, [user]);
  
  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }
  
  const handleActivityVideoView = (activityTitle: string, activityId: string) => {
    setVideoActivity({ title: activityTitle, id: activityId });
    setActiveTab('videos');
  };

  const tabs = [
    { id: 'social' as TabType, icon: Heart, label: 'Feed' },
    { id: 'explore' as TabType, icon: Search, label: 'Explore' },
    { id: 'plan' as TabType, icon: Calendar, label: 'Plan Trip', isCenter: true },
    { id: 'offgrid' as TabType, icon: Mountain, label: 'Off Grid' },
    { id: 'social_profile' as TabType, icon: User, label: 'Profile' }
  ];

  const renderScreen = () => {
    switch (activeTab) {
      case 'social':
        return <SocialFeed userId={currentUserId} />;
      
      case 'plan':
        return <PlanTripScreen />;
      
      case 'social_profile':
        return <UserProfile userId={currentUserId} isOwnProfile={true} />;
      
      case 'videos':
        if (videoActivity) {
          return (
            <ActivityVideoScreen 
              activityTitle={videoActivity.title}
              activityId={videoActivity.id}
              onBack={() => {
                setActiveTab('social');
                setVideoActivity(null);
              }}
            />
          );
        }
        return <SocialFeed userId={currentUserId} />;
      
      case 'explore':
        return <ExplorePage />;
      
      case 'feed':
        return <TravelFeedScreen />;
      
      case 'profile':
        return <ProfileScreen />;
      
      case 'city':
        return <ExploreCityScreen />;
      
      case 'offgrid':
        return <OffGridScreen />;
      
      default:
        return <SocialFeed userId={currentUserId} />;
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Main Content */}
      <div className="pb-20">
        {renderScreen()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Futuristic background */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-800 to-transparent backdrop-blur-md" />
        <div className="absolute inset-0 border-t border-cyan-400/30" />
        
        <div className="relative px-4 py-3">
          <div className="flex justify-around items-end">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const isCenter = tab.isCenter;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center transition-all duration-300 ${
                    isCenter 
                      ? 'p-3 -mt-2' 
                      : 'p-2'
                  } rounded-xl ${
                    isActive 
                      ? 'bg-cyan-400/20 scale-110' 
                      : 'hover:bg-white/10 hover:scale-105'
                  }`}
                >
                  <div className={`rounded-full transition-all ${
                    isCenter 
                      ? 'p-4 shadow-lg shadow-cyan-400/25' 
                      : 'p-2'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500' 
                      : isCenter
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 ring-2 ring-cyan-400/30'
                        : 'bg-white/10'
                  }`}>
                    <Icon className={`${
                      isCenter ? 'w-7 h-7' : 'w-5 h-5'
                    } ${
                      isActive || isCenter ? 'text-white' : 'text-white'
                    }`} />
                  </div>
                  <span className={`text-xs mt-1 ${
                    isCenter ? 'font-bold' : ''
                  } ${
                    isActive ? 'text-cyan-400 font-semibold' : 
                    isCenter ? 'text-cyan-300' : 'text-gray-400'
                  }`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainApp;