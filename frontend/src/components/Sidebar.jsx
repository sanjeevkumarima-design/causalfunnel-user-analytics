import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/sessions', icon: Users, label: 'Sessions' },
    { path: '/heatmap', icon: MapPin, label: 'Heatmap' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-0
          w-64`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
            <BarChart3 size={28} />
            <span>CausalFunnel</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">User Analytics</p>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-50 text-primary-600 font-semibold' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <div className="text-sm text-gray-500">
            <p className="font-semibold mb-1">Quick Stats</p>
            <p className="text-xs">Real-time analytics dashboard</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
