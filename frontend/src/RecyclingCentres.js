import React, { useState, useEffect } from 'react'; // Added useEffect!
import { Menu, Search, Home as HomeIcon, LayoutDashboard, Bell, User, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './App.css';

const RecyclingCentres = () => {
    const navigate = useNavigate();
    const routerLocation = useLocation(); 
    const draftData = routerLocation.state || {}; 

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    // --- NEW: State to hold our database data ---
    const [centresDatabase, setCentresDatabase] = useState([]);

    // --- NEW: Fetch data from Flask when the page loads ---
    useEffect(() => {
        const fetchCentres = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/centres`);
                if (response.ok) {
                    const data = await response.json();
                    setCentresDatabase(data); // Save the MySQL data to state!
                }
            } catch (error) {
                console.error("Error fetching centres:", error);
            }
        };
        fetchCentres();
    }, []);

    const handleSelectCentre = (centreName) => {
        navigate('/reminders', { 
            state: { ...draftData, selectedLocation: centreName } 
        });
    };

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilter, setSelectedFilter] = useState('All');
    
    // The categories your users can click on
    const filterOptions = ['All', 'Plastic', 'Paper', 'Glass', 'General'];
    
    const filteredCentres = centresDatabase.filter(centre => {
        // 1. Does it match the text in the search bar?
        const matchesSearch = centre.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // 2. Does it match the dropdown category? (Looks inside your MySQL 'tags' string!)
        const matchesCategory = selectedFilter === 'All' || (centre.tags && centre.tags.includes(selectedFilter));
        
        // Only keep the location if it passes BOTH tests
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="mobile-container" style={{ padding: 0, backgroundColor: 'var(--bg-blue)', minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(false)} />
            {/* Header */}
            <div className="page-header" style={{ paddingBottom: '0' }}>
                <Menu size={32} style={{ position: 'absolute', left: '20px', cursor: 'pointer', strokeWidth: 2.5 }} onClick={() => setIsSidebarOpen(true)} />
                    <h1 className="page-title">Recycling Centres</h1> 
            </div>

            {/* Top Search Bar */}
            <div style={{ padding: '20px', paddingTop: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#91acc8', borderRadius: '25px', padding: '10px 20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    
                    {/* --- THE FILTER ICON & DROPDOWN --- */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Filter 
                            size={20} 
                            style={{ 
                                cursor: 'pointer', 
                                marginRight: '15px',
                                /* Turns the icon green if a filter is active! */
                                color: selectedFilter !== 'All' ? '#64d493' : '#000000' 
                            }} 
                            onClick={() => setIsFilterOpen(!isFilterOpen)} 
                        />
                        
                        {/* The Popup Menu */}
                        {isFilterOpen && (
                            <div style={{ position: 'absolute', top: '35px', left: '0', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 50, width: '140px', overflow: 'hidden' }}>
                                {filterOptions.map(option => (
                                    <div 
                                        key={option}
                                        onClick={() => { 
                                            setSelectedFilter(option); 
                                            setIsFilterOpen(false); 
                                        }}
                                        style={{ 
                                            padding: '12px 15px', cursor: 'pointer', borderBottom: '1px solid #f0f0f0',
                                            backgroundColor: selectedFilter === option ? '#e0f5e9' : 'white',
                                            color: selectedFilter === option ? '#64d493' : '#333',
                                            fontWeight: selectedFilter === option ? 'bold' : 'normal'
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* --- END OF FILTER DROPDOWN --- */}
                    
                    <input 
                        type="text"
                        className="custom-search-input" // Use the new CSS class for styling
                        placeholder="Search location..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ flexGrow: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '1rem', color: '#111', fontFamily: 'inherit' }} 
                    />
                    <Search size={20} style={{ color: '#000000', marginLeft: '10px' }} />
                </div>
            </div>

            {/* Scrollable List */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '0 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {filteredCentres.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#555', marginTop: '20px' }}>No recycling centres found starting with "{searchQuery}"</p>
                ) : (
                    filteredCentres.map(centre => (
                        <div 
                            key={centre.id} 
                            onClick={() => handleSelectCentre(centre.name)} // Click triggers the navigation!
                            style={{ backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                        >
                            <div style={{ height: '160px', width: '100%', position: 'relative' }}>
                                <img src={centre.image} alt={centre.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                {centre.badge && (
                                    <div style={{ position: 'absolute', top: '15px', left: '15px', backgroundColor: '#64d493', color: '#111', padding: '5px 12px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                        {centre.badge}
                                    </div>
                                )}
                            </div>
                            <div style={{ padding: '15px' }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>{centre.name}</h3>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{centre.type}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Nav */}
            <div className="bottom-nav">
                <div className="nav-item" onClick={() => navigate('/home')}>
                    <HomeIcon size={26} strokeWidth={2.5} /><span>Home</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/dashboard')}>
                    <LayoutDashboard size={26} strokeWidth={2.5} /><span>Dashboard</span>
                </div>
                <div className="nav-item" style={{ position: 'relative' }} onClick={() => navigate('/notifications')}>
                    <Bell size={26} strokeWidth={2.5} /><div className="badge">0</div><span>Notification</span>
                </div>
                <div className="nav-item" onClick={() => navigate('/profile')}>
                    <User size={26} strokeWidth={2.5} /><span>Profile</span>
                </div>
            </div>
        </div>
    );
};

export default RecyclingCentres;