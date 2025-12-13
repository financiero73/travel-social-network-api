import { Heart, Bookmark, MessageCircle, Share, MapPin, Star, UserCheck, Play, Pause, Volume2, VolumeX, PlusCircle } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { UserButton } from '@clerk/clerk-react';

import { socialServicesGetSocialFeed, socialServicesLikePost, socialServicesSavePostToWishlist, socialServicesFollowUser, socialServicesCreateTravelPost } from '@/lib/sdk';
import ReviewsButton from './ReviewsButton';
import CreatePostModal from './CreatePostModal';

interface Post {
  post: {
    id: string;
    caption: string;
    images: string[];
    video_url?: string;
    video_thumbnail?: string;
    location_name: string;
    country: string;
    city?: string;
    post_type: string;
    category: string;
    tags: string[];
    likes_count: number;
    saves_count: number;
    comments_count: number;
    experience_rating?: number;
    price_range?: string;
    booking_info?: {
      price?: string;
      booking_url?: string;
      affiliate_code?: string;
    };
    created_at: string;
    is_sponsored: boolean;
  };
  author: {
    id: string;
    username: string;
    display_name: string;
    profile_image_url?: string;
    is_verified: boolean;
    is_creator: boolean;
    followers_count: number;
  };
  is_liked: boolean;
  is_saved: boolean;
}

interface SocialFeedProps {
  userId: string | null;
}

// Video Player Component with actual video playback
const VideoPlayer: React.FC<{
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
}> = ({ videoUrl, thumbnailUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
    showControlsTemporarily();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
    showControlsTemporarily();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleVideoClick = () => {
    togglePlay();
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * videoDuration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  return (
    <div 
      className="h-full w-full relative"
      onMouseMove={showControlsTemporarily}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => !isPlaying ? setShowControls(true) : setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        poster={thumbnailUrl}
        muted={isMuted}
        onClick={handleVideoClick}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Controls Overlay */}
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Center Play/Pause Button */}
        {(!isPlaying || showControls) && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handleVideoClick}
          >
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl hover:bg-white transition-all hover:scale-110">
              {isPlaying ? (
                <Pause className="w-10 h-10 text-black" />
              ) : (
                <Play className="w-10 h-10 text-black ml-2" />
              )}
            </div>
          </div>
        )}
        
        {/* Bottom Controls */}
        <div className="absolute bottom-20 left-4 right-4 space-y-2">
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-white/30 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${videoDuration > 0 ? (currentTime / videoDuration) * 100 : 0}%` }}
            />
          </div>
          
          {/* Time and Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-white" />
                )}
              </button>
              <span className="text-white text-xs font-medium">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>
            </div>
            
            <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1">
              <span className="text-white text-xs font-medium">{duration}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SocialFeed: React.FC<SocialFeedProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleCreatePost = () => {
    setIsModalOpen(true);
  };

  const handleSubmitPost = async (postData: any) => {
    try {
      // Validate userId before creating post
      if (!userId) {
        throw new Error('User ID not loaded. Please refresh the page.');
      }
      
      console.log('📋 Using user_id:', userId);
      console.log('🚀 Creating post with data:', postData);
      
      const apiUrl = import.meta.env.VITE_API_URL || 'https://travel-social-network-api.onrender.com';
      
      // Create abort controller with 60 second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      console.log('⏳ Please wait... This may take up to 60 seconds if the backend is waking up.');
      
      const response = await fetch(`${apiUrl}/api/social_services/create_travel_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Post created successfully:', result);
      
      setIsModalOpen(false);
      loadFeed();
    } catch (error: any) {
      console.error('❌ Error creating post:', error);
      let errorMessage = 'Failed to create post. ';
      
      if (error.name === 'AbortError') {
        errorMessage += 'Request timed out after 60 seconds. The backend may be sleeping. Please try again in a moment.';
      } else if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      // Re-throw with user-friendly message
      throw new Error(errorMessage);
    }
  };
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadFeed();
  }, []);

  // Mock data for immediate display
  const mockPosts: Post[] = [
    {
      post: {
        id: '1',
        caption: 'Sunrise yoga session overlooking the rice terraces in Ubud! 🧘‍♀️ This moment of peace before the world wakes up is exactly why I fell in love with Bali. Who else starts their day with gratitude and stretches? ✨ #BaliVibes #YogaLife #Mindfulness',
        images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop'],
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        video_thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
        location_name: 'Tegallalang Rice Terraces',
        country: 'Indonesia',
        city: 'Ubud',
        post_type: 'experience',
        category: 'wellness',
        tags: ['yoga', 'sunrise', 'bali', 'mindfulness', 'rice_terraces'],
        likes_count: 2147,
        saves_count: 428,
        comments_count: 89,
        experience_rating: 4.9,
        booking_info: {
          price: '$35/session',
          booking_url: 'https://example.com/uluwatu-yoga',
          affiliate_code: 'SARAH_YOGA35'
        },
        created_at: '2024-08-20T06:30:00Z',
        is_sponsored: false
      },
      author: {
        id: 'user1',
        username: 'sarah_wanderlust',
        display_name: 'Sarah Chen',
        profile_image_url: 'https://images.unsplash.com/photo-1494790108755-2616b812b0c1?w=400&h=400&fit=crop&crop=face',
        is_verified: true,
        is_creator: true,
        followers_count: 15420
      },
      is_liked: false,
      is_saved: false
    },
    {
      post: {
        id: '2',
        caption: 'BEST ramen I\'ve ever had! 🍜 This tiny 8-seat shop in Shibuya has been perfecting their tonkotsu recipe for 45 years. The broth is so rich it coats the spoon, and the chashu melts in your mouth. Worth every minute of the 3-hour wait! #TokyoRamen #AuthenticJapan #FoodieFinds',
        images: ['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=800&fit=crop'],
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        video_thumbnail: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=800&fit=crop',
        location_name: 'Menya Saimi Shibuya',
        country: 'Japan',
        city: 'Tokyo',
        post_type: 'food',
        category: 'foodie',
        tags: ['ramen', 'tokyo', 'authentic', 'local_favorite', 'tonkotsu'],
        likes_count: 1623,
        saves_count: 312,
        comments_count: 67,
        experience_rating: 4.8,
        price_range: '$$',
        booking_info: {
          price: '¥1,400 (~$9)',
          booking_url: 'https://example.com/tokyo-ramen-tour',
          affiliate_code: 'MARCO_RAMEN'
        },
        created_at: '2024-08-19T14:20:00Z',
        is_sponsored: false
      },
      author: {
        id: 'user2',
        username: 'marco_eats_world',
        display_name: 'Marco Rodriguez',
        profile_image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
        is_verified: true,
        is_creator: true,
        followers_count: 9870
      },
      is_liked: false,
      is_saved: false
    }
  ];

  const loadFeed = async (pageNum = 0) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);
      
      // Try to load real data, fallback to mock data
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'https://travel-social-network-api.onrender.com';
        
        // Create abort controller with 60 second timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const response = await fetch(`${apiUrl}/api/social_services/get_social_feed`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId || "0b447f7b-9274-4a47-8ce2-4c113eb3cb6e",
            page: pageNum,
            limit: 20,
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const newPosts = data.posts || [];
        
        if (pageNum === 0) {
          setPosts(newPosts.length > 0 ? newPosts : mockPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }
        
        setHasMore(newPosts.length === 20);
        setPage(pageNum);
      } catch (apiError) {
        console.log('API not available, using mock data:', apiError);
        if (pageNum === 0) {
          setPosts(mockPosts);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading feed:', error);
      // Fallback to mock data
      if (pageNum === 0) {
        setPosts(mockPosts);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    try {
      if (!userId) {
        console.error('❌ Cannot like post: User ID not loaded');
        alert('Please wait for your profile to load before liking posts.');
        return;
      }
      
      console.log('❤️ Liking post:', postId, 'with user_id:', userId);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://travel-social-network-api.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/social_services/like_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: postId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('❤️ Like action:', data);
      
      // Update local state
      setPosts(prev => prev.map(post => 
        post.post.id === postId 
          ? {
              ...post,
              is_liked: !currentlyLiked,
              post: { ...post.post, likes_count: data.likes_count }
            }
          : post
      ));
    } catch (error) {
      console.error('❌ Error liking post:', error);
    }
  };

  const handleSave = async (postId: string, currentlySaved: boolean, collectionName?: string) => {
    try {
      if (!userId) {
        console.error('❌ Cannot save post: User ID not loaded');
        alert('Please wait for your profile to load before saving posts.');
        return;
      }
      
      console.log('💾 Saving post:', postId, 'with user_id:', userId);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://travel-social-network-api.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/social_services/save_post_to_wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          post_id: postId,
          collection_name: collectionName || 'My Wishlist'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔖 Save action:', data);
      
      // Update local state
      setPosts(prev => prev.map(post => 
        post.post.id === postId 
          ? {
              ...post,
              is_saved: !currentlySaved,
              post: { ...post.post, saves_count: data.saves_count }
            }
          : post
      ));
    } catch (error) {
      console.error('❌ Error saving post:', error);
    }
  };

  const handleFollow = async (authorId: string) => {
    try {
      if (!userId) {
        console.error('❌ Cannot follow user: User ID not loaded');
        alert('Please wait for your profile to load before following users.');
        return;
      }
      
      console.log('👤 Following user:', authorId, 'with user_id:', userId);
      const apiUrl = import.meta.env.VITE_API_URL || 'https://travel-social-network-api.onrender.com';
      
      const response = await fetch(`${apiUrl}/api/social_services/follow_user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          follower_id: userId,
          following_id: authorId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('👥 Follow action:', data);
      
      // Optionally update UI to show followed state
    } catch (error) {
      console.error('❌ Error following user:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const loadMore = () => {
    if (hasMore && !loadingMore) {
      loadFeed(page + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your feed...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-black overflow-hidden relative">
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm p-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-cyan-400">Social Feed</h1>
          <p className="text-sm text-gray-400">See what the community is exploring.</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCreatePost}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-full transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create Post</span>
          </button>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
                userButtonPopoverCard: "bg-gray-800 border border-gray-700",
                userButtonPopoverActionButton: "text-white hover:bg-gray-700"
              }
            }}
          />
        </div>
      </div>
      {/* TikTok-style full screen video feed */}
      <div className="h-full overflow-y-auto snap-y snap-mandatory">
        {posts.map((item, index) => {
          const { post, author, is_liked, is_saved } = item;
          
          return (
            <div key={`${post.id}-${index}`} className="h-full w-full relative flex snap-start flex-shrink-0">
              {/* Main Video Area */}
              <div className="flex-1 relative bg-black">
                {post.video_url ? (
                  <VideoPlayer
                    videoUrl={post.video_url}
                    thumbnailUrl={post.video_thumbnail || post.images[0]}
                    duration="1:24"
                  />
                ) : (
                  <div className="h-full w-full relative">
                    <img 
                      src={post.images[0]} 
                      alt="Travel content" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                
                {/* Top Overlay - Creator Info */}
                <div className="absolute top-4 left-4 right-20 z-10">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500 p-0.5">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                        {author.profile_image_url ? (
                          <img src={author.profile_image_url} alt={author.display_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-sm font-bold">{author.display_name.charAt(0)}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white text-sm">{author.username}</span>
                        {author.is_verified && (
                          <UserCheck className="w-4 h-4 text-blue-400" />
                        )}
                        <button 
                          onClick={() => handleFollow(author.id)}
                          className="text-blue-400 text-sm font-semibold hover:text-blue-300"
                        >
                          Follow
                        </button>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-300 text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{post.location_name}, {post.country}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Overlay - Caption and Booking */}
                <div className="absolute bottom-0 left-0 right-20 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 pt-12">
                  {/* Caption */}
                  <div className="text-white text-sm mb-3">
                    <span className="font-semibold mr-2">{author.username}</span>
                    <span>{post.caption}</span>
                  </div>
                  
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="text-blue-400 text-xs">#{tag}</span>
                      ))}
                    </div>
                  )}
                  
                  {/* Booking CTA */}
                  {post.booking_info && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-white font-semibold text-sm">Book this experience</div>
                          <div className="text-white/80 text-xs">{post.price_range || post.booking_info.price}</div>
                        </div>
                        <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                          Book Now
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <ReviewsButton
                          locationName={post.location_name}
                          size="small"
                          className="bg-white/20 hover:bg-white/30 border-white/30"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Rating Badge */}
                {post.experience_rating && (
                  <div className="absolute top-4 right-24 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm font-medium">{post.experience_rating}</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Right Sidebar - TikTok Style Actions */}
              <div className="w-16 bg-transparent flex flex-col justify-end items-center pb-24 space-y-6">
                {/* Like Button */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => handleLike(post.id, is_liked)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <Heart 
                      className={`w-7 h-7 ${
                        is_liked ? 'text-red-500 fill-current' : 'text-white'
                      }`} 
                    />
                  </button>
                  <span className="text-white text-xs mt-1 font-medium">{(post.likes_count / 1000).toFixed(1)}K</span>
                </div>
                
                {/* Comment Button */}
                <div className="flex flex-col items-center">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </button>
                  <span className="text-white text-xs mt-1 font-medium">{post.comments_count}</span>
                </div>
                
                {/* Save Button */}
                <div className="flex flex-col items-center">
                  <button 
                    onClick={() => handleSave(post.id, is_saved)}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <Bookmark 
                      className={`w-7 h-7 ${
                        is_saved ? 'text-yellow-400 fill-current' : 'text-white'
                      }`} 
                    />
                  </button>
                  <span className="text-white text-xs mt-1 font-medium">{(post.saves_count / 100).toFixed(1)}K</span>
                </div>
                
                {/* Share Button */}
                <div className="flex flex-col items-center">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all">
                    <Share className="w-7 h-7 text-white" />
                  </button>
                  <span className="text-white text-xs mt-1 font-medium">Share</span>
                </div>
                
                {/* Creator Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white bg-gradient-to-br from-purple-400 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center">
                    {author.profile_image_url ? (
                      <img src={author.profile_image_url} alt={author.display_name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold">{author.display_name.charAt(0)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Swipe indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {posts.slice(0, 3).map((_, index) => (
          <div key={index} className={`w-2 h-2 rounded-full ${
            index === 0 ? 'bg-white' : 'bg-white/40'
          }`} />
        ))}
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitPost}
        userId={userId || "b0a16eea-68b3-4e0f-8409-176b2ff77a8a"}
      />
    </div>
  );
};

export default SocialFeed;