import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OfferDirectory from '../components/OfferDirectory';

interface OfferDirectoryPageProps {
  currentUser: any;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function OfferDirectoryPage({ currentUser, onShowToast }: OfferDirectoryPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="flex-grow animate-fade-in flex flex-col pb-12">
      <OfferDirectory 
        onShowToast={onShowToast} 
        onBack={() => navigate('/tools')}
        currentUser={currentUser}
      />
    </div>
  );
}
