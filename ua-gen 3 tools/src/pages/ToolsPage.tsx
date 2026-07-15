import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AllToolsPage from '../components/AllToolsPage';

interface ToolsPageProps {
  currentUser: any;
}

export default function ToolsPage({ currentUser }: ToolsPageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return (
    <div className="flex-grow">
      <AllToolsPage 
        onSelectTool={(tool) => {
          if (tool === 'ua-gen') {
            navigate('/tools/ua-generator');
          } else if (tool === 'photo-resize') {
            navigate('/tools/photo-resize');
          } else if (tool === 'offer-directory') {
            navigate('/tools/offer-directory');
          }
        }}
        currentUser={currentUser}
      />
    </div>
  );
}
