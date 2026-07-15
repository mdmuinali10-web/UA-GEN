import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';

interface AdminPageProps {
  currentUser: any;
  showToast: (message: string, type?: any) => void;
}

export default function AdminPage({ currentUser, showToast }: AdminPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    } else if (currentUser.role !== 'admin' && currentUser.role !== 'sub-admin') {
      navigate('/tools', { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'sub-admin')) {
    return null;
  }

  return (
    <AdminDashboard 
      currentUser={currentUser}
      onBackToApp={() => navigate('/tools')} 
      showToast={showToast} 
    />
  );
}
