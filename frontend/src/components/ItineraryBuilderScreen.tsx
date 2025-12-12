import { Calendar, Clock, MapPin, Share, Save, Download, Trash2, CreditCard } from "lucide-react";
import React, { useState } from 'react';

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

interface ItineraryBuilderScreenProps {
  dayPlans: DayPlan[];
  tripData: {
    destination: string;
    startDate: string;
    endDate: string;
    adults: number;
    children: number;
    tripType: string;
  };
  onBack: () => void;
  onSave: () => void;
  onActivityVideoView: (activityTitle: string, activityId: string) => void;
}

const ItineraryBuilderScreen: React.FC<ItineraryBuilderScreenProps> = ({
  dayPlans,
  tripData,
  onBack,
  onSave,
  onActivityVideoView
}) => {
  const [itinerary, setItinerary] = useState<DayPlan[]>(dayPlans);
  const [tripTitle, setTripTitle] = useState(`${tripData.destination} ${tripData.tripType} Trip`);
  const [isEditing, setIsEditing] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const moveActivityBetweenDays = (fromDay: number, toDay: number) => {
    const newItinerary = [...itinerary];
    const movedActivity = newItinerary[fromDay].selectedActivity;
    
    if (movedActivity) {
      // Remove from source day
      newItinerary[fromDay].selectedActivity = undefined;
      
      // Add to destination day (replacing existing if any)
      newItinerary[toDay].selectedActivity = movedActivity;
      
      setItinerary(newItinerary);
    }
  };

  const removeActivityFromDay = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].selectedActivity = undefined;
    setItinerary(newItinerary);
  };

  const addActivityToDay = (dayIndex: number, activity: ActivityRecommendation) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].selectedActivity = activity;
    setItinerary(newItinerary);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const calculateTotalCost = () => {
    return itinerary.reduce((total, day) => {
      if (day.selectedActivity) {
        const price = parseFloat(day.selectedActivity.bookingInfo.price.replace(/[^\d.]/g, ''));
        return total + (price * (tripData.adults + tripData.children));
      }
      return total;
    }, 0);
  };

  const plannedDays = itinerary.filter(day => day.selectedActivity).length;
  const totalDays = itinerary.length;
  const totalCost = calculateTotalCost();

  const handleShare = () => {
    // In a real app, this would generate a shareable link
    const shareText = `Check out my ${tripData.destination} itinerary: ${plannedDays} amazing activities planned!`;
    
    if (navigator.share) {
      navigator.share({
        title: tripTitle,
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText + ' ' + window.location.href);
      alert('Itinerary link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    // Create a simple text version of the itinerary
    let itineraryText = `${tripTitle}\n\n`;
    itineraryText += `Destination: ${tripData.destination}\n`;
    itineraryText += `Dates: ${tripData.startDate} to ${tripData.endDate}\n`;
    itineraryText += `Travelers: ${tripData.adults} adults${tripData.children > 0 ? `, ${tripData.children} children` : ''}\n\n`;
    
    itinerary.forEach((day, index) => {
      itineraryText += `Day ${index + 1} - ${formatDate(day.date)}\n`;
      if (day.selectedActivity) {
        itineraryText += `  • ${day.selectedActivity.title}\n`;
        itineraryText += `    ${day.selectedActivity.description}\n`;
        itineraryText += `    Duration: ${day.selectedActivity.duration} | Price: ${day.selectedActivity.bookingInfo.price}\n`;
      } else {
        itineraryText += `  • Free day\n`;
      }
      itineraryText += '\n';
    });
    
    const blob = new Blob([itineraryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tripTitle.replace(/\s+/g, '_')}_Itinerary.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            
            <div className="flex items-center justify-center mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  onBlur={() => setIsEditing(false)}
                  onKeyPress={(e) => e.key === 'Enter' && setIsEditing(false)}
                  className="text-4xl font-bold text-white bg-transparent border-b-2 border-cyan-400 outline-none text-center"
                  autoFocus
                />
              ) : (
                <h1 
                  className="text-4xl font-bold text-white cursor-pointer flex items-center"
                  onClick={() => setIsEditing(true)}
                >
                  {tripTitle}
                  <CreditCard className="w-5 h-5 ml-2 opacity-60" />
                </h1>
              )}
            </div>
            
            <p className="text-xl text-gray-300 mb-4">
              Your personalized {totalDays}-day itinerary
            </p>
            
            <div className="flex justify-center space-x-6 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-cyan-400 font-semibold">{plannedDays}/{totalDays}</span>
                <span className="text-gray-300 ml-2">days planned</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <span className="text-green-400 font-semibold">€{totalCost.toFixed(0)}</span>
                <span className="text-gray-300 ml-2">estimated total</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Share className="w-4 h-4" />
              <span>Share Trip</span>
            </button>
            <button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Trip</span>
            </button>
            <button
              onClick={handleDownload}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>

          {/* Itinerary Builder */}
            <div className="space-y-6">
              {itinerary.map((day, dayIndex) => (
                <div key={day.date} className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-black font-bold">
                        {dayIndex + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {formatDate(day.date)}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Day {dayIndex + 1} of {totalDays}
                        </p>
                      </div>
                    </div>
                    
                    {day.selectedActivity && (
                      <div className="flex space-x-2">
                        {/* Move to other days */}
                        {dayIndex > 0 && (
                          <button
                            onClick={() => moveActivityBetweenDays(dayIndex, dayIndex - 1)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                            title="Move to previous day"
                          >
                            ← Day {dayIndex}
                          </button>
                        )}
                        {dayIndex < totalDays - 1 && (
                          <button
                            onClick={() => moveActivityBetweenDays(dayIndex, dayIndex + 1)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                            title="Move to next day"
                          >
                            Day {dayIndex + 2} →
                          </button>
                        )}
                        <button
                          onClick={() => removeActivityFromDay(dayIndex)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Remove activity"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Day Container */}
                  <div className="min-h-32 border-2 border-dashed border-gray-600 bg-white/5 rounded-lg">
                    {day.selectedActivity ? (
                      <div className="p-4">
                        <div className="flex space-x-4">
                          <img 
                            src={day.selectedActivity.thumbnail}
                            alt={day.selectedActivity.title}
                            className="w-24 h-24 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-lg mb-2">
                              {day.selectedActivity.title}
                            </h4>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                              {day.selectedActivity.description}
                            </p>
                            
                            <div className="flex items-center space-x-4 mb-3">
                              <div className="flex items-center text-gray-400">
                                <Clock className="w-4 h-4 mr-1" />
                                <span className="text-sm">{day.selectedActivity.duration}</span>
                              </div>
                              <div className="flex items-center text-yellow-400">
                                <span className="text-sm">★ {day.selectedActivity.rating}</span>
                              </div>
                              <div className="flex items-center text-green-400">
                                <span className="text-sm font-semibold">
                                  {day.selectedActivity.bookingInfo.price}
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button
                                onClick={() => onActivityVideoView(day.selectedActivity!.title, day.selectedActivity!.id)}
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                              >
                                📹 Videos
                              </button>
                              <BookingButton
                                locationName={day.selectedActivity.bookingInfo.locationName}
                                price={day.selectedActivity.bookingInfo.price}
                                originalPrice={day.selectedActivity.bookingInfo.originalPrice}
                                videoId={`itinerary-${day.selectedActivity.id}`}
                                creatorId={day.selectedActivity.creatorInfo?.username || 'trip_planner'}
                                affiliateCode={day.selectedActivity.bookingInfo.affiliateCode}
                                bookingType={day.selectedActivity.bookingInfo.bookingType}
                                size="small"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 mb-4">No activity planned for this day</p>
                        
                        {/* Quick add options */}
                        <div className="flex flex-wrap justify-center gap-2">
                          {day.options.slice(0, 3).map((option) => (
                            <button
                              key={option.id}
                              onClick={() => addActivityToDay(dayIndex, option)}
                              className="px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm hover:bg-cyan-400/30 transition-colors"
                            >
                              + {option.title}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">Your Trip is Ready!</h3>
              <p className="text-gray-300 mb-6">
                You've planned {plannedDays} amazing activities. Book now to secure your spots!
              </p>
              <div className="space-y-4">
                <button
                  onClick={onSave}
                  className="w-full md:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transform transition-all shadow-lg"
                >
                  Save & Book All Activities
                </button>
                <p className="text-xs text-gray-400">
                  Estimated total: €{totalCost.toFixed(0)} for {tripData.adults + tripData.children} travelers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryBuilderScreen;