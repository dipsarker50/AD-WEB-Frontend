'use client';

import { useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { pusherClient } from '@/lib/pusher';

export default function Notification({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  useEffect(() => {
    const verificationChannel = pusherClient.subscribe('agent-verification');
    const loginChannel = pusherClient.subscribe('agent-login');
    
    
    verificationChannel.bind('verification-status-checked', (data: {
      message: string;
      timestamp: string;
    }) => {
      
      toast.success(data.message, {
        duration: 5000,
        style: {
          background: '#10b981',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
    });
    
    loginChannel.bind('agent-login-channel', (data: {
      message: string;
      timestamp: string;
    }) => {
      
      toast.success(data.message, {
        duration: 4000,
        icon: '👋',
        style: {
          background: '#3b82f6',
          color: '#fff',
          fontSize: '14px',
          fontWeight: '500',
        },
      });
    });
    
    return () => {
      verificationChannel.unbind_all();
      verificationChannel.unsubscribe();
      loginChannel.unbind_all();
      loginChannel.unsubscribe();
    };
  }, []);

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      {children}
    </>
  );
}
