import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, IndianRupee, AlertCircle, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

export default function DashboardStats() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const stats = [
    {
      label: t('totalSchemes'),
      value: '15',
      subStats: [
        { label: t('newSchemes'), value: '8' },
        { label: t('oldSchemes'), value: '7' }
      ],
      icon: Building2,
      color: 'bg-blue-500',
      onClick: () => navigate('/schemes-3')
    },
    {
      label: t('totalPlots'),
      value: '1,234',
      subStats: [
        { label: t('rentalPlots'), value: '456' },
        { label: t('freeholdPlots'), value: '778' }
      ],
      icon: Building2,
      color: 'bg-green-500',
      onClick: () => navigate('/schemes-3')
    },
    {
      label: 'Pending Payments',
      value: '₹24.5L',
      subStats: [
        { label: t('thisMonth'), value: '₹8.2L' },
        { label: t('latePayments'), value: '₹16.3L' }
      ],
      icon: IndianRupee,
      color: 'bg-yellow-500',
      onClick: () => navigate('/payment-details'),
      style: { cursor: 'pointer' }
    },
    {
      label: t('occupancyRate'),
      value: '85%',
      subStats: [
        { label: t('occupied'), value: '1,048' },
        { label: t('available'), value: '186' }
      ],
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      label: t('revenueGrowth'),
      value: '+12.5%',
      subStats: [
        { label: t('thisYear'), value: '₹2.8Cr' },
        { label: t('lastYear'), value: '₹2.5Cr' }
      ],
      icon: TrendingUp,
      color: 'bg-indigo-500'
    },
    {
      label: t('collectionEfficiency'),
      value: '92%',
      subStats: [
        { label: t('onTime'), value: '85%' },
        { label: t('delayed'), value: '15%' }
      ],
      icon: Clock,
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          onClick={stat.onClick}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">{stat.label}</h3>
            <div className="space-y-2">
              {stat.subStats.map((subStat, subIndex) => (
                <div key={subIndex} className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{subStat.label}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">{subStat.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700">
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              {t('viewDetails')} →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}