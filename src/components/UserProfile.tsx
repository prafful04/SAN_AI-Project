import React, { useState } from 'react';
import { User, LogOut, Settings, Shield, Activity, FileText } from 'lucide-react';
import { GoogleAuthService } from '../utils/googleAuth';

interface UserProfileProps {
  user: {
    email: string;
    name: string;
    role: string;
  };
  onLogout: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      // Sign out from Google if user signed in with Google
      const googleAuth = GoogleAuthService.getInstance();
      await googleAuth.signOut();
    } catch (error) {
      console.error('Google sign-out error:', error);
    }
    
    onLogout();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <User className="text-white" size={16} />
        </div>
        <div className="text-left">
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-sm text-gray-600">{user.role}</div>
        </div>
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  <div className="text-xs text-blue-600 font-medium">{user.role}</div>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors">
                <Shield className="text-gray-500" size={16} />
                <span className="text-gray-700">Security Dashboard</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors">
                <Activity className="text-gray-500" size={16} />
                <span className="text-gray-700">Analysis History</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors">
                <FileText className="text-gray-500" size={16} />
                <span className="text-gray-700">Reports</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors">
                <Settings className="text-gray-500" size={16} />
                <span className="text-gray-700">Settings</span>
              </button>
            </div>

            <div className="p-2 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-red-50 rounded-md transition-colors text-red-600"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};