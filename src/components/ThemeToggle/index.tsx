'use client'

import React, { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/providers/Theme'
import { themeLocalStorageKey } from '@/providers/Theme/ThemeSelector/types'

type ThemeMode = 'auto' | 'light' | 'dark'

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme()
  const [currentMode, setCurrentMode] = useState<ThemeMode>('auto')
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
    
    // Get stored preference or default to auto
    const storedPreference = window.localStorage.getItem(themeLocalStorageKey)
    if (storedPreference === 'light' || storedPreference === 'dark') {
      setCurrentMode(storedPreference)
    } else {
      setCurrentMode('auto')
    }
  }, [])

  // Get system preference
  const getSystemPreference = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  // Get effective theme (what's actually being displayed)
  const getEffectiveTheme = (): 'light' | 'dark' => {
    if (currentMode === 'auto') {
      return getSystemPreference()
    }
    return currentMode as 'light' | 'dark'
  }

  // Cycle through themes based on current visual appearance
  const cycleTheme = () => {
    const effectiveTheme = getEffectiveTheme()
    let nextMode: ThemeMode
    
    // If currently showing light, switch to dark
    // If currently showing dark, switch to light
    // This ensures always 1 click to switch between light/dark
    if (effectiveTheme === 'light') {
      nextMode = 'dark'
    } else {
      nextMode = 'light'
    }

    setCurrentMode(nextMode)
    setTheme(nextMode)
  }

  if (!mounted) {
    return (
      <div className="w-14 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse" />
    )
  }

  const effectiveTheme = getEffectiveTheme()
  const isLight = effectiveTheme === 'light'

  return (
    <button
      onClick={cycleTheme}
      className="relative w-14 h-7 bg-neutral-200 dark:bg-neutral-800 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
      aria-label={`Current theme: ${currentMode}. Click to cycle through themes.`}
      title={`Theme: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`}
    >
      {/* Background track */}
      <div className="absolute inset-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-600 dark:to-purple-600 opacity-20" />
      
      {/* Icons */}
      <Sun 
        className={`absolute left-1.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-600 transition-opacity duration-300 ${
          isLight ? 'opacity-100' : 'opacity-40'
        }`} 
      />
      <Moon 
        className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-400 transition-opacity duration-300 ${
          !isLight ? 'opacity-100' : 'opacity-40'
        }`} 
      />
      
      {/* Toggle circle */}
      <div
        className={`relative w-5 h-5 scale-110 border border-white dark:border-neutral-100 rounded-full shadow-lg transform transition-transform duration-300 ease-in-out ${
          isLight ? 'translate-x-0' : 'translate-x-7'
        } group-hover:scale-125`}
      >
        {/* Auto indicator dot */}
        {currentMode === 'auto' && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
        )}
      </div>
      
      {/* Hover effect */}
      <div className="absolute inset-0 rounded-full bg-white dark:bg-neutral-700 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
    </button>
  )
}
