import React, { useEffect, useState } from 'react';
import MainApp from './MainApp';

const OnboardingScreen: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showMainApp, setShowMainApp] = useState(false);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  useEffect(() => {
    setIsLoaded(true);
    // Generate floating particles
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 4
    }));
    setParticles(newParticles);
    
    // Auto-transition to main app after 3 seconds
    const timer = setTimeout(() => {
      setShowMainApp(true);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  if (showMainApp) {
    return <MainApp />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Futuristic Space Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-black" />
      
      {/* Earth Image */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden">
        <img 
          src="https://inner-apps.s3.us-east-2.amazonaws.com/ac083b77-89fd-4da7-b779-bc6cdbefb1f7/fb7f51da-35d3-4b8b-b5fb-4a54522727a4/public/80440148-1733-4197-b8c8-05ce4e973db2.png" 
          alt="Earth from space" 
          className="w-full h-full object-cover opacity-40"
          style={{ transform: 'scale(1.2) translateY(20%)' }}
        />
      </div>
      
      {/* Overlay gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/50" />
      
      {/* Floating Stars/Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: '4s'
          }}
        />
      ))}

      {/* Futuristic Grid Lines */}
      <div className="absolute inset-0 opacity-20">
        {/* Horizontal lines */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"
            style={{
              top: `${i * 12.5}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
        {/* Vertical lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse"
            style={{
              left: `${i * 16.66}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8 text-center">
        
        {/* Abstract Geometric Avatar */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 geometric-shape animate-slow-spin">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="geometricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F5F5F5" />
                    <stop offset="50%" stopColor="#C0C0C0" />
                    <stop offset="100%" stopColor="#E8E8E8" />
                  </linearGradient>
                </defs>
                <polygon 
                  points="50,5 85,30 85,70 50,95 15,70 15,30" 
                  fill="url(#geometricGradient)"
                  className="animate-pulse"
                />
                <polygon 
                  points="50,15 75,35 75,65 50,85 25,65 25,35" 
                  fill="rgba(255,255,255,0.2)"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-5xl mb-12 metal-silver-text" style={{ fontFamily: 'cursive', color: '#C0C0C0' }}>
            Welcome, let's plan your next adventure
          </h1>
        </div>


      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes slow-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse-gentle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-slow-spin {
          animation: slow-spin 20s linear infinite;
        }
        
        .animate-pulse-gentle {
          animation: pulse-gentle 3s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 4s ease-in-out infinite;
        }
        
        .metal-silver-text {
          text-shadow: 
            1px 1px 2px rgba(0, 0, 0, 0.8),
            -1px -1px 1px rgba(255, 255, 255, 0.3);
          font-weight: bold;
        }
      ` }} />
    </div>
  );
};

export default OnboardingScreen;