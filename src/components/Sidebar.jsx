import { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({
  menuItems = [],
  title = 'Dashboard',
  children,
  expanded: initialExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  const toggleSidebar = () => setExpanded(!expanded);

  return (
    <aside
      className={`bg-slate-700 text-white ${expanded ? 'w-96' : 'w-16'} 
      transition-all duration-300 ease-in-out flex flex-col fixed h-full z-10 
      rounded-tr-2xl rounded-br-2xl shadow-lg`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-400">
        {expanded ? (
          <h1 className="font-bold text-lg m-0">{title}</h1>
        ) : (
          <div className="w-6"></div>
        )}

        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none hover:bg-blue-700 p-1 rounded"
          aria-label={expanded ? 'Recolher menu' : 'Expandir menu'}
        >
          {expanded ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                d="M18 6L6 18M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                d="M3 12h18M3 6h18M3 18h18"
              />
            </svg>
          )}
        </button>
      </div>

      <nav className="mt-4 flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.to}
            className="flex items-center px-4 py-3 hover:bg-slate-600 transition-colors no-underline text-white"
            onClick={() => setExpanded(false)}
          >
            {item.icon && <div className="mr-3">{item.icon}</div>}
            {expanded && <span>{item.text}</span>}
          </Link>
        ))}
      </nav>

      {expanded && children && (
        <div className="p-4 border-t border-gray-400">{children}</div>
      )}
    </aside>
  );
};

export default Sidebar;
