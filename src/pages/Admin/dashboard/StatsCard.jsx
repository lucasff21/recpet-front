import React from 'react';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, icon, color, link }) => {
  const colorClasses = {
    blue: {
      iconBg: 'bg-rose-500',
      text: 'text-rose-700',
    },
    green: {
      iconBg: 'bg-teal-500',
      text: 'text-teal-700',
    },
    yellow: {
      iconBg: 'bg-orange-500',
      text: 'text-orange-700',
    },
    purple: {
      iconBg: 'bg-pink-500',
      text: 'text-pink-700',
    },
    indigo: {
      iconBg: 'bg-cyan-500',
      text: 'text-cyan-700',
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <Link
      to={link}
      className="bg-white rounded-xl  p-6 sm:p-6 h-full flex flex-col"
    >
      <div className="flex flex-row items-center justify-between gap-4 sm:gap-4 flex-1">
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-sm sm:text-sm text-gray-500 mb-2">{title}</p>
          <p className={`text-3xl sm:text-4xl font-bold ${colors.text}`}>
            {value}
          </p>
        </div>
        <div className={`${colors.iconBg} text-white p-5 sm:p-4 rounded-lg flex items-center justify-center flex-shrink-0 aspect-square w-16 h-16 sm:w-12 sm:h-12`}>
          <div className="text-3xl sm:text-2xl flex items-center justify-center">
            {icon}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StatsCard;
