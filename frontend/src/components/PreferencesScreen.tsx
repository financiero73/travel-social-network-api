import React, { useState, useRef, useEffect } from 'react';
import { Waves, Mountain, TreePine, UtensilsCrossed, Martini, ArrowRight, Bot, Sparkles, Send, MessageCircle } from 'lucide-react';

interface TripPreferences {
  vibe: string[];
  activities: string[];
  goals: string[];
}

interface PreferencesScreenProps {
  onNext: (preferences: TripPreferences) => void;
  onBack: () => void;
}

const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ onNext, onBack }) => {
  const [preferences, setPreferences] = useState<TripPreferences>({
    vibe: [],
    activities: [],
    goals: []
  });
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{id: number, type: 'user' | 'ai', message: string}[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const vibes = [
    { id: 'relaxing', label: 'Relaxing & Laid Back', emoji: '🏖️', description: 'Beach, spa, resorts' },
    { id: 'active', label: 'Active & Adventurous', emoji: '🏃‍♂️', description: 'Hiking, biking, climbing' },
    { id: 'offgrid', label: 'Off-the-Grid', emoji: '🏕️', description: 'Remote cabins, nature stays' },
    { id: 'foodie', label: 'Food & Culture Focused', emoji: '🍜', description: 'Restaurants, markets, tours' },
    { id: 'luxury', label: 'Luxury & Nightlife', emoji: '🥂', description: 'Rooftops, stylish hotels, parties' }
  ];

  const activities = [
    { id: 'water', label: 'Water Sports', emoji: '🏄‍♂️', description: 'Boating, snorkeling, jet ski, surfing' },
    { id: 'adventure', label: 'Adventure Sports', emoji: '🧗‍♂️', description: 'Dirt biking, ziplining, cliff jumping, ATV' },
    { id: 'chill', label: 'Chill & Relax', emoji: '🧘‍♀️', description: 'Beach lounging, spas, wine tasting' },
    { id: 'social', label: 'Fun with Friends', emoji: '🎉', description: 'Concerts, nightlife, comedy shows' },
    { id: 'family', label: 'Family-Friendly', emoji: '👨‍👩‍👧‍👦', description: 'Aquariums, theme parks, safe activities' }
  ];

  const goals = [
    { id: 'romance', label: 'Romance', emoji: '💕', description: 'Couples activities, sunset dinners' },
    { id: 'bonding', label: 'Family Bonding', emoji: '👪', description: 'Educational, safe, affordable' },
    { id: 'thrill', label: 'Thrill-Seeking', emoji: '⚡', description: 'Adrenaline, extreme sports' },
    { id: 'recharge', label: 'Relax & Recharge', emoji: '🧘', description: 'Wellness retreats, quiet beaches' },
    { id: 'local', label: 'Explore Local Gems', emoji: '💎', description: 'Hidden spots, street food, markets' }
  ];

  const togglePreference = (category: keyof TripPreferences, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isAITyping]);

  const initializeChat = () => {
    setShowChat(true);
    if (chatMessages.length === 0) {
      setChatMessages([
        {
          id: 1,
          type: 'ai',
          message: "Hi! I'm your AI travel assistant. Instead of clicking through options, just tell me what kind of trip you're dreaming of!\n\nFor example:\n• 'I want a romantic getaway with amazing food and sunset views'\n• 'Looking for an adventure-packed trip with hiking and water sports'\n• 'Need a relaxing spa vacation to recharge'"
        }
      ]);
    }
  };

  const parseUserInput = (input: string): { vibe: string[], activities: string[], goals: string[] } => {
    const lowerInput = input.toLowerCase();
    
    const vibeKeywords = {
      'relaxing': ['relax', 'chill', 'peaceful', 'calm', 'spa', 'unwind', 'rest', 'laid back'],
      'active': ['active', 'adventure', 'exciting', 'thrill', 'adrenaline', 'extreme', 'wild', 'energetic'],
      'offgrid': ['remote', 'isolated', 'off-grid', 'wilderness', 'nature', 'escape', 'disconnect', 'cabin'],
      'foodie': ['food', 'cuisine', 'cooking', 'restaurant', 'eat', 'culinary', 'taste', 'market'],
      'luxury': ['luxury', 'upscale', 'premium', 'fancy', 'expensive', 'high-end', 'lavish', 'nightlife']
    };
    
    const activityKeywords = {
      'water': ['water', 'swim', 'surf', 'dive', 'snorkel', 'boat', 'ocean', 'beach', 'jet ski'],
      'adventure': ['hiking', 'climb', 'trek', 'mountain', 'bike', 'zip', 'bungee', 'atv', 'cliff'],
      'chill': ['chill', 'relax', 'lounge', 'spa', 'wine', 'beach', 'peaceful'],
      'social': ['party', 'nightlife', 'club', 'bar', 'social', 'meet people', 'friends', 'concert'],
      'family': ['family', 'kids', 'children', 'safe', 'easy', 'simple', 'aquarium', 'theme park']
    };
    
    const goalKeywords = {
      'romance': ['romantic', 'romance', 'couple', 'love', 'intimate', 'together', 'sunset', 'dinner'],
      'bonding': ['family', 'bonding', 'together', 'educational', 'safe'],
      'thrill': ['thrill', 'adrenaline', 'exciting', 'rush', 'intense', 'extreme'],
      'recharge': ['wellness', 'health', 'recharge', 'rejuvenate', 'mindful', 'relax', 'spa'],
      'local': ['local', 'authentic', 'hidden', 'discover', 'explore', 'culture', 'gems', 'street food']
    };
    
    const findMatches = (keywords: Record<string, string[]>) => {
      const matches: string[] = [];
      Object.entries(keywords).forEach(([category, words]) => {
        if (words.some(word => lowerInput.includes(word))) {
          matches.push(category);
        }
      });
      return matches;
    };
    
    return {
      vibe: findMatches(vibeKeywords),
      activities: findMatches(activityKeywords),
      goals: findMatches(goalKeywords)
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      message: inputMessage
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsAITyping(true);
    
    // Parse user input and extract preferences
    const parsed = parseUserInput(inputMessage);
    
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAITyping(false);
      
      let responseMessage = "Perfect! Based on what you described, I've automatically selected these preferences for you:\n\n";
      
      if (parsed.vibe.length > 0) {
        responseMessage += `✨ Vibe: ${parsed.vibe.map(v => vibes.find(vibe => vibe.id === v)?.label || v).join(', ')}\n`;
        setPreferences(prev => ({
          ...prev,
          vibe: [...new Set([...prev.vibe, ...parsed.vibe])]
        }));
      }
      
      if (parsed.activities.length > 0) {
        responseMessage += `🎯 Activities: ${parsed.activities.map(a => activities.find(act => act.id === a)?.label || a).join(', ')}\n`;
        setPreferences(prev => ({
          ...prev,
          activities: [...new Set([...prev.activities, ...parsed.activities])]
        }));
      }
      
      if (parsed.goals.length > 0) {
        responseMessage += `🎪 Goals: ${parsed.goals.map(g => goals.find(goal => goal.id === g)?.label || g).join(', ')}\n`;
        setPreferences(prev => ({
          ...prev,
          goals: [...new Set([...prev.goals, ...parsed.goals])]
        }));
      }
      
      if (parsed.vibe.length === 0 && parsed.activities.length === 0 && parsed.goals.length === 0) {
        responseMessage = "I'd love to help you more! Could you be more specific? Try mentioning things like:\n\n• Relaxing, adventure, luxury\n• Water sports, hiking, spa\n• Romantic, family bonding, thrill-seeking\n\nThe more details, the better I can customize your trip!";
      } else {
        responseMessage += "\nYou can always add more by selecting cards below, or tell me if you want to change anything!";
      }
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai' as const,
        message: responseMessage
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleSubmit = () => {
    if (preferences.vibe.length > 0 || preferences.activities.length > 0 || preferences.goals.length > 0) {
      onNext(preferences);
    }
  };

  const totalSelected = preferences.vibe.length + preferences.activities.length + preferences.goals.length;
  const isFormValid = totalSelected >= 3;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop"
          alt="Mountain landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70" />
      </div>

      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <button 
              onClick={onBack}
              className="absolute left-4 top-8 text-white hover:text-cyan-400 transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-4xl font-bold text-white mb-3">Tell us your preferences</h1>
            <p className="text-xl text-gray-300">Select what interests you most ({totalSelected} selected)</p>
          </div>

          {/* AI Chat Section */}
          <div className="bg-white/10 backdrop-blur-sm border border-gray-600 rounded-xl overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-purple-400">AI Trip Designer</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <button
                  onClick={() => setShowChat(!showChat)}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                >
                  {showChat ? 'Hide Chat' : 'Try AI Chat Instead'}
                </button>
              </div>
            </div>
            
            {!showChat ? (
              <div className="p-6 text-center">
                <div className="mb-4">
                  <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-white mb-2">Skip the clicking!</h3>
                  <p className="text-gray-300 mb-4">
                    Just describe your dream trip and I'll select all the perfect preferences for you automatically.
                  </p>
                </div>
                <button
                  onClick={initializeChat}
                  className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform font-medium"
                >
                  🤖 Start AI Chat
                </button>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="h-64 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.type === 'user' 
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black' 
                          : 'bg-white/10 backdrop-blur-sm text-white'
                      }`}>
                        <p className="text-sm whitespace-pre-line">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isAITyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </div>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-gray-600">
                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Describe your dream trip... (e.g., 'romantic getaway with amazing food')"
                      className="flex-1 bg-white/10 backdrop-blur-sm border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isAITyping}
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isAITyping || !inputMessage.trim()}
                      className="bg-gradient-to-r from-purple-400 to-pink-500 text-white p-2 rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    💡 Try: "I want adventure with water sports" or "Looking for a relaxing spa trip with great food"
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="space-y-10">
            
            {/* Vibe Selection */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-3xl mr-3">✨</span>
                Vibe & Energy Level
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vibes.map((vibe) => {
                  const isSelected = preferences.vibe.includes(vibe.id);
                  return (
                    <button
                      key={vibe.id}
                      onClick={() => togglePreference('vibe', vibe.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
                        isSelected 
                          ? 'border-cyan-400 bg-cyan-400/20 shadow-lg' 
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-4xl mb-3">{vibe.emoji}</div>
                      <h3 className="text-white font-semibold mb-2">{vibe.label}</h3>
                      <p className="text-gray-300 text-sm">{vibe.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Activities Selection */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-3xl mr-3">🎯</span>
                Activities & Experiences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activities.map((activity) => {
                  const isSelected = preferences.activities.includes(activity.id);
                  return (
                    <button
                      key={activity.id}
                      onClick={() => togglePreference('activities', activity.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
                        isSelected 
                          ? 'border-green-400 bg-green-400/20 shadow-lg' 
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-4xl mb-3">{activity.emoji}</div>
                      <h3 className="text-white font-semibold mb-2">{activity.label}</h3>
                      <p className="text-gray-300 text-sm">{activity.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Goals Selection */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-3xl mr-3">🎪</span>
                Trip Goals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {goals.map((goal) => {
                  const isSelected = preferences.goals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => togglePreference('goals', goal.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all transform hover:scale-105 ${
                        isSelected 
                          ? 'border-purple-400 bg-purple-400/20 shadow-lg' 
                          : 'border-white/30 bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      <div className="text-4xl mb-3">{goal.emoji}</div>
                      <h3 className="text-white font-semibold mb-2">{goal.label}</h3>
                      <p className="text-gray-300 text-sm">{goal.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="mt-12 text-center">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid}
              className={`px-8 py-4 rounded-xl text-lg font-bold transition-all transform inline-flex items-center ${
                isFormValid
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:scale-105 shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isFormValid ? 'Generate My Trip' : 'Select at least 3 preferences'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesScreen;