import React from 'react';
import { useAuth } from './contexts/AuthContext';

function SimpleApp() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Lik App...</h1>
          <p className="text-muted-foreground">Setting up your experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Lik App</h1>
      <div className="text-center">
        <p className="text-muted-foreground mb-4">
          Welcome to the social food discovery platform!
        </p>
        {user ? (
          <p className="text-green-600">Logged in as: {user.email}</p>
        ) : (
          <p className="text-gray-600">Not logged in (Guest mode)</p>
        )}
      </div>
    </div>
  );
}

export default SimpleApp;