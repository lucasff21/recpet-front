import { Link } from 'react-router-dom';

const MenuItem = ({ icon, text, expanded, to, active = false }) => (
  <Link
    to={to}
    className={`flex items-baseline p-3 rounded-lg transition-colors text-white no-underline
        hover:bg-sky-700
        ${active ? 'bg-gray-500' : 'hover:bg-grey-50'}
        ${expanded ? 'justify-start' : 'justify-center'}`}
  >
    {icon && { icon }}
    {expanded && <span className="ml-3">{text}</span>}
  </Link>
);

export default MenuItem;
