import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import OnboardingScreen from './OnboardingScreen';
import MainApp from './MainApp';
import SignInPage from './Auth/SignInPage';
import SignUpPage from './Auth/SignUpPage';

const Router: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <>
            <SignedIn>
              <MainApp />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/onboarding"
        element={
          <>
            <SignedIn>
              <OnboardingScreen />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/app"
        element={
          <>
            <SignedIn>
              <MainApp />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        }
      />
    </Routes>
  );
};

export default Router;
