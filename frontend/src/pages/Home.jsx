import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Star, Clock, ChefHat, Activity, Receipt, Utensils, CheckCircle2 } from 'lucide-react';
import { getFoodImage } from '../utils/foodImages';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const Home = () => {
  const [stats, setStats] = useState({ total_orders: 0, total_tables: 0, total_menu_items: 0, total_categories: 0 });
  const [featured, setFeatured] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    // Fetch stats
    axios.get('/dashboard/public').then(res => setStats(res.data)).catch(console.error);
    
    // Fetch menu items
    axios.get('/menu').then(res => {
      const items = res.data;
      setFeatured(items.slice(0, 8)); // First 8 for featured
      setRecommended(items.filter(i => i.is_recommended).slice(0, 4));
      setPopular(items.filter(i => i.is_popular).slice(0, 4));
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-[#09090B] text-zinc-100 min-h-screen overflow-x-hidden font-sans">
      
      {/* TOP NAVIGATION */}
      <nav className="absolute top-0 w-full z-50 px-6 py-6 border-b border-white/5 bg-gradient-to-b from-black/80 to-transparent">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="text-2xl font-bold text-amber-500 tracking-widest flex items-center gap-2">
              <Utensils size={24} /> ZESTORA
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
              <Link to="/" className="text-white hover:text-amber-500 transition-colors">Home</Link>
              <Link to="/order" className="hover:text-amber-500 transition-colors">Menu</Link>
              <Link to="#" className="hover:text-amber-500 transition-colors">About</Link>
              <Link to="#" className="hover:text-amber-500 transition-colors">Contact</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2 text-sm font-bold text-white hover:text-amber-500 transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="px-5 py-2 text-sm font-bold bg-amber-500 text-zinc-950 rounded-md hover:bg-amber-400 transition-colors">
              Order Now
            </Link>
          </div>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090B] via-[#09090B]/90 to-transparent z-10" />
          <img 
            src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1920" 
            alt="Cinematic Restaurant" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        
        <div className="container mx-auto relative z-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-2xl">
            <motion.div variants={fadeIn} className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-amber-500"></span>
              <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm">ZESTORA</span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold leading-tight mb-6 text-white">
              Smart Dining. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">Smarter Management.</span>
            </motion.h1>
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed">
              Experience the perfect fusion of authentic culinary mastery and cutting-edge restaurant technology. 
              Fresh flavors, seamless ordering, and memorable dining moments await.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-wrap gap-4">
              <Link to="/order" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                Explore Menu <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-md text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Order Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 7. WHY ZESTORA */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="container mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <ArrowRight className="text-amber-500" size={32} />, title: "Fast Ordering", desc: "Digital menus and lightning-fast POS integration." },
              { icon: <ChefHat className="text-amber-500" size={32} />, title: "Real-Time Kitchen", desc: "Live KDS tracking from prep to plate." },
              { icon: <Receipt className="text-amber-500" size={32} />, title: "Smart Billing", desc: "Automated GST & service charge calculations." },
              { icon: <Activity className="text-amber-500" size={32} />, title: "Live Analytics", desc: "Monitor restaurant performance in real-time." }
            ].map((feature, i) => (
              <motion.div key={i} variants={fadeIn} className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-colors">
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Culinary Journeys</h2>
              <p className="text-zinc-400 text-lg">Explore our diverse flavor profiles</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Biryani', img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=400' },
              { name: 'Indian', img: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=400' },
              { name: 'Chinese', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=400' },
              { name: 'Pizza', img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=400' },
              { name: 'Burgers', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400' },
              { name: 'Desserts', img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400' },
              { name: 'Beverages', img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=400' },
            ].map((cat, i) => (
              <Link to="/order" key={i} className="group relative h-48 rounded-xl overflow-hidden cursor-pointer block">
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors z-10" />
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white tracking-wide">{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CHEF'S PICKS & 5. MOST POPULAR */}
      <section className="py-24 px-6 bg-zinc-900/50">
        <div className="container mx-auto">
          <div className="mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-12">Chef's Recommendations</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {recommended.map(item => (
                <div key={item.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 group">
                  <div className="h-48 overflow-hidden">
                    <img src={getFoodImage(item.name) || 'https://via.placeholder.com/400x300/18181B/F59E0B?text=Menu+Item'} onError={e => e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <span className="text-amber-500 font-semibold">₹{item.price}</span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock size={14}/> {item.prep_time}m</span>
                      <span className={item.is_veg ? 'text-green-500' : 'text-red-500'}>● {item.is_veg ? 'Veg' : 'Non-Veg'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-12">Trending Right Now</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {popular.map(item => (
                <div key={item.id} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 group">
                  <div className="h-48 overflow-hidden">
                    <img src={getFoodImage(item.name) || 'https://via.placeholder.com/400x300/18181B/F59E0B?text=Menu+Item'} onError={e => e.target.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400'} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{item.name}</h3>
                      <span className="text-amber-500 font-semibold">₹{item.price}</span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1"><Clock size={14}/> {item.prep_time}m</span>
                      <span className={item.is_veg ? 'text-green-500' : 'text-red-500'}>● {item.is_veg ? 'Veg' : 'Non-Veg'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. LIVE STATS */}
      <section className="py-24 px-6 border-y border-white/10 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920')] bg-cover bg-center bg-fixed relative">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Orders Served', value: stats.total_orders + '+' },
              { label: 'Menu Delights', value: stats.total_menu_items },
              { label: 'Active Tables', value: stats.total_tables },
              { label: 'Categories', value: stats.total_categories }
            ].map((stat, i) => (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} key={i}>
                <div className="text-4xl md:text-6xl font-bold text-amber-500 mb-2">{stat.value}</div>
                <div className="text-zinc-400 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">What Our Guests Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahul S.", review: "The Butter Chicken is absolutely phenomenal. Service was incredibly fast thanks to their smart ordering system!" },
              { name: "Priya M.", review: "Best Biryani in town! The ambiance is great and the digital bill payment made exiting a breeze." },
              { name: "Amit K.", review: "A seamless dining experience. The kitchen was so fast and the mocktails were perfectly crafted." }
            ].map((t, i) => (
              <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/5 relative">
                <div className="flex text-amber-500 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-lg text-zinc-300 mb-6 italic">"{t.review}"</p>
                <div className="font-bold text-white">— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent" />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to experience ZESTORA?</h2>
          <p className="text-xl text-zinc-400 mb-12">Book your table now or order directly from our premium digital menu.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/order" className="px-8 py-4 bg-amber-500 text-zinc-950 rounded-lg font-bold hover:bg-amber-400 transition-colors">
              Explore Menu
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-colors">
              Start Ordering
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 12. FOOTER */}
      <footer className="border-t border-white/10 bg-[#09090B] pt-16 pb-8 px-6">
        <div className="container mx-auto grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-amber-500 mb-4 tracking-widest">ZESTORA</div>
            <p className="text-zinc-400 max-w-sm mb-6">Smart Dining. Smarter Management. Bringing culinary excellence together with modern SaaS technology.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-4 text-zinc-400">
              <li><Link to="/order" className="hover:text-amber-500 transition-colors">Menu</Link></li>
              <li><Link to="#" className="hover:text-amber-500 transition-colors">About Us</Link></li>
              <li><Link to="#" className="hover:text-amber-500 transition-colors">Contact</Link></li>
              <li><Link to="/login" className="hover:text-amber-500 transition-colors">Staff Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-6">Contact Us</h4>
            <ul className="space-y-4 text-zinc-400">
              <li>123 Culinary Avenue, Food District</li>
              <li>contact@zestora.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto pt-8 border-t border-white/10 text-center text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} ZESTORA Restaurant Management System. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
