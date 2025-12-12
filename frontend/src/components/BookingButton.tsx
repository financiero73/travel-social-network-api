import React, { useState } from 'react';
import { ExternalLink, DollarSign, Users, Calendar } from 'lucide-react';

interface BookingButtonProps {
  locationName: string;
  price?: string;
  originalPrice?: string;
  videoId?: string;
  creatorId?: string;
  affiliateCode?: string;
  bookingType: 'hotel' | 'restaurant' | 'activity' | 'flight' | 'experience';
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const BookingButton: React.FC<BookingButtonProps> = ({
  locationName,
  price = 'Book Now',
  originalPrice,
  videoId,
  creatorId,
  affiliateCode,
  bookingType,
  className = '',
  size = 'medium'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const handleBooking = async () => {
    setIsBooking(true);
    
    // Track the booking attempt with affiliate data
    const trackingData = {
      videoId,
      creatorId,
      affiliateCode,
      locationName,
      bookingType,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };
    
    console.log('Booking tracking data:', trackingData);
    
    // Base URL de ejemplo para la simulación de afiliado (Booking.com)
    const BASE_BOOKING_URL = 'https://www.booking.com/searchresults.html';
    
    // Construir el enlace de afiliado de ejemplo
    const affiliateLink = `${BASE_BOOKING_URL}?ss=${encodeURIComponent(locationName)}&aid=MANUS_APP_ID&label=${affiliateCode || 'NO_CODE'}`;
    
    // Mostrar el enlace de ejemplo en un alert
    alert(`¡Simulación de Redirección de Afiliado!\n\nEn un entorno real, serías redirigido a:\n\n${affiliateLink}\n\nCódigo de Afiliado Rastreado: ${affiliateCode || 'NO_CODE'}`);
    setIsBooking(false);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-1 text-xs';
      case 'large':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-sm';
    }
  };

  const getIcon = () => {
    switch (bookingType) {
      case 'hotel':
        return '🏨';
      case 'restaurant':
        return '🍽️';
      case 'activity':
        return '🎯';
      case 'flight':
        return '✈️';
      case 'experience':
        return '⭐';
      default:
        return '📍';
    }
  };

  return (
    <button
      onClick={handleBooking}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isBooking}
      className={`
        relative overflow-hidden font-semibold rounded-full transition-all duration-300 transform
        ${getSizeClasses()}
        ${
          isHovered 
            ? 'bg-gradient-to-r from-green-400 to-emerald-500 scale-105 shadow-lg' 
            : 'bg-gradient-to-r from-blue-500 to-cyan-400'
        }
        ${isBooking ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl'}
        text-black border-2 border-white/20
        ${className}
      `}
    >
      {/* Animated background */}
      <div className={`absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform transition-transform duration-700 ${
        isHovered ? 'translate-x-full' : '-translate-x-full'
      }`} />
      
      <div className="relative flex items-center space-x-2">
        <span className="text-lg">{getIcon()}</span>
        
        {isBooking ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <span>Booking...</span>
          </div>
        ) : (
          <>
            <span>{price}</span>
            {originalPrice && (
              <span className="line-through text-black/60 text-xs">{originalPrice}</span>
            )}
            <ExternalLink className="w-4 h-4" />
          </>
        )}
      </div>
      
      {/* Commission indicator */}
      {size !== 'small' && (
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full">
          💰
        </div>
      )}
    </button>
  );
};

export default BookingButton;