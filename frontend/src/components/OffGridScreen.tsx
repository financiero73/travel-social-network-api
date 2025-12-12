import React, { useState } from 'react';
import { Mountain, Compass, MapPin, Users, Star, Play, Lock } from 'lucide-react';
import BookingButton from './BookingButton';
import ReviewsButton from './ReviewsButton';

const OffGridScreen: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const offGridExperiences = [
    {
      id: 1,
      title: 'Hidden Waterfall Cave',
      location: 'Iceland (coordinates shared privately)',
      difficulty: 'Advanced',
      secretLevel: 5,
      creator: '@iceland_secrets',
      views: '12.5K',
      saves: '2.1K',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      video_duration: '3:42',
      description: 'A hidden cave behind a waterfall that only locals know about. 2-hour hike through unmarked trails.',
      tags: ['waterfall', 'cave', 'hiking'],
      exclusive: true,
      bookingInfo: {
        locationName: 'Iceland Secret Waterfall Adventure',
        price: '€150/person',
        originalPrice: '€220/person',
        bookingType: 'experience' as const,
        affiliateCode: 'ICE001'
      }
    },
    {
      id: 2,
      title: 'Underground Speakeasy',
      location: 'Tokyo (entrance code required)',
      difficulty: 'Beginner',
      secretLevel: 4,
      creator: '@tokyo_underground',
      views: '8.7K',
      saves: '1.8K',
      thumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=600&fit=crop',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      video_duration: '2:18',
      description: 'Secret bar hidden beneath a ramen shop. Password changes weekly - follow for updates.',
      tags: ['nightlife', 'secret', 'drinks'],
      exclusive: false,
      bookingInfo: {
        locationName: 'Tokyo Underground Bar Access',
        price: '¥5,000/person',
        bookingType: 'experience' as const,
        affiliateCode: 'TOK002'
      }
    },
    {
      id: 3,
      title: 'Wild Hot Springs',
      location: 'Patagonia (GPS coordinates)',
      difficulty: 'Expert',
      secretLevel: 5,
      creator: '@patagonia_explorer',
      views: '15.2K',
      saves: '3.5K',
      thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      video_duration: '4:15',
      description: 'Natural hot springs accessible only by 4x4 and 3-hour trek. No facilities, pure wilderness.',
      tags: ['hotsprings', 'wilderness', 'adventure'],
      exclusive: true,
      bookingInfo: {
        locationName: 'Patagonia Wild Hot Springs Expedition',
        price: '$285/person',
        originalPrice: '$350/person',
        bookingType: 'experience' as const,
        affiliateCode: 'PAT003'
      }
    },
    {
      id: 4,
      title: 'Rooftop Garden Restaurant',
      location: 'New York (members only)',
      difficulty: 'Beginner',
      secretLevel: 3,
      creator: '@nyc_hidden',
      views: '22.1K',
      saves: '4.2K',
      thumbnail: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&h=600&fit=crop',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      video_duration: '1:56',
      description: 'Secret garden restaurant on a Manhattan rooftop. Reservation by referral only.',
      tags: ['restaurant', 'rooftop', 'exclusive'],
      exclusive: true,
      bookingInfo: {
        locationName: 'NYC Secret Rooftop Dining',
        price: '$180/person',
        originalPrice: '$250/person',
        bookingType: 'restaurant' as const,
        affiliateCode: 'NYC004'
      }
    }
  ];

  const filters = [
    { id: 'all', label: 'All Secrets', icon: Mountain },
    { id: 'wilderness', label: 'Wilderness', icon: Compass },
    { id: 'urban', label: 'Urban Hidden', icon: MapPin },
    { id: 'exclusive', label: 'Members Only', icon: Lock }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400';
      case 'Advanced': return 'text-orange-400';
      case 'Expert': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getSecretLevelStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-3 h-3 ${
          i < level ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`} 
      />
    ));
  };

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
          <div className="flex items-center mb-2">
            <Mountain className="w-6 h-6 text-purple-400 mr-2" />
            <h1 className="text-2xl font-bold text-purple-400">Off the Grid</h1>
          </div>
          <p className="text-gray-400 mb-6">Secret spots & hidden experiences shared by trusted explorers</p>
          
          {/* Filters */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex items-center space-x-2 ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                      : 'bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Lock className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-purple-400">Secret Access Required</span>
            </div>
            <p className="text-sm text-gray-300">
              These locations are shared responsibly. Respect local communities, environment, and follow Leave No Trace principles.
            </p>
          </div>
        </div>

        {/* Off-Grid Experiences */}
        <div className="px-4 pb-24">
          <div className="space-y-6">
            {offGridExperiences.map((experience) => (
              <div key={experience.id} className="bg-white/5 backdrop-blur-sm border border-gray-600 rounded-xl overflow-hidden">
                <div className="relative">
                  <img 
                    src={experience.thumbnail}
                    alt={experience.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  
                  {/* Exclusive Badge */}
                  {experience.exclusive && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full">
                      <div className="flex items-center space-x-1">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs font-semibold">Exclusive</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Secret Level */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center space-x-1">
                      {getSecretLevelStars(experience.secretLevel)}
                    </div>
                  </div>
                  
                  {/* Video Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all cursor-pointer group">
                    <div className="w-20 h-20 bg-white/90 hover:bg-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all group-hover:scale-110 shadow-xl">
                      <Play className="w-10 h-10 text-black ml-1" />
                    </div>
                  </div>
                  
                  {/* Video Duration */}
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm rounded px-2 py-1">
                    <span className="text-white text-sm font-medium">{experience.video_duration}</span>
                  </div>
                  
                  {/* Views Count */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-white text-xs">{experience.views} views</span>
                  </div>
                  
                  {/* Creator Info */}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">{experience.creator.charAt(1).toUpperCase()}</span>
                      </div>
                      <span className="text-sm font-medium">{experience.creator}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{experience.title}</h3>
                    <span className={`text-sm font-medium ${getDifficultyColor(experience.difficulty)}`}>
                      {experience.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{experience.location}</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{experience.description}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {experience.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex space-x-4 text-sm text-gray-400">
                      <span>{experience.views} views</span>
                      <span>{experience.saves} saved</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-3">
                    {experience.bookingInfo && (
                      <div className="flex space-x-3">
                        <BookingButton
                          locationName={experience.bookingInfo.locationName}
                          price={experience.bookingInfo.price}
                          originalPrice={experience.bookingInfo.originalPrice}
                          videoId={`offgrid-${experience.id}`}
                          creatorId={experience.creator}
                          affiliateCode={experience.bookingInfo.affiliateCode}
                          bookingType={experience.bookingInfo.bookingType}
                          size="medium"
                          className="flex-1"
                        />
                        <ReviewsButton
                          locationName={experience.bookingInfo.locationName}
                          size="medium"
                        />
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-semibold">
                        Request Access
                      </button>
                      <button className="px-6 bg-white/10 backdrop-blur-sm py-2 rounded-lg text-gray-300">
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA for Content Creators */}
          <div className="mt-8 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-xl p-6 text-center">
            <Mountain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Share Your Secret Spot</h3>
            <p className="text-gray-400 mb-4">
              Know a hidden gem? Share it responsibly with our community of trusted explorers.
            </p>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold">
              Submit Secret Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffGridScreen;