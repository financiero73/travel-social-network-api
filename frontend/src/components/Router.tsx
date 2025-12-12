import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OnboardingScreen from './OnboardingScreen';
import MainApp from './MainApp';

const Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/app" element={<MainApp />} />
    </Routes>
  );
};

export default Router;