"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("electrominds-theme");
    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      setIsDarkMode(true);
      document.documentElement.removeAttribute("data-theme");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (isDarkMode) {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
    localStorage.setItem("electrominds-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode, mounted]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return { isDarkMode: true, toggleTheme: () => {}, mounted: false };
  }
  return context;
}
