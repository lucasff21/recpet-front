import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from './Icon';
import { GoSidebarCollapse, GoSidebarExpand } from 'react-icons/go';
import { MdOutlinePets } from 'react-icons/md';

const Sidebar = ({
  title,
  navigationItems,
  isSidebarOpen,
  setIsSidebarOpen,
  isCollapsed,
  toggleCollapse,
}) => {
  const navLinkClassName = ({ isActive }) => {
    return `flex items-center ${
      isCollapsed ? 'justify-center px-2' : 'px-3'
    } py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
    }`;
  };

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
            fixed lg:static inset-y-0 left-0 z-40
            bg-white border-r border-gray-200 shadow-xl lg:shadow-none
            transition-all duration-300 ease-in-out
            flex flex-col
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            ${isCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div
          className={`flex items-center h-16 border-b border-gray-100 flex-shrink-0 ${
            isCollapsed ? 'justify-center' : 'justify-between px-6'
          }`}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3 overflow-hidden animate-in fade-in duration-300">
              <div className="text-blue-600 flex-shrink-0">
                <MdOutlinePets size={26} />
              </div>
              <h2 className="text-lg font-bold text-gray-800 truncate">
                {title}
              </h2>
            </div>
          )}

          <button
            onClick={toggleCollapse}
            className={`hidden lg:flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition-colors ${isCollapsed ? '' : ''}`}
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? (
              <GoSidebarExpand size={24} />
            ) : (
              <GoSidebarCollapse size={22} />
            )}
          </button>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100"
          >
            <Icon name="close" className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1 custom-scrollbar">
          {navigationItems.map((item, index) => {
            const Content = () => (
              <>
                <span
                  className={`flex-shrink-0 transition-transform duration-200 ${isCollapsed ? 'scale-110' : ''}`}
                >
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 origin-left">
                    {item.label}
                  </span>
                )}

                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap shadow-lg">
                    {item.label}
                  </div>
                )}
              </>
            );

            if (item.path) {
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  end={item.end}
                  className={navLinkClassName}
                  onClick={() => setIsSidebarOpen(false)}
                  title={isCollapsed ? item.label : ''}
                >
                  <Content />
                </NavLink>
              );
            }

            return (
              <button
                key={index}
                onClick={() => {
                  if (item.action) item.action();
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center ${
                  isCollapsed ? 'justify-center px-2' : 'px-3'
                } py-3 rounded-lg text-sm font-medium w-full text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors group relative`}
                title={isCollapsed ? item.label : ''}
              >
                <Content />
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
