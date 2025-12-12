import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import ReviewsModal from './ReviewsModal';

interface ReviewsButtonProps {
  locationName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const ReviewsButton: React.FC<ReviewsButtonProps> = ({ 
  locationName, 
  size = 'medium', 
  className = '' 
}) => {
  const [showReviews, setShowReviews] = useState(false);

  // Mock reviews data - in real app this would come from Google Places API
  const mockReviewsData = {
    overall_rating: 4.3,
    total_reviews: 147,
    reviews: [
      {
        id: '1',
        author_name: 'Michael Rodriguez',
        author_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        text: 'Absolutely incredible experience! The hidden waterfall was breathtaking and our guide was knowledgeable about the local ecosystem. The hike was challenging but totally worth it. Make sure to bring good hiking boots and plenty of water.',
        relative_time_description: '2 weeks ago',
        helpful_count: 12
      },
      {
        id: '2',
        author_name: 'Emma Thompson',
        rating: 4,
        text: 'Beautiful location and well-organized tour. The cave behind the waterfall was magical. Only downside was the weather - it rained heavily which made the trail quite slippery. Would recommend checking the forecast before booking.',
        relative_time_description: '1 month ago',
        helpful_count: 8
      },
      {
        id: '3',
        author_name: 'David Kim',
        author_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        rating: 5,
        text: 'This was the highlight of our Iceland trip! The secret location aspect made it feel like a real adventure. Our group was small (only 6 people) which made it feel exclusive. The photography opportunities were endless.',
        relative_time_description: '3 weeks ago',
        helpful_count: 15
      },
      {
        id: '4',
        author_name: 'Sarah Williams',
        rating: 3,
        text: 'Nice experience overall but quite pricey for what it is. The hike took longer than expected (3 hours instead of 2) and some parts of the trail were not well marked. The waterfall itself is stunning though.',
        relative_time_description: '2 months ago',
        helpful_count: 5
      },
      {
        id: '5',
        author_name: 'Carlos Mendoza',
        rating: 5,
        text: 'Fantastic adventure! As a local guide myself, I was impressed by the professionalism and safety measures. The hidden cave is truly a gem that most tourists never see. Highly recommend for adventure seekers.',
        relative_time_description: '1 week ago',
        helpful_count: 9
      },
      {
        id: '6',
        author_name: 'Jennifer Chen',
        author_photo: 'https://images.unsplash.com/photo-1494790108755-2616b812b0c1?w=100&h=100&fit=crop&crop=face',
        rating: 4,
        text: 'Amazing hidden spot! The coordinates they shared were accurate and the trail, while unmarked, was manageable. Swimming in the natural pool was refreshing after the hike. Just wish it wasn\'t so crowded on weekends.',
        relative_time_description: '5 days ago',
        helpful_count: 7
      },
      {
        id: '7',
        author_name: 'Alex Johnson',
        rating: 5,
        text: 'This place exceeded all expectations! The combination of the challenging hike, stunning waterfall, and secret cave made for an unforgettable day. Our guide shared fascinating stories about Icelandic folklore. Worth every penny!',
        relative_time_description: '1 month ago',
        helpful_count: 11
      },
      {
        id: '8',
        author_name: 'Lisa Parker',
        rating: 2,
        text: 'Unfortunately had a disappointing experience. The "secret" location wasn\'t so secret - lots of other tour groups there. The trail was muddy and poorly maintained. The waterfall is beautiful but you can find better spots for free.',
        relative_time_description: '6 weeks ago',
        helpful_count: 3
      }
    ]
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1.5 text-xs';
      case 'large':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 'w-3 h-3';
      case 'large':
        return 'w-5 h-5';
      default:
        return 'w-4 h-4';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowReviews(true)}
        className={`bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg font-medium transition-all flex items-center space-x-2 border border-white/20 hover:border-white/30 ${getSizeClasses()} ${className}`}
      >
        <MessageSquare className={`${getIconSize()}`} />
        <span>Reviews</span>
        <div className="flex items-center space-x-1">
          <Star className={`${getIconSize()} text-yellow-400 fill-current`} />
          <span>{mockReviewsData.overall_rating}</span>
        </div>
      </button>

      <ReviewsModal
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        locationName={locationName}
        overallRating={mockReviewsData.overall_rating}
        totalReviews={mockReviewsData.total_reviews}
        reviews={mockReviewsData.reviews}
      />
    </>
  );
};

export default ReviewsButton;