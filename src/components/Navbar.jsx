import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

export default function Navbar() {
  const { isAuthed, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  const hideOnAuthScreens = loc.pathname === '/login' || loc.pathname === '/register';
  if (hideOnAuthScreens) return null;

  return (
    <div className="navbar bg-base-200 rounded-2xl shadow-lg mx-auto mt-4 max-w-6xl">
      <div className="flex-1">
        <Link to="/customer" className="btn btn-ghost normal-case text-xl">Shipment Portal</Link>
      </div>
      {isAuthed && (
        <div className="flex-none gap-2">
          <ul className="menu menu-horizontal px-1">
            <li><Link to="/customer">Customer</Link></li>
            <li><Link to="/address">Address</Link></li>
            <li><Link to="/shipment">Shipment</Link></li>
            <li><Link to="/offers">Offers</Link></li>
            <li><Link to="/track">Track</Link></li>
          </ul>
          <button onClick={handleLogout} className="btn btn-error text-white">Logout</button>
        </div>
      )}
    </div>
  );
}