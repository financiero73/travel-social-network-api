import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Bookmark, Share, MapPin, Calendar, DollarSign, Play } from 'lucide-react';
import BookingButton from './BookingButton';

interface TravelPost {
  id: string;
  username: string;
  location: string;
  title: string;
  description: string;
  videoThumbnail: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  price?: string;
  duration?: string;
  category: string;
  bookingInfo?: {
    locationName: string;
    price: string;
    originalPrice?: string;
    bookingType: 'hotel' | 'restaurant' | 'activity' | 'flight' | 'experience';
    affiliateCode: string;
  };
}

interface TravelFeedScreenProps {
  selectedCategory?: string;
}

const TravelFeedScreen: React.FC<TravelFeedScreenProps> = ({ selectedCategory }) => {
  const [posts, setPosts] = useState<TravelPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mock travel posts data
  useEffect(() => {
    const mockPosts: TravelPost[] = [
      {
        id: '1',
        username: '@wanderlust_sarah',
        location: 'Santorini, Greece',
        title: 'Sunset dining in Oia',
        description: 'Found this hidden gem restaurant with the most incredible sunset views! The seafood was amazing and the atmosphere was magical ✨',
        videoThumbnail: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=600&fit=crop',
        likes: 1247,
        comments: 89,
        isLiked: false,
        isSaved: false,
        price: '$45/person',
        duration: '2 hours',
        category: 'vacation',
        bookingInfo: {
          locationName: 'Ammoudi Fish Tavern',
          price: '€45/person',
          originalPrice: '€65/person',
          bookingType: 'restaurant',
          affiliateCode: 'SAN001'
        }
      },
      {
        id: '2',
        username: '@local_explorer',
        location: 'Brooklyn, NY',
        title: 'Hidden rooftop bar',
        description: 'This secret speakeasy has the best cocktails and city views. Perfect for date night! 🍸',
        videoThumbnail: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=600&fit=crop',
        likes: 892,
        comments: 156,
        isLiked: true,
        isSaved: true,
        price: '$15-25',
        duration: '3-4 hours',
        category: 'local',
        bookingInfo: {
          locationName: 'The Heights Bar & Grill',
          price: '$20/person',
          bookingType: 'restaurant',
          affiliateCode: 'NYC002'
        }
      },
      {
        id: '3',
        username: '@adventure_seeker',
        location: 'Banff, Canada',
        title: 'Epic hiking trail',
        description: 'This 5-mile hike leads to the most incredible lake view. Totally worth the early morning start! 🥾',
        videoThumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        likes: 2156,
        comments: 234,
        isLiked: false,
        isSaved: false,
        price: 'Free',
        duration: '4-6 hours',
        category: 'explore',
        bookingInfo: {
          locationName: 'Banff Guided Hiking Tours',
          price: 'CA$85/person',
          originalPrice: 'CA$120/person',
          bookingType: 'activity',
          affiliateCode: 'BAN003'
        }
      },
      {
        id: '4',
        username: '@city_foodie',
        location: 'Tokyo, Japan',
        title: 'Best ramen spot',
        description: 'This tiny 8-seat ramen shop serves the most incredible tonkotsu ramen. Worth the 30-minute wait! 🍜',
        videoThumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=600&fit=crop',
        likes: 3421,
        comments: 567,
        isLiked: true,
        isSaved: false,
        price: '$12',
        duration: '1 hour',
        category: 'browse',
        bookingInfo: {
          locationName: 'Ichiran Ramen Experience',
          price: '¥1,800/person',
          bookingType: 'restaurant',
          affiliateCode: 'TOK004'
        }
      }
    ];
    
    setPosts(mockPosts);
  }, []);

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const currentPost = posts[currentIndex];

  if (!currentPost) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Futuristic Space Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black" />
      
      {/* Video Background */}
      <div className="absolute inset-0">
        <img 
          src={currentPost.videoThumbnail}
          alt={currentPost.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-screen flex">
        
        {/* Left side - Video content area */}
        <div className="flex-1">
          {/* Navigation dots */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-2">
            {posts.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-8 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Right side - Post info and actions */}
        <div className="w-80 p-6 flex flex-col justify-end">
          
          {/* Post info */}
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-black font-bold text-sm">
                  {currentPost.username.charAt(1).toUpperCase()}
                </span>
              </div>
              <span className="text-white font-semibold">{currentPost.username}</span>
            </div>
            
            <div className="flex items-center text-cyan-400 mb-2">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{currentPost.location}</span>
            </div>
            
            <h3 className="text-white text-xl font-bold mb-2">{currentPost.title}</h3>
            <p className="text-gray-200 text-sm mb-4 leading-relaxed">{currentPost.description}</p>
            
            {/* Trip details */}
            <div className="flex flex-wrap gap-4 mb-6">
              {currentPost.price && (
                <div className="flex items-center text-green-400">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="text-xs">{currentPost.price}</span>
                </div>
              )}
              {currentPost.duration && (
                <div className="flex items-center text-blue-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-xs">{currentPost.duration}</span>
                </div>
              )}
            </div>
            
            {/* Enhanced Book Now button */}
            {currentPost.bookingInfo && (
              <div className="mb-4">
                <BookingButton
                  locationName={currentPost.bookingInfo.locationName}
                  price={currentPost.bookingInfo.price}
                  originalPrice={currentPost.bookingInfo.originalPrice}
                  videoId={currentPost.id}
                  creatorId={currentPost.username}
                  affiliateCode={currentPost.bookingInfo.affiliateCode}
                  bookingType={currentPost.bookingInfo.bookingType}
                  size="large"
                  className="w-full"
                />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <button 
              onClick={() => handleLike(currentPost.id)}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentPost.isLiked ? 'bg-red-500' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Heart className={`w-6 h-6 ${
                  currentPost.isLiked ? 'text-white fill-current' : 'text-white'
                }`} />
              </div>
              <span className="text-white text-xs mt-1">{currentPost.likes}</span>
            </button>

            <button className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-xs mt-1">{currentPost.comments}</span>
            </button>

            <button 
              onClick={() => handleSave(currentPost.id)}
              className="flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                currentPost.isSaved ? 'bg-yellow-500' : 'bg-white/20 backdrop-blur-sm'
              }`}>
                <Bookmark className={`w-6 h-6 ${
                  currentPost.isSaved ? 'text-white fill-current' : 'text-white'
                }`} />
              </div>
            </button>

            <button className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Share className="w-6 h-6 text-white" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Swipe indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
        Swipe up for more experiences
      </div>
    </div>
  );
};

export default TravelFeedScreen;