import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhotoResizeTool from '../components/PhotoResizeTool';

interface PhotoResizePageProps {
  currentUser: any;
  onShowToast: (message: string, type?: any) => void;
}

export default function PhotoResizePage({ currentUser, onShowToast }: PhotoResizePageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <PhotoResizeTool 
      onBack={() => navigate('/tools')}
      onShowToast={onShowToast}
    />
  );
}
