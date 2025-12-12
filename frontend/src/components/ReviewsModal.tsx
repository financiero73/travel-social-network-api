import React, { useState } from 'react';
import { Star, X, MapPin, Calendar, ThumbsUp, User } from 'lucide-react';

interface Review {
  id: string;
  author_name: string;
  author_photo?: string;
  rating: number;
  text: string;
  relative_time_description: string;
  profile_photo_url?: string;
  helpful_count?: number;
}

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationName: string;
  overallRating: number;
  totalReviews: number;
  reviews: Review[];
}

const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  locationName,
  overallRating,
  totalReviews,
  reviews
}) => {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');

  if (!isOpen) return null;

  const filteredReviews = reviews.filter(review => 
    selectedRating ? review.rating === selectedRating : true
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'highest': return b.rating - a.rating;
      case 'lowest': return a.rating - b.rating;
      case 'oldest': return a.id.localeCompare(b.id);
      default: return b.id.localeCompare(a.id); // newest
    }
  });

  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution.reverse(); // 5 stars first
  };

  const renderStars = (rating: number, size = 'w-4 h-4') => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`${size} ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'
        }`} 
      />
    ));
  };

  const distribution = getRatingDistribution();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Reviews & Ratings</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 font-medium">{locationName}</span>
          </div>
          
          {/* Overall Rating */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{overallRating.toFixed(1)}</div>
              <div className="flex space-x-1 mb-1">
                {renderStars(Math.round(overallRating))}
              </div>
              <div className="text-sm text-gray-400">{totalReviews.toLocaleString()} reviews</div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1 space-y-1">
              {distribution.map((count, index) => {
                const starLevel = 5 - index;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={starLevel} className="flex items-center space-x-2 text-sm">
                    <span className="text-gray-400 w-6">{starLevel}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-full rounded-full transition-all" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedRating(null)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedRating === null 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center space-x-1 ${
                    selectedRating === rating 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <span>{rating}</span>
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                </button>
              ))}
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 text-white rounded-lg px-3 py-1 text-sm border border-gray-600"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="highest">Highest rated</option>
              <option value="lowest">Lowest rated</option>
            </select>
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="overflow-y-auto max-h-96">
          {sortedReviews.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Star className="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>No reviews found for the selected filter.</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {sortedReviews.map((review) => (
                <div key={review.id} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {review.author_photo ? (
                        <img 
                          src={review.author_photo} 
                          alt={review.author_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {review.author_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium text-white">{review.author_name}</div>
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-gray-400 text-sm">{review.relative_time_description}</span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm leading-relaxed mb-3">{review.text}</p>
                      
                      {review.helpful_count && (
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{review.helpful_count} people found this helpful</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/50">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Reviews powered by Google Places</span>
            <span>{filteredReviews.length} of {totalReviews} reviews shown</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;