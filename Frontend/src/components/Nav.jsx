import React, { useContext, useState, useEffect } from 'react'
import logo from "../assets/vcart_logo.png"
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdContacts } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection } from "react-icons/hi";
import { userDatacontext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { authDataContext } from '../context/authContext';
import { shopDataContext } from '../context/ShopContext';
import axios from 'axios';

function Nav() {
    const navigate = useNavigate()
    const location = useLocation()
    const { getCurrentUser, userData } = useContext(userDatacontext)
    const { serverUrl } = useContext(authDataContext)
    const { showSearch, setShowSearch, search, setSearch, getCartCount } = useContext(shopDataContext)
    const [showProfile, setshowProfile] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window. addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showProfile && ! e.target.closest('.profile-menu') && !e.target.closest('. profile-btn')) {
                setshowProfile(false)
            }
        }
        document. addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [showProfile])

    const handleLogout = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            console.log(result.data)
            getCurrentUser()
            setshowProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    const isActive = (path) => location.pathname === path

    return (
        <>
            {/* Main Navbar */}
            <nav className={`w-full h-[70px] fixed top-0 left-0 z-50 transition-all ${
                scrolled ? 'bg-slate-900 shadow-lg' : 'bg-slate-900/95'
            }`}>
                <div className='max-w-[1600px] mx-auto h-full flex items-center justify-between px-6'>
                    
                    {/* Logo */}
                    <div 
                        className='flex items-center gap-3 cursor-pointer group'
                        onClick={() => navigate("/")}
                    >
                        <div className='w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg p-2 shadow-lg shadow-violet-500/30'>
                            <img src={logo} alt="OneCart" className='w-full h-full object-contain' />
                        </div>
                        <h1 className='text-xl font-bold text-white'>OneCart</h1>
                    </div>

                    {/* Desktop Nav */}
                    <ul className='hidden md:flex items-center gap-2'>
                        <NavLink 
                            onClick={() => navigate("/")} 
                            isActive={isActive("/")}
                        >
                            HOME
                        </NavLink>
                        <NavLink 
                            onClick={() => navigate("/collection")} 
                            isActive={isActive("/collection")}
                        >
                            COLLECTIONS
                        </NavLink>
                        <NavLink 
                            onClick={() => navigate("/about")} 
                            isActive={isActive("/about")}
                        >
                            ABOUT
                        </NavLink>
                        <NavLink 
                            onClick={() => navigate("/contact")} 
                            isActive={isActive("/contact")}
                        >
                            CONTACT
                        </NavLink>
                    </ul>

                    {/* Right Icons */}
                    <div className='flex items-center gap-4'>
                        
                        {/* Search */}
                        <button
                            onClick={() => {
                                setShowSearch(prev => !prev);
                                if (! showSearch) navigate("/collection");
                            }}
                            className='w-9 h-9 flex items-center justify-center text-white hover:text-violet-400 transition-colors'
                        >
                            {showSearch ? (
                                <IoSearchCircleSharp className='w-8 h-8' />
                            ) : (
                                <IoSearchCircleOutline className='w-8 h-8' />
                            )}
                        </button>

                        {/* Profile */}
                        <button
                            onClick={() => setshowProfile(prev => !prev)}
                            className='profile-btn w-9 h-9 flex items-center justify-center'
                        >
                            {userData ? (
                                <div className='w-9 h-9 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-lg shadow-violet-500/30'>
                                    {userData?. name. slice(0, 1).toUpperCase()}
                                </div>
                            ) : (
                                <FaCircleUser className='w-7 h-7 text-white hover:text-violet-400 transition-colors' />
                            )}
                        </button>

                        {/* Cart - Desktop */}
                        <button
                            onClick={() => navigate("/cart")}
                            className='hidden md:flex relative w-9 h-9 items-center justify-center'
                        >
                            <MdOutlineShoppingCart className='w-7 h-7 text-white hover:text-violet-400 transition-colors' />
                            {getCartCount() > 0 && (
                                <span className='absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-violet-600 to-purple-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-violet-500/50'>
                                    {getCartCount()}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                {showSearch && (
                    <div className='w-full bg-slate-800 border-t border-slate-700'>
                        <div className='max-w-[1600px] mx-auto px-6 py-4'>
                            <input
                                type="text"
                                className='w-full max-w-2xl mx-auto block h-12 bg-slate-900 border border-slate-600 rounded-lg px-4 text-white placeholder-slate-400 focus:outline-none focus:border-violet-600'
                                placeholder='Search for products.. .'
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                autoFocus
                            />
                        </div>
                    </div>
                )}

                {/* Profile Dropdown */}
                {showProfile && (
                    <div className='profile-menu absolute top-[70px] right-6 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden'>
                        {userData && (
                            <div className='px-4 py-3 border-b border-slate-700 bg-gradient-to-r from-violet-600/10 to-purple-600/10'>
                                <p className='text-white font-semibold text-sm truncate'>{userData.name}</p>
                                <p className='text-slate-400 text-xs truncate'>{userData.email}</p>
                            </div>
                        )}
                        <ul className='py-2'>
                            {! userData ? (
                                <li
                                    className='px-4 py-2 text-white hover:bg-slate-700 cursor-pointer'
                                    onClick={() => {
                                        navigate("/login");
                                        setshowProfile(false);
                                    }}
                                >
                                    Login
                                </li>
                            ) : (
                                <>
                                    <li
                                        className='px-4 py-2 text-white hover:bg-slate-700 cursor-pointer'
                                        onClick={() => {
                                            navigate("/order");
                                            setshowProfile(false);
                                        }}
                                    >
                                        My Orders
                                    </li>
                                    <li
                                        className='px-4 py-2 text-white hover:bg-slate-700 cursor-pointer'
                                        onClick={() => {
                                            navigate("/about");
                                            setshowProfile(false);
                                        }}
                                    >
                                        About
                                    </li>
                                    <li
                                        className='px-4 py-2 text-red-400 hover:bg-slate-700 cursor-pointer border-t border-slate-700'
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}
            </nav>

            {/* Mobile Bottom Nav */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 z-40'>
                <div className='h-full flex items-center justify-around px-4'>
                    <MobileNavBtn
                        icon={<IoMdHome className='w-6 h-6' />}
                        label="Home"
                        onClick={() => navigate("/")}
                        isActive={isActive("/")}
                    />
                    <MobileNavBtn
                        icon={<HiOutlineCollection className='w-6 h-6' />}
                        label="Shop"
                        onClick={() => navigate("/collection")}
                        isActive={isActive("/collection")}
                    />
                    <MobileNavBtn
                        icon={<MdContacts className='w-6 h-6' />}
                        label="Contact"
                        onClick={() => navigate("/contact")}
                        isActive={isActive("/contact")}
                    />
                    <MobileNavBtn
                        icon={<MdOutlineShoppingCart className='w-6 h-6' />}
                        label="Cart"
                        onClick={() => navigate("/cart")}
                        isActive={isActive("/cart")}
                        badge={getCartCount()}
                    />
                </div>
            </div>
        </>
    )
}

// Nav Link Component
function NavLink({ children, onClick, isActive }) {
    return (
        <li
            onClick={onClick}
            className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                isActive
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
        >
            {children}
        </li>
    )
}

// Mobile Nav Button
function MobileNavBtn({ icon, label, onClick, isActive, badge }) {
    return (
        <button
            onClick={onClick}
            className='relative flex flex-col items-center gap-1'
        >
            <div className={`transition-colors ${isActive ? 'text-violet-400' : 'text-slate-400'}`}>
                {icon}
            </div>
            <span className={`text-xs ${isActive ? 'text-violet-400' : 'text-slate-400'}`}>
                {label}
            </span>
            {badge > 0 && (
                <span className='absolute -top-1 -right-2 w-5 h-5 bg-gradient-to-br from-violet-600 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-violet-500/50'>
                    {badge}
                </span>
            )}
        </button>
    )
}

export default Nav