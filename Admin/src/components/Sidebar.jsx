import React from 'react'
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegListAlt } from "react-icons/fa";
import { SiTicktick } from "react-icons/si";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: <IoIosAddCircleOutline className='w-5 h-5'/>,
      label: 'Add Product',
      path: '/add'
    },
    {
      icon: <FaRegListAlt className='w-5 h-5'/>,
      label:  'Product List',
      path: '/lists'
    },
    {
      icon: <SiTicktick className='w-5 h-5'/>,
      label:  'Orders',
      path: '/orders'
    }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className='fixed left-0 top-[70px] w-64 h-[calc(100vh-70px)] bg-slate-900 border-r border-slate-800 overflow-y-auto hidden lg:block'>
      <nav className='p-4 space-y-2'>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className={isActive(item.path) ? 'text-white' : 'text-slate-400'}>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Optional: Stats Section */}
      <div className='p-4 mt-8 border-t border-slate-800'>
        <h3 className='text-slate-400 text-xs font-semibold uppercase mb-3'>Quick Stats</h3>
        <div className='space-y-3'>
          <div className='bg-slate-800 rounded-lg p-3'>
            <p className='text-slate-400 text-xs'>Total Products</p>
            <p className='text-white text-2xl font-bold'>124</p>
          </div>
          <div className='bg-slate-800 rounded-lg p-3'>
            <p className='text-slate-400 text-xs'>Pending Orders</p>
            <p className='text-white text-2xl font-bold'>8</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar