import { NavLink } from 'react-router-dom';
import Icon from './Icon';

const Sidebar = ({
  title,
  navigationItems,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navLinkClassName = ({ isActive }) => {
    return `flex items-center px-2 py-2 rounded-md text-sm font-medium w-full ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    } transition duration-150 ease-in-out`;
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md p-6 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 lg:w-64 lg:flex-shrink-0 transition-transform duration-300 ease-in-out overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-8 lg:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <Icon name="close" className="h-6 w-6" />
        </button>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-8 hidden lg:block">
        {title}
      </h2>

      <nav className="space-y-2">
        {navigationItems.map((item, index) =>
          item.path ? (
            <NavLink
              key={index}
              to={item.path}
              className={navLinkClassName}
              onClick={() => setIsSidebarOpen(false)}
              end
            >
              {item.iconName && (
                <Icon name={item.iconName} className="h-5 w-5 mr-3" />
              )}
              {item.label}
            </NavLink>
          ) : (
            <button
              key={index}
              onClick={() => {
                if (item.action) item.action();
                setIsSidebarOpen(false);
              }}
              className="flex items-center px-2 py-2 rounded-md text-sm font-medium w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition duration-150 ease-in-out"
            >
              {item.iconName && (
                <Icon name={item.iconName} className="h-5 w-5 mr-3" />
              )}
              {item.label}
            </button>
          )
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
