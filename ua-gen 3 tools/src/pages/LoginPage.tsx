import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Auth from '../components/Auth';
import { ToastState } from '../types';

interface LoginPageProps {
  currentUser: any;
  onAuthSuccess: (user: any) => void;
  showToast: (message: string, type?: ToastState['type']) => void;
}

export default function LoginPage({ currentUser, onAuthSuccess, showToast }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { initialTab?: 'login' | 'register' };

  useEffect(() => {
    if (currentUser) {
      navigate('/tools', { replace: true });
    }
  }, [currentUser, navigate]);

  return (
    <div className="flex-grow flex items-center justify-center">
      <Auth 
        onAuthSuccess={onAuthSuccess} 
        showToast={showToast} 
        initialTab={state?.initialTab || 'login'}
      />
    </div>
  );
}
