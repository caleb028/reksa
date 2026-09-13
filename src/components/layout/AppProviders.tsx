'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { UserRole } from '@/auth/roles';
import { ToastProvider, useToast, ToastType } from '@/components/ui/ToastProvider';
import { ComparisonTray } from '@/components/marketplace/ComparisonTray';

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  isVerified: boolean;
  avatar?: string | null;
}

export interface PropertyMiniDetails {
  title: string;
  price: number;
  imageUrl?: string;
  town?: string;
}

interface AppContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  // Client demo simulation perspective
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  // Server authoritative user
  serverUser: SafeUser | null;
  authoritativeRole: UserRole | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  // Comparison & Saved
  comparisonList: string[];
  comparisonDetails: Record<string, PropertyMiniDetails>;
  toggleCompare: (id: string, details?: PropertyMiniDetails) => void;
  clearComparison: () => void;
  savedPropertyIds: string[];
  toggleSaveProperty: (id: string, propertyTitle?: string) => void;
  isSaved: (id: string) => boolean;
  notify: (title: string, message?: string, type?: ToastType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function AppContent({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [activeRole, setActiveRole] = useState<UserRole>('BUYER');
  const [serverUser, setServerUser] = useState<SafeUser | null>(null);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [comparisonDetails, setComparisonDetails] = useState<Record<string, PropertyMiniDetails>>({});
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([]);

  const { showToast } = useToast();

  const notify = useCallback(
    (title: string, message?: string, type: ToastType = 'success') => {
      showToast({ title, message, type });
    },
    [showToast]
  );

  const fetchAuthUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setServerUser(data.user);
        } else {
          setServerUser(null);
        }
      }
    } catch {
      setServerUser(null);
    }
  };

  useEffect(() => {
    // Load persisted settings
    const savedTheme = localStorage.getItem('mali_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }

    const savedRole = localStorage.getItem('mali_active_role') as UserRole | null;
    if (savedRole) setActiveRole(savedRole);

    const savedCompare = localStorage.getItem('mali_comparison');
    if (savedCompare) {
      try { setComparisonList(JSON.parse(savedCompare)); } catch (e) {}
    }

    const savedCompareDetails = localStorage.getItem('mali_comparison_details');
    if (savedCompareDetails) {
      try { setComparisonDetails(JSON.parse(savedCompareDetails)); } catch (e) {}
    }

    const savedProps = localStorage.getItem('mali_saved_properties');
    if (savedProps) {
      try { setSavedPropertyIds(JSON.parse(savedProps)); } catch (e) {}
    }

    fetchAuthUser();
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('mali_theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    notify(
      next === 'dark' ? 'Dark Mode Activated' : 'Light Mode Activated',
      'Display preferences saved',
      'info'
    );
  };

  const handleSetRole = (role: UserRole) => {
    setActiveRole(role);
    localStorage.setItem('mali_active_role', role);
    notify('Role Switched', `Switched to ${role} perspective`, 'info');
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setServerUser(null);
    notify('Signed Out', 'You have been safely signed out.', 'info');
  };

  const toggleCompare = (id: string, details?: PropertyMiniDetails) => {
    setComparisonList((prev) => {
      let updated: string[];
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
        notify('Removed from comparison', undefined, 'info');
      } else {
        if (prev.length >= 5) {
          notify('Comparison limit reached', 'You can compare up to 5 properties at once.', 'error');
          return prev;
        }
        updated = [...prev, id];
        notify(
          'Added to comparison',
          `Selected ${updated.length} of 5 properties. View the comparison dock below.`,
          'success'
        );
      }
      localStorage.setItem('mali_comparison', JSON.stringify(updated));

      if (details) {
        setComparisonDetails((prevDetails) => {
          const newDetails = { ...prevDetails, [id]: details };
          localStorage.setItem('mali_comparison_details', JSON.stringify(newDetails));
          return newDetails;
        });
      }

      return updated;
    });
  };

  const clearComparison = () => {
    setComparisonList([]);
    setComparisonDetails({});
    localStorage.removeItem('mali_comparison');
    localStorage.removeItem('mali_comparison_details');
    notify('Comparison cleared', 'All properties removed from comparison matrix.', 'info');
  };

  const toggleSaveProperty = (id: string, propertyTitle?: string) => {
    setSavedPropertyIds((prev) => {
      const isAlreadySaved = prev.includes(id);
      const updated = isAlreadySaved ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('mali_saved_properties', JSON.stringify(updated));

      if (isAlreadySaved) {
        notify('Removed from watchlist', propertyTitle || 'Property removed', 'info');
      } else {
        notify('Property saved', propertyTitle ? `Saved ${propertyTitle} to your watchlist` : 'Saved to your watchlist', 'success');
      }

      return updated;
    });
  };

  const isSaved = (id: string) => savedPropertyIds.includes(id);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        activeRole,
        setActiveRole: handleSetRole,
        serverUser,
        authoritativeRole: serverUser?.role || null,
        refreshUser: fetchAuthUser,
        logout,
        comparisonList,
        comparisonDetails,
        toggleCompare,
        clearComparison,
        savedPropertyIds,
        toggleSaveProperty,
        isSaved,
        notify
      }}
    >
      {children}
      <ComparisonTray />
    </AppContext.Provider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AppContent>{children}</AppContent>
    </ToastProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProviders');
  }
  return context;
}