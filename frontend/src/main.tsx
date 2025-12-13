
import './logger.ts';
import { StrictMode, useEffect, useState, useRef, createContext, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from '@clerk/clerk-react';

import Fallback from "./Fallback.tsx";
import "./index.css";
import ScreenshotComponent from "./components/ScreenshotComponent.tsx";
import Router from "./components/Router.tsx";
import { client } from './lib/sdk/client.gen';
client.setConfig({ 
  baseUrl: "https://" + window.location.hostname.replace("5173", "8000"),
});

// Import Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

export const AuthTokenContext = createContext<string | null>(null);
const Root = () => {
  Element.prototype.scrollIntoView = function() { return false; };
  Element.prototype.scrollTo = function() { return false; };
  Element.prototype.scrollBy = function() { return false; };

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={
              <Router />
          } />
        </Routes>
      </BrowserRouter>
      <ScreenshotComponent />
    </ClerkProvider>
  )
}

createRoot(document.getElementById("root")).render(<Root />);
