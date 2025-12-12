import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, MapPin, Clock, DollarSign, Users, Tag } from 'lucide-react';
import BookingButton from './BookingButton';

interface TripData {
  destination: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  tripType: string;
}

interface TripPreferences {
  vibe: string[];
  activities: string[];
  goals: string[];
}

interface ActivityRecommendation {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  rating: number;
  priceRange: string;
  duration: string;
  tags: string[];
  category: 'trending' | 'popular' | 'local_gem';
  creatorInfo?: {
    username: string;
    followers: string;
    verified: boolean;
  };
  bookingInfo: {
    locationName: string;
    price: string;
    originalPrice?: string;
    bookingType: 'hotel' | 'restaurant' | 'activity' | 'experience';
    affiliateCode: string;
  };
}

interface AIRecommendationsScreenProps {
  tripData: TripData;
  preferences: TripPreferences;
  onNext: (recommendations: ActivityRecommendation[]) => void;
  onBack: () => void;
  onActivityVideoView: (activityTitle: string, activityId: string) => void;
}

const AIRecommendationsScreen: React.FC<AIRecommendationsScreenProps> = ({ 
  tripData, 
  preferences, 
  onNext, 
  onBack,
  onActivityVideoView
}) => {
  const [recommendations, setRecommendations] = useState<ActivityRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecommendations, setSelectedRecommendations] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'popular' | 'local_gem'>('all');

  // Simulate AI generating recommendations based on preferences
  useEffect(() => {
    const generateRecommendations = () => {
      setLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const mockRecommendations: ActivityRecommendation[] = [
          {
            id: '1',
            title: 'Sunset Catamaran Sailing',
            description: 'Experience the magic of a Santorini sunset while sailing around the caldera on a luxury catamaran.',
            thumbnail: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop',
            rating: 4.9,
            priceRange: '€80-120',
            duration: '5 hours',
            tags: ['romantic', 'water', 'sunset'],
            category: 'trending',
            creatorInfo: {
              username: '@santorini_adventures',
              followers: '125K',
              verified: true
            },
            bookingInfo: {
              locationName: 'Santorini Sunset Catamaran Tour',
              price: '€95/person',
              originalPrice: '€130/person',
              bookingType: 'activity',
              affiliateCode: 'SAN001'
            }
          },
          {
            id: '2',
            title: 'Traditional Greek Cooking Class',
            description: 'Learn to cook authentic Greek dishes with a local chef in a traditional village setting.',
            thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
            rating: 4.8,
            priceRange: '€60-80',
            duration: '4 hours',
            tags: ['foodie', 'culture', 'local'],
            category: 'local_gem',
            bookingInfo: {
              locationName: 'Greek Cooking Experience',
              price: '€75/person',
              bookingType: 'activity',
              affiliateCode: 'SAN002'
            }
          },
          {
            id: '3',
            title: 'Luxury Spa Day at Mystique Resort',
            description: 'Indulge in a full day of pampering with treatments overlooking the Aegean Sea.',
            thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
            rating: 4.9,
            priceRange: '€200-350',
            duration: 'Full day',
            tags: ['luxury', 'relaxing', 'spa'],
            category: 'popular',
            bookingInfo: {
              locationName: 'Mystique Resort Spa Package',
              price: '€280/person',
              originalPrice: '€380/person',
              bookingType: 'experience',
              affiliateCode: 'SAN003'
            }
          },
          {
            id: '4',
            title: 'Hidden Beach Hike & Swim',
            description: 'Discover secret beaches accessible only by foot through scenic hiking trails.',
            thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
            rating: 4.7,
            priceRange: '€40-60',
            duration: '6 hours',
            tags: ['adventure', 'nature', 'hidden'],
            category: 'local_gem',
            creatorInfo: {
              username: '@hidden_greece',
              followers: '89K',
              verified: false
            },
            bookingInfo: {
              locationName: 'Secret Beach Hiking Tour',
              price: '€50/person',
              bookingType: 'activity',
              affiliateCode: 'SAN004'
            }
          },
          {
            id: '5',
            title: 'Wine Tasting at Santo Wines',
            description: 'Sample award-winning local wines while enjoying panoramic views of the caldera.',
            thumbnail: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop',
            rating: 4.6,
            priceRange: '€35-50',
            duration: '2 hours',
            tags: ['wine', 'relaxing', 'views'],
            category: 'popular',
            bookingInfo: {
              locationName: 'Santo Wines Tasting Experience',
              price: '€42/person',
              bookingType: 'activity',
              affiliateCode: 'SAN005'
            }
          },
          {
            id: '6',
            title: 'Helicopter Tour of the Islands',
            description: 'See Santorini and neighboring islands from above on a thrilling helicopter ride.',
            thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
            rating: 4.9,
            priceRange: '€300-450',
            duration: '45 minutes',
            tags: ['luxury', 'adventure', 'views'],
            category: 'trending',
            creatorInfo: {
              username: '@luxury_greece',
              followers: '200K',
              verified: true
            },
            bookingInfo: {
              locationName: 'Santorini Helicopter Tour',
              price: '€380/person',
              originalPrice: '€480/person',
              bookingType: 'activity',
              affiliateCode: 'SAN006'
            }
          }
        ];
        
        setRecommendations(mockRecommendations);
        setLoading(false);
      }, 2000);
    };

    generateRecommendations();
  }, [tripData, preferences]);

  const filteredRecommendations = recommendations.filter(rec => 
    activeFilter === 'all' || rec.category === activeFilter
  );

  const toggleRecommendation = (id: string) => {
    const newSelected = new Set(selectedRecommendations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRecommendations(newSelected);
  };

  const handleContinue = () => {
    const selected = recommendations.filter(rec => selectedRecommendations.has(rec.id));
    onNext(selected);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trending': return <TrendingUp className="w-4 h-4" />;
      case 'popular': return <Star className="w-4 h-4" />;
      case 'local_gem': return <MapPin className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trending': return 'bg-red-500';
      case 'popular': return 'bg-yellow-500';
      case 'local_gem': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-white text-2xl font-bold mb-2">AI is curating your perfect trip...</h2>
          <p className="text-gray-300">Analyzing {preferences.vibe.length + preferences.activities.length + preferences.goals.length} preferences for {tripData.destination}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={onBack}
              className="absolute left-4 top-8 text-white hover:text-cyan-400 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-white mb-3">Your Personalized Recommendations</h1>
            <p className="text-xl text-gray-300">
              AI found {recommendations.length} perfect activities for your {tripData.tripType} trip to {tripData.destination}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              {selectedRecommendations.size} selected • Select activities you'd like to include
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'all', label: 'All Recommendations', count: recommendations.length },
              { id: 'trending', label: 'Trending', count: recommendations.filter(r => r.category === 'trending').length },
              { id: 'popular', label: 'Popular', count: recommendations.filter(r => r.category === 'popular').length },
              { id: 'local_gem', label: 'Local Gems', count: recommendations.filter(r => r.category === 'local_gem').length }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeFilter === filter.id
                    ? 'bg-cyan-400 text-black font-semibold'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredRecommendations.map((rec) => {
              const isSelected = selectedRecommendations.has(rec.id);
              
              return (
                <div
                  key={rec.id}
                  className={`bg-white/10 backdrop-blur-sm border-2 rounded-xl overflow-hidden transition-all transform hover:scale-105 ${
                    isSelected ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-48">
                    <img 
                      src={rec.thumbnail}
                      alt={rec.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Category Badge */}
                    <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-white text-xs font-semibold flex items-center space-x-1 ${getCategoryColor(rec.category)}`}>
                      {getCategoryIcon(rec.category)}
                      <span className="capitalize">{rec.category.replace('_', ' ')}</span>
                    </div>
                    
                    {/* Selection checkbox */}
                    <button
                      onClick={() => toggleRecommendation(rec.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected 
                          ? 'bg-cyan-400 border-cyan-400 text-black' 
                          : 'bg-white/20 border-white/50 text-white hover:bg-white/30'
                      }`}
                    >
                      {isSelected && '✓'}
                    </button>
                    
                    {/* Creator info */}
                    {rec.creatorInfo && (
                      <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                        <div className="flex items-center space-x-2 text-xs text-white">
                          <span>{rec.creatorInfo.username}</span>
                          {rec.creatorInfo.verified && <span className="text-blue-400">✓</span>}
                          <span className="text-gray-300">{rec.creatorInfo.followers}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-white font-bold text-lg mb-2">{rec.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{rec.description}</p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {rec.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300 flex items-center"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Details */}
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-white">{rec.rating}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{rec.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>{rec.priceRange}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => onActivityVideoView(rec.title, rec.id)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>📹</span>
                        <span>Watch Real Experiences</span>
                      </button>
                      <BookingButton
                        locationName={rec.bookingInfo.locationName}
                        price={rec.bookingInfo.price}
                        originalPrice={rec.bookingInfo.originalPrice}
                        videoId={`rec-${rec.id}`}
                        creatorId={rec.creatorInfo?.username || 'ai_recommendations'}
                        affiliateCode={rec.bookingInfo.affiliateCode}
                        bookingType={rec.bookingInfo.bookingType}
                        size="medium"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={selectedRecommendations.size === 0}
              className={`px-8 py-4 rounded-xl text-lg font-bold transition-all transform ${
                selectedRecommendations.size > 0
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:scale-105 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedRecommendations.size > 0 
                ? `Build Itinerary (${selectedRecommendations.size} activities)` 
                : 'Select at least one activity'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationsScreen;