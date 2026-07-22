import React from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SecurityBadgeProps {
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  count?: number;
  animated?: boolean;
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({ 
  severity, 
  count, 
  animated = false 
}) => {
  const getBadgeConfig = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return {
          icon: XCircle,
          bgColor: 'bg-red-500',
          textColor: 'text-white',
          glowColor: 'shadow-red-500/50',
          pulseColor: 'bg-red-400'
        };
      case 'High':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-orange-500',
          textColor: 'text-white',
          glowColor: 'shadow-orange-500/50',
          pulseColor: 'bg-orange-400'
        };
      case 'Medium':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-500',
          textColor: 'text-white',
          glowColor: 'shadow-yellow-500/50',
          pulseColor: 'bg-yellow-400'
        };
      case 'Low':
        return {
          icon: Shield,
          bgColor: 'bg-blue-500',
          textColor: 'text-white',
          glowColor: 'shadow-blue-500/50',
          pulseColor: 'bg-blue-400'
        };
      default:
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-500',
          textColor: 'text-white',
          glowColor: 'shadow-green-500/50',
          pulseColor: 'bg-green-400'
        };
    }
  };

  const config = getBadgeConfig(severity);
  const Icon = config.icon;

  return (
    <div className={`
      inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
      ${config.bgColor} ${config.textColor}
      ${animated ? `animate-pulse shadow-lg ${config.glowColor}` : ''}
      transform hover:scale-105 transition-all duration-200
    `}>
      <Icon size={16} />
      <span>{severity}</span>
      {count !== undefined && (
        <span className={`
          ml-1 px-2 py-0.5 rounded-full text-xs font-bold
          ${config.pulseColor} bg-opacity-30
        `}>
          {count}
        </span>
      )}
      
      {animated && (
        <div className={`
          absolute inset-0 rounded-full ${config.pulseColor} opacity-75 animate-ping
        `} />
      )}
    </div>
  );
};