import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Heart, MessageCircle, Share, Star, MapPin, Clock, Users, Bookmark } from 'lucide-react';
import BookingButton from './BookingButton';

interface ActivityVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  creator: {
    name: string;
    username: string;
    avatar: string;
    followers: string;
    verified: boolean;
  };
  location: string;
  description: string;
  tags: string[];
  uploadedAgo: string;
  bookingInfo: {
    locationName: string;
    price: string;
    originalPrice?: string;
    bookingType: 'hotel' | 'restaurant' | 'activity' | 'experience';
    affiliateCode: string;
  };
}

interface ActivityVideoScreenProps {
  activityTitle: string;
  activityId: string;
  onBack: () => void;
}

const ActivityVideoScreen: React.FC<ActivityVideoScreenProps> = ({
  activityTitle,
  activityId,
  onBack
}) => {
  const [videos, setVideos] = useState<ActivityVideo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('trending');
  const [isLoading, setIsLoading] = useState(true);

  // Mock trending videos for the specific activity
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockVideos: ActivityVideo[] = [
        {
          id: 'vid1',
          title: `Amazing ${activityTitle} Experience - Must See!`,
          thumbnail: 'solar-images://a2f8c9e1-b4d7-4829-9a6b-8c5e2f9d8a7c',
          duration: '3:24',
          views: '2.1M',
          likes: '89K',
          creator: {
            name: 'Adventure Sarah',
            username: '@adventuresarah',
            avatar: 'solar-images://user-avatar-1',
            followers: '245K',
            verified: true
          },
          location: 'Bali, Indonesia',
          description: `Just experienced the most incredible ${activityTitle.toLowerCase()}! The views were absolutely breathtaking and totally worth every penny. Here's everything you need to know before booking...`,
          tags: ['adventure', 'travel', 'mustdo', 'bali'],
          uploadedAgo: '2 days ago',
          bookingInfo: {
            locationName: 'Bali Adventure Tours',
            price: '€89',
            originalPrice: '€120',
            bookingType: 'activity',
            affiliateCode: 'SARAH_BALI_123'
          }
        },
        {
          id: 'vid2',
          title: `${activityTitle} Gone WRONG - What They Don't Tell You`,
          thumbnail: 'solar-images://b3a9d2f4-c6e8-4d3a-8b7e-9c1f4a8d2e5b',
          duration: '8:15',
          views: '1.8M',
          likes: '67K',
          creator: {
            name: 'Honest Travel',
            username: '@honesttravel',
            avatar: 'solar-images://user-avatar-2',
            followers: '892K',
            verified: true
          },
          location: 'Thailand',
          description: `Real talk about ${activityTitle.toLowerCase()} - both the amazing parts and the things that went wrong. This honest review will help you prepare properly and avoid the mistakes I made.`,
          tags: ['honest', 'review', 'tips', 'thailand'],
          uploadedAgo: '5 days ago',
          bookingInfo: {
            locationName: 'Thailand Adventures Co',
            price: '€75',
            bookingType: 'activity',
            affiliateCode: 'HONEST_THAI_456'
          }
        },
        {
          id: 'vid3',
          title: `First Time ${activityTitle} - Beginner's Guide`,
          thumbnail: 'solar-images://c4b1e5f7-d9a2-4e6b-9c8d-1a5f8b2e7c9a',
          duration: '12:30',
          views: '956K',
          likes: '43K',
          creator: {
            name: 'Travel Couple',
            username: '@travelcouple',
            avatar: 'solar-images://user-avatar-3',
            followers: '156K',
            verified: false
          },
          location: 'Costa Rica',
          description: `Complete beginner's guide to ${activityTitle.toLowerCase()}! We were terrified but it turned out to be the highlight of our trip. Here's everything first-timers need to know.`,
          tags: ['beginner', 'guide', 'costarica', 'couple'],
          uploadedAgo: '1 week ago',
          bookingInfo: {
            locationName: 'Costa Rica Adventures',
            price: '€65',
            originalPrice: '€85',
            bookingType: 'activity',
            affiliateCode: 'COUPLE_CR_789'
          }
        },
        {
          id: 'vid4',
          title: `${activityTitle} at 4AM - Epic Sunrise Experience`,
          thumbnail: 'solar-images://d5c2f8a9-e1b4-4f7c-8d9e-2b6f9c3a8d1b',
          duration: '6:45',
          views: '734K',
          likes: '28K',
          creator: {
            name: 'Golden Hour Adventures',
            username: '@goldenhour',
            avatar: 'solar-images://user-avatar-4',
            followers: '89K',
            verified: true
          },
          location: 'Nepal',
          description: `Woke up at 4AM for this ${activityTitle.toLowerCase()} experience and it was MAGICAL! The sunrise views were absolutely incredible. Worth the early wake-up call!`,
          tags: ['sunrise', 'early', 'nepal', 'magical'],
          uploadedAgo: '3 days ago',
          bookingInfo: {
            locationName: 'Himalayan Adventures',
            price: '€195',
            bookingType: 'experience',
            affiliateCode: 'GOLDEN_NEP_012'
          }
        },
        {
          id: 'vid5',
          title: `Budget ${activityTitle} - Only €20!`,
          thumbnail: 'solar-images://e6d3a1b5-f2c8-4a9d-8e7f-3c9a6d2b8e4c',
          duration: '4:52',
          views: '1.2M',
          likes: '91K',
          creator: {
            name: 'Budget Backpacker',
            username: '@budgetbackpacker',
            avatar: 'solar-images://user-avatar-5',
            followers: '567K',
            verified: true
          },
          location: 'Vietnam',
          description: `Discovered this amazing budget-friendly ${activityTitle.toLowerCase()} for only €20! Proves you don't need to spend a fortune for incredible experiences. Here's how to find these hidden gems.`,
          tags: ['budget', 'cheap', 'vietnam', 'backpacker'],
          uploadedAgo: '4 days ago',
          bookingInfo: {
            locationName: 'Vietnam Budget Tours',
            price: '€20',
            bookingType: 'activity',
            affiliateCode: 'BUDGET_VN_345'
          }
        }
      ];
      
      setVideos(mockVideos);
      setIsLoading(false);
    }, 1000);
  }, [activityTitle, selectedFilter]);

  const filters = [
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'recent', label: 'Recent', icon: '⏰' },
    { id: 'popular', label: 'Most Popular', icon: '👑' },
    { id: 'honest', label: 'Honest Reviews', icon: '💯' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={onBack}
              className="mr-4 text-white hover:text-cyan-400 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{activityTitle} Videos</h1>
              <p className="text-gray-300">
                Real experiences from travelers around the world
              </p>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 mb-8 bg-white/5 backdrop-blur-sm rounded-lg p-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all ${
                  selectedFilter === filter.id
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{filter.icon}</span>
                <span className="font-medium">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 animate-pulse">
                  <div className="bg-gray-600 rounded-lg aspect-video mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-600 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-600 h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Video Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/15 transition-all hover:scale-[1.02] cursor-pointer">
                  
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video bg-gray-800">
                    <img 
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 hover:bg-white transition-colors">
                        <Play className="w-8 h-8 text-black" />
                      </div>
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    
                    {/* Creator Info */}
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src={video.creator.avatar}
                        alt={video.creator.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-1">
                          <span className="text-white text-sm font-medium">
                            {video.creator.name}
                          </span>
                          {video.creator.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <span className="text-gray-400 text-xs">
                          {video.creator.followers} followers
                        </span>
                      </div>
                    </div>
                    
                    {/* Video Stats */}
                    <div className="flex items-center space-x-4 mb-3 text-gray-400 text-sm">
                      <span>{video.views} views</span>
                      <span>{video.likes} likes</span>
                      <span>{video.uploadedAgo}</span>
                    </div>
                    
                    {/* Location */}
                    <div className="flex items-center space-x-1 mb-3">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{video.location}</span>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {video.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {video.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-3">
                        <button className="text-gray-400 hover:text-red-400 transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-400 transition-colors">
                          <MessageCircle className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-green-400 transition-colors">
                          <Share className="w-5 h-5" />
                        </button>
                        <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                          <Bookmark className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                        Watch Now
                      </button>
                    </div>
                    
                    {/* Booking Button */}
                    <BookingButton
                      locationName={video.bookingInfo.locationName}
                      price={video.bookingInfo.price}
                      originalPrice={video.bookingInfo.originalPrice}
                      videoId={video.id}
                      creatorId={video.creator.username}
                      affiliateCode={video.bookingInfo.affiliateCode}
                      bookingType={video.bookingInfo.bookingType}
                      size="small"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Load More */}
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform">
              Load More Videos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityVideoScreen;