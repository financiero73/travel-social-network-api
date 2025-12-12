import { Calendar, Clock, MapPin, Users, ArrowRight, Shuffle, ListFilter } from "lucide-react";
import React, { useState, useEffect } from 'react';

import BookingButton from './BookingButton';

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

interface DayPlan {
  date: string;
  selectedActivity?: ActivityRecommendation;
  options: ActivityRecommendation[];
}

interface DailyOptionsScreenProps {
  selectedRecommendations: ActivityRecommendation[];
  tripStartDate: string;
  tripEndDate: string;
  onNext: (dayPlans: DayPlan[]) => void;
  onBack: () => void;
  onActivityVideoView: (activityTitle: string, activityId: string) => void;
}

const DailyOptionsScreen: React.FC<DailyOptionsScreenProps> = ({
  selectedRecommendations,
  tripStartDate,
  tripEndDate,
  onNext,
  onBack,
  onActivityVideoView
}) => {
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [filterTag, setFilterTag] = useState<string>('all');

  // Generate day plans based on trip dates
  useEffect(() => {
    const generateDayPlans = () => {
      const start = new Date(tripStartDate);
      const end = new Date(tripEndDate);
      const days: DayPlan[] = [];
      
      const current = new Date(start);
      while (current <= end) {
        const dateStr = current.toISOString().split('T')[0];
        
        // Generate 3-5 diverse options for each day
        const dayOptions = generateDailyOptions(selectedRecommendations, days.length);
        
        days.push({
          date: dateStr,
          options: dayOptions
        });
        
        current.setDate(current.getDate() + 1);
      }
      
      setDayPlans(days);
    };

    generateDayPlans();
  }, [selectedRecommendations, tripStartDate, tripEndDate]);

  // Generate curated options for each day
  const generateDailyOptions = (recommendations: ActivityRecommendation[], dayIndex: number): ActivityRecommendation[] => {
    // Create variations and alternative options
    const baseOptions = [...recommendations];
    
    // Add some additional curated options based on day and preferences
    const additionalOptions: ActivityRecommendation[] = [
      {
        id: `day${dayIndex}_relax`,
        title: 'Beach Day & Spa Time',
        description: 'Unwind with a full day of beach relaxation and rejuvenating spa treatments.',
        thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
        rating: 4.7,
        priceRange: '€50-150',
        duration: 'Full day',
        tags: ['relaxing', 'beach', 'spa'],
        category: 'popular',
        bookingInfo: {
          locationName: 'Beach & Spa Relaxation Package',
          price: '€85/person',
          bookingType: 'experience',
          affiliateCode: `RELAX${dayIndex}`
        }
      },
      {
        id: `day${dayIndex}_adventure`,
        title: 'Extreme Adventure Package',
        description: 'Adrenaline-packed day with multiple adventure activities and thrills.',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        rating: 4.8,
        priceRange: '€120-200',
        duration: '8 hours',
        tags: ['adventure', 'extreme', 'adrenaline'],
        category: 'trending',
        bookingInfo: {
          locationName: 'Adventure Sports Combo',
          price: '€165/person',
          originalPrice: '€220/person',
          bookingType: 'activity',
          affiliateCode: `ADV${dayIndex}`
        }
      },
      {
        id: `day${dayIndex}_foodie`,
        title: 'Culinary Discovery Tour',
        description: 'Explore local cuisine with guided food tours and cooking experiences.',
        thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        rating: 4.9,
        priceRange: '€70-120',
        duration: '6 hours',
        tags: ['foodie', 'culture', 'local'],
        category: 'local_gem',
        bookingInfo: {
          locationName: 'Local Food Discovery Experience',
          price: '€95/person',
          bookingType: 'activity',
          affiliateCode: `FOOD${dayIndex}`
        }
      }
    ];

    // Combine and shuffle for variety
    const allOptions = [...baseOptions, ...additionalOptions];
    return allOptions.slice(0, 5); // Return 5 options per day
  };

  const selectActivityForDay = (dayIndex: number, activity: ActivityRecommendation) => {
    const updatedDayPlans = [...dayPlans];
    updatedDayPlans[dayIndex].selectedActivity = activity;
    setDayPlans(updatedDayPlans);
  };

  const shuffleOptionsForDay = (dayIndex: number) => {
    const updatedDayPlans = [...dayPlans];
    const shuffled = [...updatedDayPlans[dayIndex].options].sort(() => Math.random() - 0.5);
    updatedDayPlans[dayIndex].options = shuffled;
    setDayPlans(updatedDayPlans);
  };

  const getFilteredOptions = (options: ActivityRecommendation[]) => {
    if (filterTag === 'all') return options;
    return options.filter(option => option.tags.includes(filterTag));
  };

  const allTags = Array.from(new Set(dayPlans.flatMap(day => day.options.flatMap(option => option.tags))));

  const handleContinue = () => {
    onNext(dayPlans);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const completedDays = dayPlans.filter(day => day.selectedActivity).length;
  const totalDays = dayPlans.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-black">
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={onBack}
              className="absolute left-4 top-8 text-white hover:text-cyan-400 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-white mb-3">Plan Your Daily Adventures</h1>
            <p className="text-xl text-gray-300 mb-2">
              Choose activities for each day of your trip
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-white">{completedDays}/{totalDays} days planned</span>
            </div>
          </div>

          {/* Day Navigation */}
          <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
            {dayPlans.map((day, index) => (
              <button
                key={day.date}
                onClick={() => setCurrentDayIndex(index)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  currentDayIndex === index
                    ? 'bg-cyan-400 text-black font-semibold'
                    : day.selectedActivity
                      ? 'bg-green-600 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="text-sm">
                  Day {index + 1}
                </div>
                <div className="text-xs opacity-80">
                  {formatDate(day.date).split(',')[0]}
                </div>
              </button>
            ))}
          </div>

          {dayPlans.length > 0 && (
            <>
              {/* Current Day Header */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Day {currentDayIndex + 1} - {formatDate(dayPlans[currentDayIndex].date)}
                    </h2>
                    {dayPlans[currentDayIndex].selectedActivity ? (
                      <div className="flex items-center text-green-400">
                        <span className="mr-2">✓</span>
                        <span>Selected: {dayPlans[currentDayIndex].selectedActivity?.title}</span>
                      </div>
                    ) : (
                      <p className="text-gray-300">Choose your adventure for this day</p>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => shuffleOptionsForDay(currentDayIndex)}
                      className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all flex items-center space-x-2"
                    >
                      <Shuffle className="w-4 h-4" />
                      <span>Shuffle</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setFilterTag('all')}
                  className={`px-3 py-2 rounded-full text-sm transition-all ${
                    filterTag === 'all'
                      ? 'bg-cyan-400 text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  All Options
                </button>
                {allTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setFilterTag(tag)}
                    className={`px-3 py-2 rounded-full text-sm transition-all capitalize ${
                      filterTag === tag
                        ? 'bg-cyan-400 text-black'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Daily Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {getFilteredOptions(dayPlans[currentDayIndex].options).map((option) => {
                  const isSelected = dayPlans[currentDayIndex].selectedActivity?.id === option.id;
                  
                  return (
                    <div
                      key={option.id}
                      className={`bg-white/10 backdrop-blur-sm border-2 rounded-xl overflow-hidden transition-all transform hover:scale-105 cursor-pointer ${
                        isSelected 
                          ? 'border-cyan-400 shadow-lg shadow-cyan-400/20' 
                          : 'border-white/20 hover:border-white/40'
                      }`}
                      onClick={() => selectActivityForDay(currentDayIndex, option)}
                    >
                      {/* Image */}
                      <div className="relative h-48">
                        <img 
                          src={option.thumbnail}
                          alt={option.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-3 right-3 w-8 h-8 bg-cyan-400 text-black rounded-full flex items-center justify-center font-bold">
                            ✓
                          </div>
                        )}
                        
                        {/* Duration */}
                        <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm rounded-lg px-2 py-1">
                          <div className="flex items-center space-x-1 text-xs text-white">
                            <Clock className="w-3 h-3" />
                            <span>{option.duration}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-white font-bold text-lg mb-2">{option.title}</h3>
                        <p className="text-gray-300 text-sm mb-3 line-clamp-2">{option.description}</p>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {option.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* Price & Rating */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-green-400 font-semibold">{option.priceRange}</span>
                          <span className="text-yellow-400">★ {option.rating}</span>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onActivityVideoView(option.title, option.id);
                            }}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            📹 Watch Real Experiences
                          </button>
                          <BookingButton
                            locationName={option.bookingInfo.locationName}
                            price={option.bookingInfo.price}
                            originalPrice={option.bookingInfo.originalPrice}
                            videoId={`daily-${option.id}`}
                            creatorId={option.creatorInfo?.username || 'daily_planner'}
                            affiliateCode={option.bookingInfo.affiliateCode}
                            bookingType={option.bookingInfo.bookingType}
                            size="small"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Continue Button */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={completedDays === 0}
              className={`px-8 py-4 rounded-xl text-lg font-bold transition-all transform inline-flex items-center ${
                completedDays > 0
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:scale-105 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {completedDays > 0 
                ? `Build Final Itinerary (${completedDays}/${totalDays} days planned)` 
                : 'Select activities to continue'
              }
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyOptionsScreen;