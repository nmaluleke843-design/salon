import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import {
  CalendarDays, ChevronRight, Clock3, Heart, MapPin, Menu, Search,
  SlidersHorizontal, Sparkles, Star, UserRound, X, ArrowLeft,
  Check, LogOut, LayoutDashboard, Scissors, WalletCards
} from 'lucide-react'
import './styles.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

const salons = [
  { id: 1, name: 'Velvet & Rose', category: 'Hair salon', location: 'Sandton, Johannesburg', rating: 4.9, reviews: 184, distance: '2.4 km', price: 'From R280', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85', colors: ['#201714', '#d6b7a0'], featured: true, services: [{name:'Wash & blow dry', price:280,duration:'45 min'}, {name:'Colour refresh', price:650,duration:'90 min'}, {name:'Silk press', price:480,duration:'75 min'}] },
  { id: 2, name: 'The Braiding Room', category: 'Braids & locs', location: 'Melrose, Johannesburg', rating: 4.8, reviews: 121, distance: '3.1 km', price: 'From R350', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a9c9?auto=format&fit=crop&w=900&q=85', colors: ['#3d3228', '#b9a58c'], featured: false, services: [{name:'Knotless braids', price:850,duration:'3 hr'}, {name:'Cornrows', price:350,duration:'60 min'}, {name:'Loc maintenance', price:520,duration:'90 min'}] },
  { id: 3, name: 'Studio No. 7', category: 'Nails & beauty', location: 'Rosebank, Johannesburg', rating: 4.7, reviews: 96, distance: '4.7 km', price: 'From R220', image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=85', colors: ['#382c29', '#d4c0a9'], featured: false, services: [{name:'Gel manicure', price:220,duration:'45 min'}, {name:'Pedicure', price:350,duration:'60 min'}, {name:'Nail art', price:420,duration:'75 min'}] }
]

function Logo({light=false}) {
  return <div className={`logo ${light?'light':''}`}><div className="logo-mark">G</div><span>GlowLink</span></div>
}

function App() {
  const [page,setPage] = useState('home')
  const [selected,setSelected] = useState(null)
  const [query,setQuery] = useState('')
  const [menu,setMenu] = useState(false)
  const [authOpen,setAuthOpen] = useState(false)
  const [authMode,setAuthMode] = useState('login')
  const [role,setRole] = useState('client')
  const [user,setUser] = useState(null)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({data}) => setUser(data.session?.user ?? null))
    const { data } = supabase.auth.onAuthStateChange((_,session) => setUser(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  const filtered = salons.filter(s => `${s.name} ${s.category} ${s.location}`.toLowerCase().includes(query.toLowerCase()))
  const navigate = p => {setPage(p); setMenu(false); window.scrollTo({top:0,behavior:'smooth'})}

  async function googleLogin() {
    if (!supabase) { setAuthOpen(false); setUser({email:'demo@glowlink.app'}); return }
    await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo:window.location.origin } })
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut()
    setUser(null); navigate('home')
  }

  return <>
    <header>
      <button className="logo-button" onClick={() => navigate('home')}><Logo/></button>
      <nav className="desktop-nav">
        <button onClick={() => navigate('home')}>Discover</button>
        <button onClick={() => navigate('bookings')}>My bookings</button>
        <button onClick={() => navigate('for-salons')}>For salons</button>
      </nav>
      <div className="header-actions">
        {user ? <button className="icon-button user-chip" onClick={() => navigate('dashboard')}><UserRound size={18}/><span>{user.email?.split('@')[0]}</span></button> : <button className="text-button" onClick={() => setAuthOpen(true)}>Sign in</button>}
        <button className="primary-button small" onClick={() => navigate('for-salons')}>List your salon</button>
        <button className="icon-button mobile-menu" onClick={() => setMenu(!menu)}>{menu?<X/>:<Menu/>}</button>
      </div>
      {menu && <div className="mobile-nav"><button onClick={() => navigate('home')}>Discover</button><button onClick={() => navigate('bookings')}>My bookings</button><button onClick={() => navigate('for-salons')}>For salons</button></div>}
    </header>

    {page === 'home' && <main>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={14}/> Your beauty, your way</span>
          <h1>Find the right salon.<br/><em>Feel your best.</em></h1>
          <p>Discover trusted salons near you and book your next appointment in minutes.</p>
          <div className="search-box">
            <Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Salon, service or location"/>
            <button onClick={() => navigate('discover')}>Search</button>
          </div>
          <div className="trust-row"><div className="avatars"><b>J</b><b>M</b><b>T</b></div><span><strong>4.9</strong> from 2,000+ happy clients</span></div>
        </div>
        <div className="hero-collage">
          <div className="shape shape-one"><img src="https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=700&q=85"/></div>
          <div className="shape shape-two"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85"/></div>
          <div className="shape shape-three"><img src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85"/></div>
        </div>
      </section>

      <section className="discover-section" id="discover">
        <div className="section-heading"><div><span className="eyebrow">Popular nearby</span><h2>Salons clients love</h2></div><button className="link-button" onClick={()=>navigate('discover')}>View all <ChevronRight size={16}/></button></div>
        <SalonGrid salons={filtered.slice(0,3)} onSelect={setSelected}/>
      </section>

      <section className="cta-band"><div><span className="eyebrow light">Grow with GlowLink</span><h2>Turn appointments into<br/>your next success.</h2></div><button onClick={()=>navigate('for-salons')}>Join as a salon <ChevronRight size={18}/></button></section>
    </main>}

    {(page==='discover') && <main className="inner-page"><div className="inner-heading"><span className="eyebrow">Explore</span><h1>Find your salon</h1></div><div className="filter-row"><div className="search-box inline"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search salons or services"/></div><button className="filter-button"><SlidersHorizontal size={18}/> Filters</button></div><SalonGrid salons={filtered} onSelect={setSelected}/></main>}

    {(page==='for-salons') && <main className="partner-page"><div className="partner-copy"><span class="eyebrow">Salon partners</span><h1>More clients.<br/><em>Less admin.</em></h1><p>Join a growing network of premium salons and let GlowLink bring the right clients to your chair.</p><div className="partner-stats"><div><strong>2,000+</strong><span>active clients</span></div><div><strong>10%</strong><span>agent commission</span></div></div><button className="primary-button" onClick={()=>setAuthOpen(true)}>Become a partner</button></div><div className="partner-card"><div className="partner-card-top"><span>This month</span><strong>R18,450</strong></div><div className="chart"><i/><i/><i/><i/><i/><i/><i/></div><div className="partner-booking"><div class="booking-icon"><Scissors size={18}/></div><div><strong>New appointment</strong><span>Lisa M. · 10:30</span></div><b>Confirmed</b></div></div></main>}

    {(page==='bookings' || page==='dashboard') && <Dashboard role={role} setRole={setRole} user={user} onLogout={logout} onDiscover={()=>navigate('discover')}/>} 

    {selected && <SalonModal salon={selected} onClose={()=>setSelected(null)} user={user} onLogin={()=>setAuthOpen(true)}/>}

    {authOpen && <AuthModal mode={authMode} setMode={setAuthMode} role={role} setRole={setRole} onClose={()=>setAuthOpen(false)} onGoogle={googleLogin}/>} 

    <footer><Logo light/><p>Beauty is personal. Your booking should be too.</p><div><button>Instagram</button><button>Privacy</button><button>Support</button></div></footer>
  </>
}

function SalonGrid({salons,onSelect}) { return <div className="salon-grid">{salons.map(s=><article className="salon-card" key={s.id} onClick={()=>onSelect(s)}><div className="card-image"><img src={s.image} alt={s.name}/>{s.featured&&<span>Popular</span>}<button onClick={e=>e.stopPropagation()} aria-label="Save salon"><Heart size={18}/></button></div><div className="card-body"><div className="card-title"><h3>{s.name}</h3><span><Star size={14} fill="currentColor"/> {s.rating}</span></div><p>{s.category}</p><div className="card-meta"><span><MapPin size={14}/>{s.location}</span><b>{s.distance}</b></div><div className="card-footer"><strong>{s.price}</strong><span>{s.reviews} reviews</span></div></div></article>)}</div> }

function SalonModal({salon,onClose,user,onLogin}) {
  const [service,setService]=useState(salon.services[0])
  const [date,setDate]=useState('2026-11-21')
  const [booked,setBooked]=useState(false)
  const book=()=>{if(!user){onLogin();return} setBooked(true)}
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="salon-modal"><button className="modal-close" onClick={onClose}><X/></button>{booked?<div className="success"><div><Check/></div><h2>You're booked!</h2><p>{service.name} at {salon.name}</p><button className="primary-button" onClick={onClose}>Done</button></div>:<><div className="modal-image"><img src={salon.image}/></div><div className="modal-content"><span className="eyebrow">{salon.category}</span><h2>{salon.name}</h2><p className="modal-location"><MapPin size={15}/>{salon.location} · <Star size={14} fill="currentColor"/> {salon.rating}</p><h3>Choose a service</h3><div className="service-list">{salon.services.map(x=><button key={x.name} className={service.name===x.name?'selected':''} onClick={()=>setService(x)}><div><strong>{x.name}</strong><span><Clock3 size={13}/>{x.duration}</span></div><b>R{x.price}</b></button>)}</div><label className="date-field">Preferred date<input type="date" value={date} onChange={e=>setDate(e.target.value)} min="2026-11-20"/></label><button className="primary-button full" onClick={book}>Request booking · R{service.price}</button></div></>}</div></div>
}

function AuthModal({mode,setMode,role,setRole,onClose,onGoogle}) {
  return <div className="overlay" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><div className="auth-modal"><button className="modal-close" onClick={onClose}><X/></button><Logo/><h2>{mode==='login'?'Welcome back':'Create your account'}</h2><p>{mode==='login'?'Sign in to manage your beauty bookings.':'Join GlowLink and make your next appointment easy.'}</p><div className="role-tabs"><button className={role==='client'?'active':''} onClick={()=>setRole('client')}>Client</button><button className={role==='owner'?'active':''} onClick={()=>setRole('owner')}>Salon owner</button><button className={role==='agent'?'active':''} onClick={()=>setRole('agent')}>Agent</button></div><button className="google-button" onClick={onGoogle}><span>G</span>Continue with Google</button><div className="divider"><span>or</span></div><label>Email address<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><button className="primary-button full" onClick={onClose}>{mode==='login'?'Sign in':'Create account'}</button><p className="auth-switch">{mode==='login'?"Don't have an account?":"Already have an account?"} <button onClick={()=>setMode(mode==='login'?'signup':'login')}>{mode==='login'?'Sign up':'Sign in'}</button></p></div></div>
}

function Dashboard({role,setRole,user,onLogout,onDiscover}) {
  const isOwner=role==='owner', isAgent=role==='agent'
  return <main className="dashboard"><aside><Logo/><nav><button className="active"><LayoutDashboard/>Overview</button><button><CalendarDays/>Bookings</button>{isOwner&&<button><Scissors/>My salon</button>}<button><WalletCards/>Payments</button></nav><button className="logout" onClick={onLogout}><LogOut/>Sign out</button></aside><section className="dashboard-main"><div className="dashboard-head"><div><span className="eyebrow">Dashboard</span><h1>{isAgent?'Commission overview':isOwner?'Business overview':'My bookings'}</h1></div><select value={role} onChange={e=>setRole(e.target.value)}><option value="client">Client</option><option value="owner">Salon owner</option><option value="agent">Agent</option></select></div>{isAgent?<><div className="stats"><div><span>Total commission</span><strong>R4,280</strong><small>+18% this month</small></div><div><span>Completed bookings</span><strong>86</strong><small>Across 12 salons</small></div><div><span>Pending payout</span><strong>R920</strong><small>Next payout Friday</small></div></div><div className="panel"><h3>Recent commissions</h3>{[['Velvet & Rose','R480','R48'],['Studio No. 7','R320','R32'],['The Braiding Room','R850','R85']].map(x=><div className="table-row" key={x[0]}><span>{x[0]}</span><span>Booking {x[1]}</span><strong>{x[2]}</strong></div>)}</div></>:<><div className="stats"><div><span>{isOwner?'Monthly revenue':'Upcoming'}</span><strong>{isOwner?'R18,450':'2'}</strong><small>{isOwner?'This month':'appointments'}</small></div><div><span>{isOwner?'Appointments':'Completed'}</span><strong>{isOwner?'24':'7'}</strong><small>{isOwner?'Confirmed':'services'}</small></div><div><span>{isOwner?'Average rating':'Saved salons'}</span><strong>{isOwner?'4.9':'3'}</strong><small>{isOwner?'★★★★★':'favorites'}</small></div></div><div className="panel"><h3>{isOwner?'Today’s appointments':'Upcoming appointments'}</h3><div className="table-row"><span>Velvet & Rose</span><span>Silk press · 10:30</span><strong>Confirmed</strong></div><div className="table-row"><span>Studio No. 7</span><span>Gel manicure · 14:00</span><strong>Confirmed</strong></div></div></>}<button className="primary-button dashboard-action" onClick={onDiscover}>Explore salons</button></section></main>
}

createRoot(document.getElementById('root')).render(<App/>)
