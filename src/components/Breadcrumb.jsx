import { IoIosArrowForward } from 'react-icons/io';
import React from 'react';

const Breadcrumb = ({ items, onNavigate }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      className="text-sm font-semibold text-gray-600 mb-6"
      aria-label="Breadcrumb"
    >
      <ol className="list-none p-0 inline-flex items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {isLast ? (
                <span className="text-gray-400">{item.label}</span>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {item.label}
                </a>
              ) : (
                <button
                  onClick={() => onNavigate && onNavigate(item.viewName)}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  {item.label}
                </button>
              )}

              {!isLast && (
                <IoIosArrowForward className="text-gray-400 mx-2 text-base" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
