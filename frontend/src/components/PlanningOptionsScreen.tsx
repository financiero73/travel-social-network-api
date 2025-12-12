import React, { useState } from 'react';
import { MapPin, Plane, Search, Compass } from 'lucide-react';
import MainApp from './MainApp';

interface PlanningOption {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
}

const PlanningOptionsScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeed, setShowFeed] = useState(false);

  const options: PlanningOption[] = [
    {
      id: 'local',
      title: 'Plan a local adventure',
      icon: <MapPin className="w-8 h-8" />,
      description: 'Discover hidden gems in your area'
    },
    {
      id: 'vacation',
      title: 'Plan a vacation',
      icon: <Plane className="w-8 h-8" />,
      description: 'Create the perfect getaway trip'
    },
    {
      id: 'browse',
      title: 'Browse my city',
      icon: <Search className="w-8 h-8" />,
      description: 'Explore what\'s happening around you'
    },
    {
      id: 'explore',
      title: 'Explore mode',
      icon: <Compass className="w-8 h-8" />,
      description: 'Let me surprise you with recommendations'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };
  
  const handleContinue = () => {
    setShowFeed(true);
  };

  if (showFeed) {
    return <MainApp />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Futuristic Space Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black" />
      
      {/* Earth Image - positioned lower for this screen */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <img 
          src="https://inner-apps.s3.us-east-2.amazonaws.com/ac083b77-89fd-4da7-b779-bc6cdbefb1f7/fb7f51da-35d3-4b8b-b5fb-4a54522727a4/public/80440148-1733-4197-b8c8-05ce4e973db2.png" 
          alt="Earth from space" 
          className="w-full h-full object-cover opacity-30"
          style={{ transform: 'scale(1.4) translateY(30%)' }}
        />
      </div>
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
      
      {/* Floating Stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70 animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>
      
      {/* Futuristic Grid Elements */}
      <div className="absolute inset-0 opacity-15">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
            style={{
              top: `${20 + i * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl mb-4" style={{ fontFamily: 'cursive', color: '#00E5FF' }}>
            To start planning,
          </h1>
          <h2 className="text-3xl mb-8" style={{ fontFamily: 'cursive', color: '#42A5F5' }}>
            tell me what you're looking for
          </h2>
        </div>

        {/* Options Grid */}
        <div className="w-full max-w-md space-y-4">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={`
                p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105
                ${
                  selectedOption === option.id
                    ? 'border-cyan-400 bg-cyan-400/10 shadow-lg shadow-cyan-400/20'
                    : 'border-slate-600 bg-slate-800/40 hover:border-cyan-300 hover:shadow-md backdrop-blur-sm'
                }
              `}
              onClick={() => handleOptionSelect(option.id)}
              style={{
                animationDelay: `${index * 200}ms`
              }}
            >
              <div className="flex items-center space-x-4">
                <div 
                  className="p-3 rounded-full" 
                  style={{ 
                    backgroundColor: selectedOption === option.id ? '#00E5FF' : 'rgba(0, 229, 255, 0.2)',
                    color: selectedOption === option.id ? 'black' : '#00E5FF'
                  }}
                >
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 
                    className="text-lg font-semibold mb-1"
                    style={{ color: '#00E5FF' }}
                  >
                    {option.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: '#42A5F5' }}
                  >
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Button */}
        {selectedOption && (
          <div className="mt-8 animate-fade-in">
            <button 
              onClick={handleContinue}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Continue
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default PlanningOptionsScreen;