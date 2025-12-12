import React, { useState } from 'react';
import TripSetupScreen from './TripSetupScreen';
import PreferencesScreen from './PreferencesScreen';
import AIRecommendationsScreen from './AIRecommendationsScreen';
import DailyOptionsScreen from './DailyOptionsScreen';
import ItineraryBuilderScreen from './ItineraryBuilderScreen';
import ActivityVideoScreen from './ActivityVideoScreen';

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

interface DayPlan {
  date: string;
  selectedActivity?: ActivityRecommendation;
  options: ActivityRecommendation[];
}

type PlanningStep = 'setup' | 'preferences' | 'recommendations' | 'daily-options' | 'itinerary' | 'activity-videos';

const PlanTripScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<PlanningStep>('setup');
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [preferences, setPreferences] = useState<TripPreferences | null>(null);
  const [selectedRecommendations, setSelectedRecommendations] = useState<ActivityRecommendation[]>([]);
  const [dayPlans, setDayPlans] = useState<DayPlan[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<{ title: string; id: string } | null>(null);

  const handleTripSetup = (data: TripData) => {
    setTripData(data);
    setCurrentStep('preferences');
  };

  const handlePreferences = (prefs: TripPreferences) => {
    setPreferences(prefs);
    setCurrentStep('recommendations');
  };

  const handleRecommendations = (recommendations: ActivityRecommendation[]) => {
    setSelectedRecommendations(recommendations);
    setCurrentStep('daily-options');
  };

  const handleDailyOptions = (plans: DayPlan[]) => {
    setDayPlans(plans);
    setCurrentStep('itinerary');
  };

  const handleSaveTrip = () => {
    // In a real app, this would save to backend with commission tracking
    const totalBookings = dayPlans.filter(day => day.selectedActivity).length;
    alert(`Trip saved successfully! \n\n${totalBookings} bookings created with commission tracking:\n- Platform Owner: 70% commission\n- Content Creators: 30% commission`);
  };

  const handleActivityVideoView = (activityTitle: string, activityId: string) => {
    setSelectedActivity({ title: activityTitle, id: activityId });
    setCurrentStep('activity-videos');
  };

  const goBack = () => {
    switch (currentStep) {
      case 'preferences':
        setCurrentStep('setup');
        break;
      case 'recommendations':
        setCurrentStep('preferences');
        break;
      case 'daily-options':
        setCurrentStep('recommendations');
        break;
      case 'itinerary':
        setCurrentStep('daily-options');
        break;
      case 'activity-videos':
        // Go back to wherever the user came from
        setCurrentStep('recommendations'); // Default to recommendations
        break;
    }
  };

  switch (currentStep) {
    case 'setup':
      return <TripSetupScreen onNext={handleTripSetup} />;
    
    case 'preferences':
      return (
        <PreferencesScreen 
          onNext={handlePreferences} 
          onBack={goBack}
        />
      );
    
    case 'recommendations':
      return (
        <AIRecommendationsScreen 
          tripData={tripData!}
          preferences={preferences!}
          onNext={handleRecommendations}
          onBack={goBack}
          onActivityVideoView={handleActivityVideoView}
        />
      );
    
    case 'daily-options':
      return (
        <DailyOptionsScreen 
          selectedRecommendations={selectedRecommendations}
          tripStartDate={tripData!.startDate}
          tripEndDate={tripData!.endDate}
          onNext={handleDailyOptions}
          onBack={goBack}
          onActivityVideoView={handleActivityVideoView}
        />
      );
    
    case 'itinerary':
      return (
        <ItineraryBuilderScreen 
          dayPlans={dayPlans}
          tripData={tripData!}
          onBack={goBack}
          onSave={handleSaveTrip}
          onActivityVideoView={handleActivityVideoView}
        />
      );
    
    case 'activity-videos':
      return (
        <ActivityVideoScreen 
          activityTitle={selectedActivity?.title || 'Adventure'}
          activityId={selectedActivity?.id || ''}
          onBack={goBack}
        />
      );
    
    default:
      return <TripSetupScreen onNext={handleTripSetup} />;
  }
};

export default PlanTripScreen;