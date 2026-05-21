import React, { useContext, useState, useEffect } from 'react'
import logo from "../assets/onecart_logo.png"
import { IoSearchOutline } from "react-icons/io5";
import { FaRegUser, FaRegHeart } from "react-icons/fa";
import { MdOutlineShoppingCart, MdContacts } from "react-icons/md";
import { IoMdHome } from "react-icons/io";
import { HiOutlineCollection, HiMenuAlt3, HiX } from "react-icons/hi";
import { userDatacontext } from '../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { authDataContext } from '../context/AuthContext';
import { shopDataContext } from '../context/ShopContext';
import axios from 'axios';


function Nav() {
    const navigate = useNavigate()
    const location = useLocation()
    const { getCurrentUser, userData } = useContext(userDatacontext)
    const { serverUrl } = useContext(authDataContext)
    const { search, setSearch, getCartCount } = useContext(shopDataContext)
    const [showProfile, setshowProfile] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showProfile && !e.target.closest('.profile-menu') && !e.target.closest('.profile-btn')) {
                setshowProfile(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [showProfile])

    const handleLogout = async () => {
        try {
            const result = await axios.get(serverUrl + "/api/auth/logout", { 
                withCredentials: true 
            });
            if (result.data.success) {
                getCurrentUser();
                setshowProfile(false);
                navigate("/login");
            }
        } catch (error) {
            console.log("Logout error:", error);
            alert("Logout failed. Please try again.");
        }
    }

    const isActive = (path) => location.pathname === path

    return (
        <>
            {/* Main Navbar */}
            <nav className={`w-full h-[80px] fixed top-0 left-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-white shadow-md' : 'bg-white border-b border-gray-100'
            }`}>
                <div className='max-w-[1600px] mx-auto h-full flex items-center justify-between px-4 lg:px-12'>
                    
                    {/* Left: Hamburger & Logo */}
                    <div className='flex items-center gap-4 lg:gap-8'>
                        <button 
                            className='md:hidden text-gray-800 focus:outline-none hover:text-[#ff3f6c] transition-colors'
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <HiMenuAlt3 className='w-7 h-7' />
                        </button>

                        <div 
                            className='flex items-center gap-2.5 cursor-pointer group'
                            onClick={() => navigate("/")}
                        >
                            <img src={logo} alt="OneCart" className='w-9 h-9 rounded-xl object-cover shadow-sm' />
                            <h1 className='text-2xl font-bold tracking-tight text-gray-900'>One<span className='text-[#ff3f6c]'>Cart</span></h1>
                        </div>

                        {/* Desktop Nav Links */}
                        <ul className='hidden md:flex items-center gap-6 mt-1 font-semibold text-sm tracking-wide text-gray-800 uppercase'>
                            <NavLink onClick={() => navigate("/")} isActive={isActive("/")}>HOME</NavLink>
                            <NavLink onClick={() => navigate("/collection")} isActive={isActive("/collection")}>SHOP</NavLink>
                            <NavLink onClick={() => navigate("/about")} isActive={isActive("/about")}>ABOUT US</NavLink>
                            <NavLink onClick={() => navigate("/contact")} isActive={isActive("/contact")}>CONTACT US</NavLink>
                        </ul>
                    </div>

                    {/* Search Bar (Center/Right - Hidden on Small Mobile) */}
                    <div className='hidden sm:flex flex-1 max-w-md mx-8'>
                        <div className='relative w-full group'>
                            <IoSearchOutline className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#ff3f6c]' />
                            <input
                                type="text"
                                className='w-full h-10 bg-gray-100 rounded-full pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all'
                                placeholder='Search for products, brands and more'
                                onChange={(e) => setSearch(e.target.value)}
                                value={search}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter') navigate("/collection");
                                }}
                            />
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className='flex items-center gap-5 lg:gap-6'>
                        {/* Profile */}
                        <div className='relative flex flex-col items-center justify-center cursor-pointer group profile-btn' onClick={() => setshowProfile(prev => !prev)}>
                            {userData ? (
                                <div className='w-6 h-6 bg-[#ff3f6c] text-white rounded-full flex items-center justify-center font-bold text-xs'>
                                    {userData?.name.slice(0, 1).toUpperCase()}
                                </div>
                            ) : (
                                <FaRegUser className='w-5 h-5 text-gray-800 group-hover:text-[#ff3f6c] transition-colors' />
                            )}
                            <span className='text-[11px] font-semibold mt-1 text-gray-800 group-hover:text-[#ff3f6c] hidden md:block'>Profile</span>
                        </div>

                        {/* Wishlist */}
                        <div className='hidden md:flex flex-col items-center justify-center cursor-pointer group' onClick={() => navigate("/wishlist")}>
                            <FaRegHeart className='w-5 h-5 text-gray-800 group-hover:text-[#ff3f6c] transition-colors' />
                            <span className='text-[11px] font-semibold mt-1 text-gray-800 group-hover:text-[#ff3f6c]'>Wishlist</span>
                        </div>

                        {/* Cart */}
                        <div 
                            className='relative flex flex-col items-center justify-center cursor-pointer group'
                            onClick={() => navigate("/cart")}
                        >
                            <div className='relative'>
                                <MdOutlineShoppingCart className='w-6 h-6 text-gray-800 group-hover:text-[#ff3f6c] transition-colors' />
                                {getCartCount() > 0 && (
                                    <span className='absolute -top-2 -right-2 w-[18px] h-[18px] bg-[#ff3f6c] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm'>
                                        {getCartCount()}
                                    </span>
                                )}
                            </div>
                            <span className='text-[11px] font-semibold mt-1 text-gray-800 group-hover:text-[#ff3f6c] hidden md:block'>Cart</span>
                        </div>
                    </div>
                </div>

                {/* Profile Dropdown */}
                {showProfile && (
                    <div className='profile-menu absolute top-[80px] right-4 lg:right-12 w-64 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden py-2 text-sm z-50 animate-in fade-in slide-in-from-top-2'>
                        {userData && (
                            <div className='px-5 py-3 border-b border-gray-100 bg-gray-50'>
                                <p className='text-gray-900 font-bold truncate'>Hello {userData.name}</p>
                                <p className='text-gray-500 text-xs truncate mt-0.5'>{userData.email}</p>
                            </div>
                        )}
                        <ul className='py-1'>
                            {!userData ? (
                                <li className='px-5 py-3 hover:bg-gray-50 cursor-pointer font-semibold text-[#ff3f6c]' onClick={() => { navigate("/login"); setshowProfile(false); }}>
                                    Login / Signup
                                </li>
                            ) : (
                                <>
                                    <li className='px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:font-semibold cursor-pointer' onClick={() => { navigate("/order"); setshowProfile(false); }}>
                                        Orders
                                    </li>
                                    <li className='px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:font-semibold cursor-pointer' onClick={() => { navigate("/wishlist"); setshowProfile(false); }}>
                                        Wishlist
                                    </li>
                                    <li className='px-5 py-2.5 text-gray-700 hover:bg-gray-50 hover:font-semibold cursor-pointer' onClick={() => { navigate("/about"); setshowProfile(false); }}>
                                        About Us
                                    </li>
                                    <li className='px-5 py-2.5 text-red-500 hover:bg-gray-50 hover:font-semibold cursor-pointer border-t border-gray-100 mt-1 pt-3' onClick={handleLogout}>
                                        Logout
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                )}

                {/* ── Mobile Sidebar Menu ────────────────────────────────────────── */}
                <div className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}>
                    <div className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white shadow-2xl transition-transform duration-300 ease-out transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
                        <div className='flex items-center justify-between p-6 border-b border-gray-100'>
                            <div className='flex items-center gap-2.5'>
                                <img src={logo} alt="OneCart" className='w-9 h-9 rounded-xl object-cover shadow-sm' />
                                <h1 className='text-xl font-bold tracking-tight text-gray-900'>One<span className='text-[#ff3f6c]'>Cart</span></h1>
                            </div>
                            <button onClick={() => setIsMenuOpen(false)} className='text-gray-500 hover:text-gray-900'>
                                <HiX className='w-6 h-6' />
                            </button>
                        </div>
                        
                        <div className='py-6 px-4'>
                            <ul className='space-y-4'>
                                <li 
                                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-colors ${isActive('/') ? 'bg-[#ff3f6c]/10 text-[#ff3f6c]' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => { navigate("/"); setIsMenuOpen(false); }}
                                >
                                    HOME
                                </li>
                                <li 
                                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-colors ${isActive('/collection') ? 'bg-[#ff3f6c]/10 text-[#ff3f6c]' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => { navigate("/collection"); setIsMenuOpen(false); }}
                                >
                                    SHOP
                                </li>
                                <li 
                                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-colors ${isActive('/about') ? 'bg-[#ff3f6c]/10 text-[#ff3f6c]' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => { navigate("/about"); setIsMenuOpen(false); }}
                                >
                                    ABOUT US
                                </li>
                                <li 
                                    className={`px-4 py-3 rounded-lg font-bold text-sm transition-colors ${isActive('/contact') ? 'bg-[#ff3f6c]/10 text-[#ff3f6c]' : 'text-gray-700 hover:bg-gray-50'}`}
                                    onClick={() => { navigate("/contact"); setIsMenuOpen(false); }}
                                >
                                    CONTACT US
                                </li>
                            </ul>
                        </div>

                        {/* Mobile Sidebar Footer */}
                        <div className='absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50'>
                            <p className='text-xs text-gray-400 mb-4'>© 2026 OneCart E-commerce</p>
                            {userData ? (
                                <button onClick={handleLogout} className='w-full py-3 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold'>Logout</button>
                            ) : (
                                <button onClick={() => { navigate("/login"); setIsMenuOpen(false); }} className='w-full py-3 bg-[#ff3f6c] text-white rounded-lg text-sm font-bold'>Login / Signup</button>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <div className="h-[80px]"></div> {/* Spacer */}

            {/* Mobile Bottom Nav */}
            <div className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]'>
                <div className='h-full flex items-center justify-around px-2'>
                    <MobileNavBtn icon={<IoMdHome className='w-6 h-6' />} label="Home" onClick={() => navigate("/")} isActive={isActive("/")} />
                    <MobileNavBtn icon={<HiOutlineCollection className='w-6 h-6' />} label="Shop" onClick={() => navigate("/collection")} isActive={isActive("/collection")} />
                    <MobileNavBtn icon={<IoSearchOutline className='w-6 h-6' />} label="Search" onClick={() => { navigate("/collection"); setTimeout(() => document.querySelector('input[type="text"]')?.focus(), 100); }} isActive={false} />
                    <MobileNavBtn icon={<FaRegHeart className='w-[22px] h-[22px]' />} label="Wishlist" onClick={() => navigate("/wishlist")} isActive={isActive("/wishlist")} />
                    <MobileNavBtn icon={<MdOutlineShoppingCart className='w-6 h-6' />} label="Cart" onClick={() => navigate("/cart")} isActive={isActive("/cart")} badge={getCartCount()} />
                </div>
            </div>
        </>
    )
}

function NavLink({ children, onClick, isActive }) {
    return (
        <li
            onClick={onClick}
            className={`cursor-pointer transition-all border-b-2 py-6 -my-6 ${
                isActive ? 'border-[#ff3f6c] text-[#ff3f6c]' : 'border-transparent hover:border-[#ff3f6c] hover:text-[#ff3f6c]'
            }`}
        >
            {children}
        </li>
    )
}

function MobileNavBtn({ icon, label, onClick, isActive, badge }) {
    return (
        <button onClick={onClick} className='relative flex flex-col items-center justify-center w-full h-full gap-1'>
            <div className={`transition-colors ${isActive ? 'text-[#ff3f6c]' : 'text-gray-500'}`}>
                {icon}
            </div>
            <span className={`text-[10px] font-semibold ${isActive ? 'text-[#ff3f6c]' : 'text-gray-500'}`}>
                {label}
            </span>
            {badge > 0 && (
                <span className='absolute top-1 right-3 w-4 h-4 bg-[#ff3f6c] text-white text-[9px] font-bold rounded-full flex items-center justify-center'>
                    {badge}
                </span>
            )}
        </button>
    )
}

export default Nav

