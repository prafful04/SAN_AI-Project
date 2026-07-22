import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';

interface SecurityMetricsProps {
  totalScans: number;
  vulnerabilitiesFixed: number;
  securityScore: number;
}

export const SecurityMetrics: React.FC<SecurityMetricsProps> = ({
  totalScans,
  vulnerabilitiesFixed,
  securityScore
}) => {
  const [animatedValues, setAnimatedValues] = useState({
    scans: 0,
    fixed: 0,
    score: 0
  });

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedValues({
        scans: Math.floor(totalScans * easeOut),
        fixed: Math.floor(vulnerabilitiesFixed * easeOut),
        score: Math.floor(securityScore * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [totalScans, vulnerabilitiesFixed, securityScore]);

  const metrics = [
    {
      icon: Activity,
      label: 'Total Scans',
      value: animatedValues.scans,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'Code analyses performed'
    },
    {
      icon: CheckCircle,
      label: 'Issues Fixed',
      value: animatedValues.fixed,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Vulnerabilities resolved'
    },
    {
      icon: Shield,
      label: 'Security Score',
      value: `${animatedValues.score}%`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      description: 'Overall security rating'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} ${metric.borderColor} border rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:shadow-lg`}
        >
          <div className="flex items-center justify-between mb-2">
            <metric.icon className={`${metric.color}`} size={24} />
            {metric.label === 'Vulnerabilities Found' && metric.value > 0 && (
              <div className="animate-pulse">
                <AlertTriangle className="text-red-500" size={16} />
              </div>
            )}
            <TrendingUp className="text-gray-400" size={16} />
          </div>
          <div className="space-y-1">
            <div className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
            </div>
            <div className="text-sm text-gray-600">{metric.label}</div>
            <div className="text-xs text-gray-500">{metric.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};