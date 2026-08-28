import React, { useState, useContext, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ShoppingCart, Phone, AlertTriangle, IceCream, Star, CheckCircle,
  User, BarChart2, Package, Inbox, Heart, Gift, BookOpen, Search,
  MapPin, Clock, ChevronRight, Plus, Minus, Trash2, FileText, CreditCard,
  Smartphone, DollarSign, TrendingUp, Users, Settings, Calendar, Award,
  Eye, Truck, Coffee, Layers, Zap, Target, MessageCircle, X, Menu,
  ChevronDown, Check, ArrowRight, Shield, Sparkles, Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';

// ============================================================================
// CONTEXT GLOBAL
// ============================================================================
const SugarContext = createContext();

const CATALOG = [
  { id:1, cat:'Premium', name:'Choco Vainilla', price:700, stock:15, sold:23, img:'https://images.unsplash.com/photo-1570197781417-0c1598ccce56?w=300&q=80', desc:'Paleta cremosa con baño de chocolate y vainilla natural.' },
  { id:2, cat:'Premium', name:'Chocolate', price:700, stock:10, sold:31, img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80', desc:'100% cacao intenso con textura aterciopelada.' },
  { id:3, cat:'Premium', name:'Yipi', price:700, stock:10, sold:12, img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80', desc:'Mezcla exclusiva multicolor con toppings crujientes.' },
  { id:4, cat:'Premium', name:'Cappuccino', price:700, stock:8, sold:18, img:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80', desc:'Café espresso artesanal en paleta helada.' },
  { id:5, cat:'Premium', name:'Oreo Limón', price:700, stock:12, sold:27, img:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80', desc:'Galleta Oreo triturada con toque cítrico.' },
  { id:6, cat:'Premium', name:'ChocoFresa', price:700, stock:15, sold:20, img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80', desc:'Fresa natural bañada en chocolate belga.' },
  { id:7, cat:'Premium', name:'Queque', price:700, stock:5, sold:9, img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80', desc:'Sabor a pastel de cumpleaños con chispas.' },
  { id:8, cat:'Premium', name:'Churchill', price:700, stock:20, sold:35, img:'https://images.unsplash.com/photo-1570197781417-0c1598ccce56?w=300&q=80', desc:'El clásico costarricense: raspado con sirope y leche.' },
  { id:9, cat:'Premium', name:'Pinito', price:700, stock:10, sold:14, img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80', desc:'Crema de leche Pinito en versión helada.' },
  { id:10, cat:'Tradicionales', name:'Crema', price:500, stock:15, sold:40, img:'https://images.unsplash.com/photo-1550461716-ba43c7b64264?w=300&q=80', desc:'Clásica paleta de crema artesanal.' },
  { id:11, cat:'Tradicionales', name:'Galleta Oreo', price:500, stock:20, sold:38, img:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80', desc:'Cookies & cream con trozos reales de galleta.' },
  { id:12, cat:'Tradicionales', name:'NatiFrutas', price:500, stock:8, sold:15, img:'https://images.unsplash.com/photo-1550461716-ba43c7b64264?w=300&q=80', desc:'Mezcla tropical de frutas naturales.' },
  { id:13, cat:'Tradicionales', name:'Chocomaní', price:500, stock:10, sold:22, img:'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80', desc:'Chocolate con trozos de maní tostado.' },
  { id:14, cat:'Frescas', name:'Cas', price:500, stock:25, sold:45, img:'https://images.unsplash.com/photo-1515037028865-0a2a82603f7c?w=300&q=80', desc:'Fruta de cas 100% natural, ultra refrescante.' },
  { id:15, cat:'Frescas', name:'Hierbabuena', price:500, stock:20, sold:28, img:'https://images.unsplash.com/photo-1515037028865-0a2a82603f7c?w=300&q=80', desc:'Menta fresca con un toque herbáceo natural.' },
  { id:16, cat:'Tajín y Chamoy', name:'Cas Con Tajín y Chamoy', price:600, stock:12, sold:19, img:'https://images.unsplash.com/photo-1515037028865-0a2a82603f7c?w=300&q=80', desc:'Cas natural con el picante del Tajín y dulzor del Chamoy.' },
  { id:17, cat:'Tajín y Chamoy', name:'Mango Con Tajín y Chamoy', price:600, stock:10, sold:25, img:'https://images.unsplash.com/photo-1515037028865-0a2a82603f7c?w=300&q=80', desc:'Mango maduro enchilado con Chamoy artesanal.' },
  { id:18, cat:'Tajín y Chamoy', name:'Piña Con Tajín y Chamoy', price:600, stock:15, sold:16, img:'https://images.unsplash.com/photo-1515037028865-0a2a82603f7c?w=300&q=80', desc:'Piña tropical con el toque picante perfecto.' },
  { id:19, cat:'Postres Especiales', name:'Tacita de Piña', price:1000, stock:8, sold:11, img:'https://images.unsplash.com/photo-1550461716-ba43c7b64264?w=300&q=80', desc:'Postre frío servido en tacita con piña fresca.' },
  { id:20, cat:'Postres Especiales', name:'Tacita de Oreo', price:1000, stock:6, sold:13, img:'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&q=80', desc:'Capas de crema y Oreo triturada en tacita.' },
  { id:21, cat:'Postres Especiales', name:'Gelatina Mosaico', price:1000, stock:10, sold:8, img:'https://images.unsplash.com/photo-1550461716-ba43c7b64264?w=300&q=80', desc:'Gelatina multicolor con leche condensada artesanal.' },
  { id:22, cat:'Postres Especiales', name:'Cheesecake', price:1000, stock:5, sold:17, img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80', desc:'Cheesecake frío de fresa con base de galleta.' },
];

const DISTRIBUTORS = [
  { id:1, tab:'Helados', nombre:'Dos Pinos', contacto:'800-222-2222', encargado:'Juan Pérez', nota:'Proveedor base de leche y crema' },
  { id:2, tab:'Helados', nombre:'Helados Artesanales CR', contacto:'8877-1234', encargado:'Andrea Solís', nota:'Bases premium y saborizantes' },
  { id:3, tab:'Frutas Frescas', nombre:'Feria del Agricultor SA', contacto:'8999-0000', encargado:'Doña Rosa', nota:'Frutas de temporada y cas' },
  { id:4, tab:'Frutas Frescas', nombre:'Frutería El Valle', contacto:'2222-3344', encargado:'Mario Quesada', nota:'Piña, mango y frutas tropicales' },
  { id:5, tab:'Vasos/Empaques', nombre:'Empaques CR', contacto:'2255-7777', encargado:'Carlos M.', nota:'Vasos, cucharas y servilletas' },
  { id:6, tab:'Vasos/Empaques', nombre:'Plásticos del Sur', contacto:'2288-9900', encargado:'Lucía Araya', nota:'Empaques biodegradables' },
  { id:7, tab:'Materiales', nombre:'Pricesmart', contacto:'800-774-2300', encargado:'N/A', nota:'Insumos al por mayor' },
  { id:8, tab:'Materiales', nombre:'Mayca Food Service', contacto:'2209-5500', encargado:'Ventas Corporativas', nota:'Jarabes, toppings y salsas' },
];

const PROMOS = [
  { id:1, title:'2x1 en Frescas 🧊', desc:'Lleva 2 paletas de Cas o Hierbabuena al precio de 1. Solo hoy.', badge:'HOT', color:'#00bcd4' },
  { id:2, title:'Combo Familiar 👨‍👩‍👧‍👦', desc:'4 paletas Premium + 2 Postres Especiales por ₡5,500.', badge:'COMBO', color:'#ff9800' },
  { id:3, title:'Postre de Temporada 🍓', desc:'Nuevo Cheesecake de Fresa por solo ₡900 esta semana.', badge:'NUEVO', color:'#e91e63' },
  { id:4, title:'Tajín Day 🌶️', desc:'15% de descuento en toda la línea Tajín y Chamoy. ¡Atrévete!', badge:'-15%', color:'#f44336' },
];

function SugarProvider({ children }) {
  const [role, setRole] = useState('cliente');
  const [productos, setProductos] = useState(CATALOG);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [favs, setFavs] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [reportes, setReportes] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [donaciones, setDonaciones] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [puntos, setPuntos] = useState(0);
  const [nivel, setNivel] = useState('Bronce');
  const [eventos, setEventos] = useState([
    { id:1, titulo:'Fiesta Infantil - Familia Rojas', fecha:'2026-09-05', paquete:'20 paletas + decoración', estado:'Confirmado', total:15000 },
  ]);
  const [configNegocio, setConfigNegocio] = useState({
    nombre: 'Sugar Mood', telefono: '8888-1234', sinpe: '8888-1234',
    direccion: 'San José, Costa Rica', horario: 'Lun-Sáb 10:00 - 20:00',
    iva: 13, envio: 500, pedidoMinimo: 1500
  });
  const [gastos, setGastos] = useState([
    { id:1, concepto:'Compra de insumos', monto:25000, fecha:'2026-08-25' },
    { id:2, concepto:'Empaques biodegradables', monto:8000, fecha:'2026-08-26' },
    { id:3, concepto:'Mantenimiento freezer', monto:15000, fecha:'2026-08-27' },
  ]);

  const toggleFav = (id) => setFavs(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);
  const rateProduct = (id, r) => setRatings(p => ({ ...p, [id]: r }));
  const addComment = (id, text) => setComments(p => ({ ...p, [id]: [...(p[id]||[]), { user:'Cliente', text, date: new Date().toLocaleDateString() }] }));
  const updateStock = (id, delta) => setProductos(p => p.map(x => x.id === id ? { ...x, stock: Math.max(0, x.stock + delta) } : x));

  const addToCart = (prod) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === prod.id);
      if (exists) return prev.map(c => c.id === prod.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...prod, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(p => p.filter(c => c.id !== id));
  const updateCartQty = (id, delta) => setCart(p => p.map(c => c.id === id ? { ...c, qty: Math.max(1, c.qty + delta) } : c));

  const placeOrder = (orderData) => {
    const newOrder = {
      id: 'SM-' + Date.now().toString(36).toUpperCase(),
      items: [...cart],
      ...orderData,
      fecha: new Date().toLocaleString(),
      estado: 'Pendiente',
      tracking: ['Pedido recibido'],
    };
    setOrders(prev => [newOrder, ...prev]);
    cart.forEach(item => {
      setProductos(prev => prev.map(p => p.id === item.id ? { ...p, stock: Math.max(0, p.stock - item.qty), sold: p.sold + item.qty } : p));
    });
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const pts = Math.floor(total / 100);
    setPuntos(prev => {
      const np = prev + pts;
      if (np >= 500) setNivel('Oro');
      else if (np >= 200) setNivel('Plata');
      return np;
    });
    const clienteName = orderData.clientName || 'Cliente Anónimo';
    setClientes(prev => {
      const ex = prev.find(c => c.nombre === clienteName);
      if (ex) return prev.map(c => c.nombre === clienteName ? { ...c, totalGastado: c.totalGastado + total, pedidos: c.pedidos + 1 } : c);
      return [...prev, { id: Date.now(), nombre: clienteName, totalGastado: total, pedidos: 1, favorito: cart[0]?.name || 'N/A' }];
    });
    setCart([]);
    return newOrder;
  };

  const updateOrderStatus = (id, estado) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const trackMap = { 'Pendiente':['Pedido recibido'], 'En preparación':['Pedido recibido','En preparación'], 'En camino':['Pedido recibido','En preparación','En camino'], 'Entregado':['Pedido recibido','En preparación','En camino','Entregado'] };
      return { ...o, estado, tracking: trackMap[estado] || o.tracking };
    }));
  };

  const markReport = (id) => setReportes(p => p.map(r => r.id === id ? { ...r, estado:'Resuelto' } : r));
  const addProduct = (prod) => setProductos(p => [...p, { ...prod, id: Date.now(), sold: 0 }]);

  return (
    <SugarContext.Provider value={{
      role, setRole, productos, setProductos, cart, setCart, addToCart, removeFromCart,
      updateCartQty, orders, placeOrder, updateOrderStatus, favs, toggleFav,
      ratings, rateProduct, comments, addComment, reportes, setReportes,
      mensajes, setMensajes, donaciones, setDonaciones, clientes, puntos, nivel,
      updateStock, markReport, addProduct, eventos, setEventos, configNegocio,
      setConfigNegocio, gastos, setGastos,
    }}>
      {children}
    </SugarContext.Provider>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================
const fadeIn = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} };
const stagger = { visible:{ transition:{ staggerChildren: 0.08 } } };

function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'20px' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onChange(t)} style={{
          padding:'8px 18px', borderRadius:'20px', border:'none', fontWeight:600, fontSize:'0.85rem',
          background: active === t ? 'linear-gradient(135deg,#00695c,#00897b)' : 'rgba(255,255,255,0.7)',
          color: active === t ? '#fff' : '#555', transition:'all 0.2s',
        }}>{t}</button>
      ))}
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color, prefix = '' }) {
  return (
    <motion.div variants={fadeIn} className="kpi-card" style={{ borderLeft:`4px solid ${color}` }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
        <Icon size={20} color={color} />
        <span style={{ color:'#888', fontSize:'0.85rem', fontWeight:600 }}>{label}</span>
      </div>
      <p style={{ fontSize:'1.8rem', fontWeight:700, color, margin:0 }}>{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </motion.div>
  );
}

function ProgressBar({ value, max, color = '#4caf50', label }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div style={{ marginBottom:'12px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem', marginBottom:'4px' }}>
        <span>{label}</span><span style={{ fontWeight:700 }}>{value}</span>
      </div>
      <div style={{ width:'100%', background:'#eee', height:'8px', borderRadius:'4px', overflow:'hidden' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }} transition={{ duration:0.8 }}
          style={{ height:'100%', background: color, borderRadius:'4px' }} />
      </div>
    </div>
  );
}

// ============================================================================
// CLIENTE: INICIO
// ============================================================================
function PaginaInicio() {
  const { productos, role, setRole } = useContext(SugarContext);
  const nav = useNavigate();
  const destacados = productos.filter(p => p.sold > 20).slice(0, 6);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.div variants={fadeIn} style={{
        background:'linear-gradient(135deg,#00695c 0%,#26a69a 50%,#e91e63 100%)',
        borderRadius:'24px', padding:'50px 40px', color:'#fff', marginBottom:'30px', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:'-50px', right:'-30px', fontSize:'120px', opacity:0.15 }}>🍦</div>
        <motion.h1 initial={{ x:-30, opacity:0 }} animate={{ x:0, opacity:1 }} style={{ fontSize:'2.8rem', margin:'0 0 10px', fontWeight:700 }}>Sugar Mood</motion.h1>
        <p style={{ fontSize:'1.15rem', opacity:0.9, maxWidth:'500px', marginBottom:'25px' }}>Postres fríos artesanales que endulzan tu día. Paletas, helados, y creaciones únicas hechas con amor 🧡</p>
        <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
          <button className="btn-primary" onClick={() => nav('/pedido')} style={{ background:'#fff', color:'#e91e63', fontWeight:700, fontSize:'1rem', padding:'14px 28px' }}>
            🛒 Hacer Pedido
          </button>
          <button className="btn-secondary" onClick={() => nav('/catalogo')} style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)' }}>
            Ver Catálogo <ChevronRight size={16} />
          </button>
          <button className="btn-secondary" onClick={() => setRole(role === 'cliente' ? 'admin' : 'cliente')} style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.4)' }}>
            {role === 'cliente' ? '🔧 Ir a Admin' : '🛍️ Ir a Cliente'}
          </button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'30px' }}>
        {[{ icon:Clock, text:'Lun-Sáb 10am-8pm' }, { icon:MapPin, text:'San José, Costa Rica' }, { icon:Smartphone, text:'SINPE: 8888-1234' }, { icon:Truck, text:'Envío Express ₡500' }].map((item,i) => (
          <div key={i} className="glass-panel" style={{ padding:'14px 20px', borderRadius:'14px', display:'flex', alignItems:'center', gap:'10px', flex:'1 1 200px' }}>
            <item.icon size={18} color="#00695c" /><span style={{ fontSize:'0.9rem', fontWeight:600 }}>{item.text}</span>
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeIn}>
        <h2 style={{ color:'#00695c', marginBottom:'15px', fontSize:'1.4rem' }}>⭐ Más Vendidos</h2>
        <div style={{ display:'flex', gap:'15px', flexWrap:'wrap' }}>
          {destacados.map(p => (
            <motion.div key={p.id} variants={fadeIn} whileHover={{ y:-6, scale:1.02 }} className="glass-panel"
              style={{ borderRadius:'16px', padding:'15px', flex:'1 1 180px', maxWidth:'220px', textAlign:'center' }}>
              <img src={p.img} alt={p.name} style={{ width:'100%', height:'120px', objectFit:'cover', borderRadius:'10px', marginBottom:'10px' }} />
              <h4 style={{ margin:'0 0 4px', color:'#00695c', fontSize:'0.95rem' }}>{p.name}</h4>
              <span style={{ color:'#e91e63', fontWeight:700, fontSize:'1.1rem' }}>₡{p.price}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} style={{ marginTop:'30px' }}>
        <h2 style={{ color:'#00695c', marginBottom:'15px', fontSize:'1.4rem' }}>🎁 Promociones Activas</h2>
        <div style={{ display:'flex', gap:'15px', flexWrap:'wrap' }}>
          {PROMOS.map(pr => (
            <motion.div key={pr.id} variants={fadeIn} whileHover={{ scale:1.03 }} style={{
              background:`linear-gradient(135deg, ${pr.color}15, ${pr.color}08)`,
              border:`1.5px solid ${pr.color}40`, borderRadius:'16px', padding:'20px', flex:'1 1 260px',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
                <h4 style={{ margin:0, fontSize:'1rem' }}>{pr.title}</h4>
                <span style={{ background: pr.color, color:'#fff', padding:'3px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:700 }}>{pr.badge}</span>
              </div>
              <p style={{ fontSize:'0.85rem', color:'#555' }}>{pr.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: CATÁLOGO
// ============================================================================
function CatalogoCliente() {
  const { productos, addToCart, favs, toggleFav, ratings, rateProduct, comments, addComment } = useContext(SugarContext);
  const cats = [...new Set(productos.map(p => p.cat))];
  const [tab, setTab] = useState(cats[0]);
  const [commentTexts, setCommentTexts] = useState({});
  const filtered = productos.filter(p => p.cat === tab);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'5px' }}>🍦 Catálogo</motion.h1>
      <motion.p variants={fadeIn} style={{ color:'#888', marginBottom:'20px' }}>Explora nuestros sabores por categoría</motion.p>
      <TabBar tabs={cats} active={tab} onChange={setTab} />
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial="hidden" animate="visible" exit={{ opacity:0 }} variants={stagger}
          style={{ display:'flex', flexWrap:'wrap', gap:'15px' }}>
          {filtered.map(prod => {
            const isFav = favs.includes(prod.id);
            const myR = ratings[prod.id] || 0;
            const myC = comments[prod.id] || [];
            return (
              <motion.div key={prod.id} variants={fadeIn} whileHover={{ y:-8, scale:1.02 }}
                className="glass-panel" style={{ borderRadius:'20px', padding:'18px', flex:'1 1 280px', maxWidth:'340px', display:'flex', flexDirection:'column' }}>
                <div style={{ position:'relative', height:'170px', borderRadius:'14px', overflow:'hidden', marginBottom:'12px' }}>
                  <img src={prod.img} alt={prod.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  <button onClick={() => toggleFav(prod.id)} style={{ position:'absolute', top:8, right:8, background:'rgba(255,255,255,0.85)', border:'none', borderRadius:'50%', padding:'7px', display:'flex' }}>
                    <Heart fill={isFav?'#e91e63':'none'} color={isFav?'#e91e63':'#999'} size={18} />
                  </button>
                  {prod.stock < 5 && <span style={{ position:'absolute', bottom:8, left:8, background:'#f44336', color:'#fff', padding:'3px 10px', borderRadius:'12px', fontSize:'0.7rem', fontWeight:700 }}>¡Últimas!</span>}
                </div>
                <span style={{ fontSize:'0.75rem', color:'#e91e63', fontWeight:700, textTransform:'uppercase' }}>{prod.cat}</span>
                <h3 style={{ margin:'4px 0', color:'#00695c', fontSize:'1.05rem' }}>{prod.name}</h3>
                <p style={{ fontSize:'0.8rem', color:'#777', flexGrow:1, marginBottom:'10px' }}>{prod.desc}</p>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
                  <span style={{ fontWeight:700, fontSize:'1.2rem', color:'#e91e63' }}>₡{prod.price}</span>
                  <div style={{ display:'flex', gap:'2px' }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={15} fill={s<=myR?'#ffc107':'none'} color="#ffc107" onClick={() => rateProduct(prod.id,s)} />
                    ))}
                  </div>
                </div>
                <button className="btn-secondary" onClick={() => addToCart(prod)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', padding:'10px' }}>
                  <ShoppingCart size={16} /> Agregar
                </button>
                {myC.length > 0 && (
                  <div style={{ marginTop:'10px', maxHeight:'55px', overflowY:'auto' }}>
                    {myC.map((c,i) => <div key={i} style={{ fontSize:'0.75rem', background:'rgba(0,0,0,0.03)', padding:'4px 8px', borderRadius:'4px', marginBottom:'3px' }}><b>{c.user}:</b> {c.text}</div>)}
                  </div>
                )}
                <div style={{ display:'flex', gap:'5px', marginTop:'8px' }}>
                  <input className="input-field" value={commentTexts[prod.id]||''} onChange={e => setCommentTexts(p=>({...p,[prod.id]:e.target.value}))}
                    placeholder="Comentar..." style={{ padding:'6px 10px', fontSize:'0.8rem' }} />
                  <button onClick={() => { if(commentTexts[prod.id]) { addComment(prod.id, commentTexts[prod.id]); setCommentTexts(p=>({...p,[prod.id]:''})); } }}
                    style={{ padding:'6px 12px', background:'#00695c', color:'#fff', border:'none', borderRadius:'8px', fontSize:'0.8rem', fontWeight:600 }}>Ok</button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: PROMOCIONES
// ============================================================================
function PromocionesCliente() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>🎁 Promociones</motion.h1>
      <div style={{ display:'flex', flexDirection:'column', gap:'15px' }}>
        {PROMOS.map(pr => (
          <motion.div key={pr.id} variants={fadeIn} whileHover={{ scale:1.01 }} className="glass-panel" style={{ borderRadius:'16px', padding:'25px', borderLeft:`5px solid ${pr.color}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'8px' }}>
              <h2 style={{ margin:0, fontSize:'1.2rem' }}>{pr.title}</h2>
              <span style={{ background:pr.color, color:'#fff', padding:'4px 14px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:700 }}>{pr.badge}</span>
            </div>
            <p style={{ color:'#555' }}>{pr.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: ARMA TU POSTRE
// ============================================================================
function ArmaPostre() {
  const { addToCart } = useContext(SugarContext);
  const [step, setStep] = useState(0);
  const [sel, setSel] = useState({ base:'', sabor:'', toppings:[], salsa:'', fruta:'' });
  const bases = [{ n:'Vaso', p:200 },{ n:'Barquillo', p:300 },{ n:'Copa', p:350 }];
  const sabores = [{ n:'Vainilla', p:400 },{ n:'Chocolate', p:400 },{ n:'Fresa', p:400 },{ n:'Cas', p:350 },{ n:'Cappuccino', p:450 }];
  const toppings = [{ n:'Chispas', p:100 },{ n:'Oreo', p:150 },{ n:'Maní', p:100 },{ n:'Gomitas', p:120 },{ n:'Granola', p:100 }];
  const salsas = [{ n:'Chocolate', p:100 },{ n:'Caramelo', p:100 },{ n:'Chamoy', p:120 },{ n:'Fresa', p:100 }];
  const frutas = [{ n:'Fresa', p:150 },{ n:'Piña', p:150 },{ n:'Mango', p:150 },{ n:'Banano', p:100 }];
  const steps = ['Base','Sabor','Toppings','Salsa','Fruta'];

  const totalPrice = () => {
    let t = 0;
    const b = bases.find(x=>x.n===sel.base); if(b) t+=b.p;
    const s = sabores.find(x=>x.n===sel.sabor); if(s) t+=s.p;
    sel.toppings.forEach(tp => { const f = toppings.find(x=>x.n===tp); if(f) t+=f.p; });
    const sa = salsas.find(x=>x.n===sel.salsa); if(sa) t+=sa.p;
    const fr = frutas.find(x=>x.n===sel.fruta); if(fr) t+=fr.p;
    return t;
  };

  const toggleTopping = (n) => setSel(p => ({ ...p, toppings: p.toppings.includes(n) ? p.toppings.filter(t=>t!==n) : [...p.toppings, n] }));

  const finalize = () => {
    addToCart({ id: Date.now(), cat:'Personalizado', name:`Postre Personalizado`, price: totalPrice(), stock:99, sold:0, img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80', desc: `${sel.base} + ${sel.sabor} + ${sel.toppings.join(', ')} + ${sel.salsa} + ${sel.fruta}` });
    setSel({ base:'', sabor:'', toppings:[], salsa:'', fruta:'' }); setStep(0);
    confetti({ particleCount:80, spread:60 });
  };

  const renderOptions = (list, field, multi=false) => (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
      {list.map(item => {
        const active = multi ? sel.toppings.includes(item.n) : sel[field] === item.n;
        return (
          <motion.button key={item.n} whileHover={{ scale:1.05 }} whileTap={{ scale:0.95 }}
            onClick={() => multi ? toggleTopping(item.n) : setSel(p=>({...p,[field]:item.n}))}
            style={{ padding:'12px 22px', borderRadius:'14px', border: active ? '2px solid #00695c' : '2px solid #e0e0e0',
              background: active ? 'rgba(0,105,92,0.1)' : '#fff', fontWeight:600, fontSize:'0.9rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
            <span>{item.n}</span>
            <span style={{ fontSize:'0.75rem', color:'#e91e63' }}>+₡{item.p}</span>
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>🍧 Arma tu Postre</motion.h1>
      <div style={{ display:'flex', gap:'8px', marginBottom:'25px' }}>
        {steps.map((s,i) => (
          <div key={s} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700,
              background: i <= step ? '#00695c' : '#e0e0e0', color: i <= step ? '#fff' : '#999' }}>{i+1}</div>
            <span style={{ fontSize:'0.85rem', fontWeight: i === step ? 700 : 400, color: i === step ? '#00695c' : '#999' }}>{s}</span>
            {i < steps.length-1 && <ChevronRight size={14} color="#ccc" />}
          </div>
        ))}
      </div>
      <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'20px', padding:'25px', marginBottom:'20px' }}>
        {step===0 && renderOptions(bases, 'base')}
        {step===1 && renderOptions(sabores, 'sabor')}
        {step===2 && <>{renderOptions(toppings, '', true)}<p style={{fontSize:'0.8rem',color:'#888',marginTop:'8px'}}>Selecciona uno o más toppings</p></>}
        {step===3 && renderOptions(salsas, 'salsa')}
        {step===4 && renderOptions(frutas, 'fruta')}
      </motion.div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ display:'flex', gap:'10px' }}>
          {step > 0 && <button className="btn-secondary" onClick={() => setStep(s=>s-1)}>← Anterior</button>}
          {step < 4 && <button className="btn-primary" onClick={() => setStep(s=>s+1)}>Siguiente →</button>}
          {step === 4 && <button className="btn-primary" onClick={finalize} style={{ background:'linear-gradient(135deg,#ff9800,#f44336)' }}>🎉 Agregar al Carrito</button>}
        </div>
        <div className="glass-panel" style={{ padding:'12px 24px', borderRadius:'14px' }}>
          <span style={{ color:'#888', fontSize:'0.85rem' }}>Total estimado: </span>
          <span style={{ color:'#e91e63', fontWeight:700, fontSize:'1.3rem' }}>₡{totalPrice()}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: CARRITO Y CHECKOUT
// ============================================================================
function CarritoCheckout() {
  const { cart, removeFromCart, updateCartQty, placeOrder, configNegocio } = useContext(SugarContext);
  const [clientName, setClientName] = useState('');
  const [metodo, setMetodo] = useState('SINPE Móvil');
  const [entrega, setEntrega] = useState('Retiro en Local');
  const [direccion, setDireccion] = useState('');
  const [factura, setFactura] = useState(null);

  const subtotal = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const iva = Math.round(subtotal * configNegocio.iva / 100);
  const envio = entrega === 'Express' ? configNegocio.envio : 0;
  const total = subtotal + iva + envio;

  const handleOrder = () => {
    if (!clientName || cart.length === 0) return;
    const order = placeOrder({ clientName, metodo, entrega, direccion, subtotal, iva, envioFee: envio, total });
    setFactura(order);
    confetti({ particleCount:150, spread:80, origin:{ y:0.6 } });
  };

  const printFactura = () => { window.print(); };

  if (factura) {
    return (
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} style={{ padding:'20px', maxWidth:'600px' }}>
        <div className="glass-panel" style={{ borderRadius:'20px', padding:'30px', borderTop:'4px solid #00695c' }}>
          <div style={{ textAlign:'center', marginBottom:'20px' }}>
            <CheckCircle size={48} color="#4caf50" />
            <h2 style={{ color:'#00695c', margin:'10px 0 5px' }}>¡Pedido Confirmado!</h2>
            <p style={{ color:'#888', fontSize:'0.9rem' }}>Tu factura ha sido generada</p>
          </div>
          <div style={{ background:'#f9f9f9', borderRadius:'12px', padding:'20px', marginBottom:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
              <div><span style={{ color:'#888', fontSize:'0.8rem' }}>ID Pedido</span><p style={{ fontWeight:700, color:'#00695c' }}>{factura.id}</p></div>
              <div style={{ textAlign:'right' }}><span style={{ color:'#888', fontSize:'0.8rem' }}>Fecha</span><p style={{ fontWeight:600, fontSize:'0.9rem' }}>{factura.fecha}</p></div>
            </div>
            <div style={{ marginBottom:'10px' }}><span style={{ color:'#888', fontSize:'0.8rem' }}>Cliente</span><p style={{ fontWeight:600 }}>{factura.clientName}</p></div>
            <hr style={{ border:'none', borderTop:'1px dashed #ddd', margin:'12px 0' }} />
            {factura.items.map((item,i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', marginBottom:'6px', fontSize:'0.9rem' }}>
                <span>{item.name} x{item.qty}</span>
                <span style={{ fontWeight:600 }}>₡{(item.price*item.qty).toLocaleString()}</span>
              </div>
            ))}
            <hr style={{ border:'none', borderTop:'1px dashed #ddd', margin:'12px 0' }} />
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#888' }}><span>Subtotal</span><span>₡{factura.subtotal?.toLocaleString()}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#888' }}><span>IVA ({configNegocio.iva}%)</span><span>₡{factura.iva?.toLocaleString()}</span></div>
            {factura.envioFee > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#888' }}><span>Envío</span><span>₡{factura.envioFee?.toLocaleString()}</span></div>}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', color:'#888', marginBottom:'8px' }}><span>Método de Pago</span><span>{factura.metodo}</span></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:700, color:'#e91e63', marginTop:'8px' }}>
              <span>TOTAL</span><span>₡{factura.total?.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button className="btn-secondary" onClick={printFactura} style={{ flex:1 }}>🖨️ Imprimir Factura</button>
            <button className="btn-primary" onClick={() => setFactura(null)} style={{ flex:1 }}>Nuevo Pedido</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>🛒 Hacer Pedido</motion.h1>
      <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
        <motion.div variants={fadeIn} style={{ flex:'1 1 400px' }}>
          <div className="glass-panel" style={{ borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
            <h3 style={{ margin:'0 0 15px', color:'#00695c' }}>Carrito ({cart.length} items)</h3>
            {cart.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'30px' }}>Tu carrito está vacío. Agrega productos desde el catálogo.</p> :
              cart.map(item => (
                <div key={item.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px', borderBottom:'1px solid #f0f0f0' }}>
                  <img src={item.img} alt={item.name} style={{ width:'50px', height:'50px', borderRadius:'8px', objectFit:'cover' }} />
                  <div style={{ flexGrow:1 }}>
                    <h4 style={{ margin:0, fontSize:'0.9rem' }}>{item.name}</h4>
                    <span style={{ color:'#e91e63', fontWeight:600, fontSize:'0.85rem' }}>₡{item.price}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <button onClick={() => updateCartQty(item.id, -1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #ddd', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Minus size={14} /></button>
                    <span style={{ fontWeight:700, minWidth:'20px', textAlign:'center' }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, 1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #ddd', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={14} /></button>
                  </div>
                  <span style={{ fontWeight:700, color:'#333', minWidth:'70px', textAlign:'right' }}>₡{(item.price*item.qty).toLocaleString()}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ background:'none', border:'none', color:'#f44336' }}><Trash2 size={16} /></button>
                </div>
              ))
            }
          </div>
        </motion.div>

        <motion.div variants={fadeIn} style={{ flex:'1 1 320px', maxWidth:'400px' }}>
          <div className="glass-panel" style={{ borderRadius:'16px', padding:'20px' }}>
            <h3 style={{ margin:'0 0 15px', color:'#00695c' }}>Checkout</h3>
            <label style={{ fontSize:'0.85rem', fontWeight:600, color:'#555' }}>Nombre del Cliente</label>
            <input className="input-field" value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Tu nombre..." style={{ marginBottom:'12px', marginTop:'4px' }} />

            <label style={{ fontSize:'0.85rem', fontWeight:600, color:'#555' }}>Tipo de Entrega</label>
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px', marginTop:'4px' }}>
              {['Retiro en Local','Express'].map(t => (
                <button key={t} onClick={() => setEntrega(t)} style={{ flex:1, padding:'10px', borderRadius:'10px', border: entrega===t ? '2px solid #00695c' : '2px solid #e0e0e0',
                  background: entrega===t ? 'rgba(0,105,92,0.1)' : '#fff', fontWeight:600, fontSize:'0.85rem' }}>
                  {t === 'Express' && <Truck size={14} style={{ marginRight:4 }} />}{t}
                </button>
              ))}
            </div>
            {entrega === 'Express' && <input className="input-field" value={direccion} onChange={e=>setDireccion(e.target.value)} placeholder="Dirección de entrega..." style={{ marginBottom:'12px' }} />}

            <label style={{ fontSize:'0.85rem', fontWeight:600, color:'#555' }}>Método de Pago</label>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px', margin:'6px 0 15px' }}>
              {['SINPE Móvil','Tarjeta','Efectivo'].map(m => (
                <button key={m} onClick={() => setMetodo(m)} style={{ padding:'12px 14px', borderRadius:'10px', border: metodo===m ? '2px solid #e91e63' : '2px solid #e0e0e0',
                  background: metodo===m ? 'rgba(233,30,99,0.06)' : '#fff', fontWeight:600, fontSize:'0.85rem', textAlign:'left', display:'flex', alignItems:'center', gap:'10px' }}>
                  {m==='SINPE Móvil' && <Smartphone size={16} color="#4caf50" />}
                  {m==='Tarjeta' && <CreditCard size={16} color="#2196f3" />}
                  {m==='Efectivo' && <DollarSign size={16} color="#ff9800" />}
                  {m}
                  {metodo===m && <Check size={16} color="#e91e63" style={{ marginLeft:'auto' }} />}
                </button>
              ))}
            </div>
            {metodo === 'SINPE Móvil' && (
              <div style={{ background:'#e8f5e9', borderRadius:'10px', padding:'12px', marginBottom:'12px', fontSize:'0.85rem' }}>
                <p style={{ fontWeight:700, color:'#2e7d32' }}>📱 SINPE Móvil</p>
                <p>Número: <b>8888-1234</b></p>
                <p style={{ color:'#555', fontSize:'0.8rem' }}>Envía el monto exacto y guarda el comprobante.</p>
              </div>
            )}

            <div style={{ background:'#f9f9f9', borderRadius:'10px', padding:'14px', marginBottom:'15px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'4px' }}><span>Subtotal</span><span>₡{subtotal.toLocaleString()}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'4px' }}><span>IVA ({configNegocio.iva}%)</span><span>₡{iva.toLocaleString()}</span></div>
              {envio > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'4px' }}><span>Envío Express</span><span>₡{envio.toLocaleString()}</span></div>}
              <hr style={{ border:'none', borderTop:'1px solid #e0e0e0', margin:'8px 0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'1.15rem', fontWeight:700, color:'#e91e63' }}><span>Total</span><span>₡{total.toLocaleString()}</span></div>
            </div>

            <button className="btn-primary" onClick={handleOrder} disabled={cart.length===0||!clientName}
              style={{ width:'100%', padding:'14px', fontSize:'1rem', opacity: cart.length===0||!clientName ? 0.5 : 1 }}>
              Confirmar Pedido 🎉
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: MIS PEDIDOS / SEGUIMIENTO
// ============================================================================
function MisPedidos() {
  const { orders } = useContext(SugarContext);
  const trackSteps = ['Pedido recibido','En preparación','En camino','Entregado'];
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>📦 Mis Pedidos</motion.h1>
      {orders.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'40px' }}>No tienes pedidos aún.</p> :
        orders.map(order => (
          <motion.div key={order.id} variants={fadeIn} className="glass-panel" style={{ borderRadius:'16px', padding:'20px', marginBottom:'15px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', flexWrap:'wrap', gap:'10px' }}>
              <div>
                <h3 style={{ margin:0, color:'#00695c' }}>{order.id}</h3>
                <span style={{ fontSize:'0.8rem', color:'#888' }}>{order.fecha}</span>
              </div>
              <span style={{ padding:'6px 16px', borderRadius:'20px', fontSize:'0.8rem', fontWeight:700,
                background: order.estado==='Entregado'?'#e8f5e9': order.estado==='En camino'?'#e3f2fd': order.estado==='En preparación'?'#fff3e0':'#fce4ec',
                color: order.estado==='Entregado'?'#2e7d32': order.estado==='En camino'?'#1565c0': order.estado==='En preparación'?'#e65100':'#c62828',
              }}>{order.estado}</span>
            </div>
            <div style={{ display:'flex', gap:'4px', alignItems:'center', marginBottom:'15px' }}>
              {trackSteps.map((ts,i) => {
                const done = order.tracking?.includes(ts);
                return (
                  <React.Fragment key={ts}>
                    <div style={{ width:'28px', height:'28px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
                      background: done ? '#4caf50' : '#e0e0e0', color: done ? '#fff' : '#999', fontSize:'0.7rem' }}>
                      {done ? <Check size={14} /> : i+1}
                    </div>
                    {i<trackSteps.length-1 && <div style={{ flexGrow:1, height:'3px', background: order.tracking?.includes(trackSteps[i+1]) ? '#4caf50' : '#e0e0e0', borderRadius:'2px' }} />}
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{ fontSize:'0.85rem' }}>
              {order.items?.map((it,i) => <span key={i} style={{ marginRight:'10px' }}>{it.name} x{it.qty}</span>)}
              <span style={{ float:'right', fontWeight:700, color:'#e91e63' }}>₡{order.total?.toLocaleString()}</span>
            </div>
          </motion.div>
        ))
      }
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: FAVORITOS
// ============================================================================
function FavoritosCliente() {
  const { productos, favs, toggleFav, addToCart } = useContext(SugarContext);
  const favProds = productos.filter(p => favs.includes(p.id));
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>❤️ Favoritos</motion.h1>
      {favProds.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'40px' }}>Aún no has marcado favoritos. Usa el ❤️ en el catálogo.</p> :
        <div style={{ display:'flex', gap:'15px', flexWrap:'wrap' }}>
          {favProds.map(p => (
            <motion.div key={p.id} variants={fadeIn} whileHover={{ y:-6 }} className="glass-panel" style={{ borderRadius:'16px', padding:'15px', flex:'1 1 220px', maxWidth:'260px' }}>
              <img src={p.img} alt={p.name} style={{ width:'100%', height:'130px', objectFit:'cover', borderRadius:'10px', marginBottom:'10px' }} />
              <h4 style={{ margin:'0 0 4px', color:'#00695c' }}>{p.name}</h4>
              <span style={{ color:'#e91e63', fontWeight:700 }}>₡{p.price}</span>
              <div style={{ display:'flex', gap:'8px', marginTop:'10px' }}>
                <button className="btn-secondary" onClick={() => addToCart(p)} style={{ flex:1, padding:'8px', fontSize:'0.8rem' }}><ShoppingCart size={14} /> Pedir</button>
                <button onClick={() => toggleFav(p.id)} style={{ padding:'8px 12px', background:'#fce4ec', border:'none', borderRadius:'8px' }}><Heart size={14} fill="#e91e63" color="#e91e63" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      }
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: PUNTOS
// ============================================================================
function ProgramaPuntos() {
  const { puntos, nivel } = useContext(SugarContext);
  const niveles = [{ n:'Bronce', min:0, color:'#cd7f32' },{ n:'Plata', min:200, color:'#9e9e9e' },{ n:'Oro', min:500, color:'#ffc107' }];
  const currentNivel = niveles.find(n => n.n === nivel) || niveles[0];
  const nextNivel = niveles[niveles.indexOf(currentNivel)+1];
  const recompensas = [
    { pts:100, reward:'Postre gratis', icon:'🍦' },{ pts:250, reward:'Combo Premium', icon:'🎁' },
    { pts:500, reward:'Envío gratis x5', icon:'🚚' },{ pts:1000, reward:'Fiesta VIP', icon:'🎉' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>🎯 Programa de Puntos</motion.h1>
      <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'20px', padding:'30px', marginBottom:'20px', textAlign:'center' }}>
        <Award size={48} color={currentNivel.color} />
        <h2 style={{ color: currentNivel.color, margin:'10px 0' }}>Nivel: {nivel}</h2>
        <p style={{ fontSize:'2.5rem', fontWeight:700, color:'#00695c', margin:'5px 0' }}>{puntos} pts</p>
        {nextNivel && <ProgressBar value={puntos} max={nextNivel.min} color={currentNivel.color} label={`${puntos}/${nextNivel.min} para ${nextNivel.n}`} />}
        <p style={{ color:'#888', fontSize:'0.85rem' }}>Ganas 1 punto por cada ₡100 en compras</p>
      </motion.div>
      <h3 style={{ color:'#00695c', marginBottom:'12px' }}>Recompensas Canjeables</h3>
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
        {recompensas.map(r => (
          <motion.div key={r.pts} variants={fadeIn} className="glass-panel" style={{ borderRadius:'14px', padding:'20px', flex:'1 1 180px', textAlign:'center', opacity: puntos >= r.pts ? 1 : 0.5 }}>
            <span style={{ fontSize:'2rem' }}>{r.icon}</span>
            <h4 style={{ margin:'8px 0 4px' }}>{r.reward}</h4>
            <span style={{ fontSize:'0.85rem', color:'#e91e63', fontWeight:600 }}>{r.pts} pts</span>
            {puntos >= r.pts && <div><button className="btn-primary" style={{ marginTop:'8px', padding:'6px 16px', fontSize:'0.8rem' }}>Canjear</button></div>}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: RESEÑAS
// ============================================================================
function ResenasCliente() {
  const { productos, ratings, rateProduct, comments, addComment } = useContext(SugarContext);
  const [selProd, setSelProd] = useState(productos[0]?.id);
  const [newComment, setNewComment] = useState('');
  const prod = productos.find(p => p.id === selProd);
  const myR = ratings[selProd] || 0;
  const myC = comments[selProd] || [];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>⭐ Reseñas</motion.h1>
      <motion.div variants={fadeIn} style={{ marginBottom:'15px' }}>
        <select className="input-field" value={selProd} onChange={e => setSelProd(Number(e.target.value))} style={{ maxWidth:'300px' }}>
          {productos.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </motion.div>
      {prod && (
        <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'16px', padding:'25px' }}>
          <div style={{ display:'flex', gap:'20px', alignItems:'center', marginBottom:'20px', flexWrap:'wrap' }}>
            <img src={prod.img} alt={prod.name} style={{ width:'100px', height:'100px', borderRadius:'12px', objectFit:'cover' }} />
            <div>
              <h2 style={{ margin:0, color:'#00695c' }}>{prod.name}</h2>
              <p style={{ color:'#888', fontSize:'0.9rem' }}>{prod.desc}</p>
              <div style={{ display:'flex', gap:'3px', marginTop:'8px' }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={24} fill={s<=myR?'#ffc107':'none'} color="#ffc107" onClick={() => rateProduct(selProd, s)} />)}
                <span style={{ marginLeft:'8px', fontWeight:700, color:'#ffc107' }}>{myR}/5</span>
              </div>
            </div>
          </div>
          <div style={{ display:'flex', gap:'8px', marginBottom:'15px' }}>
            <input className="input-field" value={newComment} onChange={e=>setNewComment(e.target.value)} placeholder="Escribe tu reseña..." />
            <button className="btn-secondary" onClick={() => { if(newComment){ addComment(selProd, newComment); setNewComment(''); } }}>Publicar</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {myC.map((c,i) => (
              <div key={i} style={{ background:'rgba(0,0,0,0.03)', padding:'12px', borderRadius:'10px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'4px' }}>
                  <span style={{ fontWeight:700, fontSize:'0.85rem' }}>{c.user}</span>
                  <span style={{ fontSize:'0.75rem', color:'#999' }}>{c.date}</span>
                </div>
                <p style={{ fontSize:'0.9rem', margin:0 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: CONTACTO
// ============================================================================
function ContactoCliente() {
  const { setReportes, setMensajes, configNegocio } = useContext(SugarContext);
  const [tipo, setTipo] = useState('Contacto');
  const [texto, setTexto] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (tipo === 'Reporte') setReportes(p => [...p, { id:Date.now(), fecha:new Date().toLocaleDateString(), detalles:texto, estado:'Pendiente' }]);
    else setMensajes(p => [...p, { id:Date.now(), fecha:new Date().toLocaleDateString(), texto, leido:false }]);
    setSent(true); setTexto('');
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#00695c', fontSize:'2rem', marginBottom:'20px' }}>📱 Contacto</motion.h1>
      <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
        <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'16px', padding:'25px', flex:'1 1 350px' }}>
          <h3 style={{ color:'#00695c', marginBottom:'15px' }}>Información</h3>
          {[
            { icon:MapPin, text: configNegocio.direccion },
            { icon:Clock, text: configNegocio.horario },
            { icon:Phone, text: configNegocio.telefono },
            { icon:Smartphone, text:`SINPE: ${configNegocio.sinpe}` },
          ].map((item,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(0,105,92,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <item.icon size={18} color="#00695c" />
              </div>
              <span style={{ fontSize:'0.9rem' }}>{item.text}</span>
            </div>
          ))}
          <div style={{ marginTop:'15px', background:'rgba(0,105,92,0.05)', borderRadius:'12px', height:'180px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MapPin size={32} color="#00695c" /><span style={{ marginLeft:'10px', color:'#00695c', fontWeight:600 }}>San José, Costa Rica</span>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'16px', padding:'25px', flex:'1 1 350px' }}>
          <h3 style={{ color:'#00695c', marginBottom:'15px' }}>Enviar Mensaje</h3>
          {sent ? (
            <div style={{ textAlign:'center', padding:'30px' }}>
              <CheckCircle size={40} color="#4caf50" />
              <h4 style={{ margin:'10px 0' }}>¡Mensaje enviado!</h4>
              <button className="btn-secondary" onClick={() => setSent(false)}>Enviar otro</button>
            </div>
          ) : (
            <form onSubmit={handleSend} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              <select className="input-field" value={tipo} onChange={e=>setTipo(e.target.value)}>
                <option value="Contacto">Mensaje de Contacto</option>
                <option value="Reporte">Reportar un Error</option>
              </select>
              <textarea className="input-field" rows="4" value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Escribe aquí tu mensaje..." required />
              <button type="submit" className={tipo==='Reporte'?'btn-primary':'btn-secondary'} style={{ width:'100%' }}>
                {tipo==='Reporte'?'⚠️ Enviar Reporte':'📩 Enviar Mensaje'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// CLIENTE: DONACIONES
// ============================================================================
function DonacionesCliente() {
  const { setDonaciones } = useContext(SugarContext);
  const [monto, setMonto] = useState('');
  const [nombre, setNombre] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setDonaciones(p => [...p, { id:Date.now(), nombre:nombre||'Anónimo', monto:Number(monto), fecha:new Date().toLocaleDateString() }]);
    setSent(true);
    confetti({ particleCount:120, colors:['#ffeb3b','#fbc02d','#fff59d'] });
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#ff8f00', fontSize:'2rem', marginBottom:'20px' }}>🤝 Donaciones</motion.h1>
      <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'20px', padding:'30px', maxWidth:'500px', borderTop:'4px solid #ffb300' }}>
        <p style={{ color:'#555', marginBottom:'20px' }}>Tu apoyo nos ayuda a crecer. ¡Gracias por creer en Sugar Mood!</p>
        {sent ? (
          <div style={{ textAlign:'center', padding:'20px' }}>
            <h3 style={{ color:'#ff8f00' }}>🧡 ¡Gracias por tu apoyo!</h3>
            <button className="btn-primary" onClick={() => { setSent(false); setMonto(''); setNombre(''); }} style={{ marginTop:'15px', background:'#ff8f00' }}>Hacer otra donación</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <input className="input-field" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre (opcional)" />
            <input className="input-field" type="number" min="1" value={monto} onChange={e=>setMonto(e.target.value)} placeholder="Monto (₡)" required />
            <button type="submit" className="btn-primary" style={{ background:'linear-gradient(135deg,#ff8f00,#ffb300)' }}>💛 Donar</button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: DASHBOARD
// ============================================================================
function AdminDashboard() {
  const { productos, orders, donaciones, reportes, gastos } = useContext(SugarContext);
  const totalVentas = orders.reduce((s,o) => s + (o.total||0), 0);
  const totalDonaciones = donaciones.reduce((s,d) => s + d.monto, 0);
  const stockCritico = productos.filter(p => p.stock < 5).length;
  const pendientes = orders.filter(o => o.estado === 'Pendiente').length;
  const masVendido = [...productos].sort((a,b) => b.sold - a.sold)[0];
  const totalGastos = gastos.reduce((s,g) => s + g.monto, 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>⚡ Dashboard</motion.h1>
      <motion.div variants={stagger} style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <KPICard icon={DollarSign} label="Ventas Totales" value={totalVentas} color="#4caf50" prefix="₡" />
        <KPICard icon={ShoppingCart} label="Pedidos" value={orders.length} color="#2196f3" />
        <KPICard icon={TrendingUp} label="Ganancia Neta" value={totalVentas - totalGastos} color="#00695c" prefix="₡" />
        <KPICard icon={Gift} label="Donaciones" value={totalDonaciones} color="#ff9800" prefix="₡" />
      </motion.div>
      <motion.div variants={stagger} style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <KPICard icon={AlertTriangle} label="Stock Crítico" value={stockCritico} color="#f44336" />
        <KPICard icon={Clock} label="Pendientes" value={pendientes} color="#ff5722" />
        <KPICard icon={Award} label="Más Vendido" value={masVendido?.name||'N/A'} color="#9c27b0" />
        <KPICard icon={Package} label="Productos" value={productos.length} color="#607d8b" />
      </motion.div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ marginBottom:'15px' }}>Top 8 Productos por Ventas</h3>
        {[...productos].sort((a,b)=>b.sold-a.sold).slice(0,8).map(p => (
          <ProgressBar key={p.id} label={p.name} value={p.sold} max={50} color={p.stock<5?'#f44336':'#4caf50'} />
        ))}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: REPORTES
// ============================================================================
function AdminReportes() {
  const { orders, productos, gastos } = useContext(SugarContext);
  const totalVentas = orders.reduce((s,o) => s + (o.total||0), 0);
  const totalGastos = gastos.reduce((s,g) => s + g.monto, 0);
  const margen = totalVentas - totalGastos;
  const sinpe = orders.filter(o => o.metodo === 'SINPE Móvil').length;
  const tarjeta = orders.filter(o => o.metodo === 'Tarjeta').length;
  const efectivo = orders.filter(o => o.metodo === 'Efectivo').length;
  const totalOrd = orders.length || 1;

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>📊 Reportes</motion.h1>
      <div style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <motion.div variants={fadeIn} className="kpi-card" style={{ flex:'1 1 250px', borderLeft:'4px solid #4caf50' }}>
          <h3 style={{ color:'#555', fontSize:'0.9rem' }}>Ingresos</h3><p style={{ fontSize:'1.8rem', fontWeight:700, color:'#4caf50' }}>₡{totalVentas.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={fadeIn} className="kpi-card" style={{ flex:'1 1 250px', borderLeft:'4px solid #f44336' }}>
          <h3 style={{ color:'#555', fontSize:'0.9rem' }}>Gastos</h3><p style={{ fontSize:'1.8rem', fontWeight:700, color:'#f44336' }}>₡{totalGastos.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={fadeIn} className="kpi-card" style={{ flex:'1 1 250px', borderLeft:'4px solid #00695c' }}>
          <h3 style={{ color:'#555', fontSize:'0.9rem' }}>Margen Bruto</h3><p style={{ fontSize:'1.8rem', fontWeight:700, color: margen>=0?'#00695c':'#f44336' }}>₡{margen.toLocaleString()}</p>
        </motion.div>
      </div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', marginBottom:'20px' }}>
        <h3 style={{ marginBottom:'15px' }}>Métodos de Pago</h3>
        <ProgressBar label={`SINPE Móvil (${sinpe})`} value={sinpe} max={totalOrd} color="#4caf50" />
        <ProgressBar label={`Tarjeta (${tarjeta})`} value={tarjeta} max={totalOrd} color="#2196f3" />
        <ProgressBar label={`Efectivo (${efectivo})`} value={efectivo} max={totalOrd} color="#ff9800" />
      </motion.div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ marginBottom:'15px' }}>Categorías por Margen</h3>
        {[...new Set(productos.map(p=>p.cat))].map(cat => {
          const catProds = productos.filter(p=>p.cat===cat);
          const catSold = catProds.reduce((s,p)=>s+p.sold,0);
          return <ProgressBar key={cat} label={cat} value={catSold} max={100} color="#00695c" />;
        })}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: INVENTARIO
// ============================================================================
function AdminInventario() {
  const { productos, updateStock, addProduct } = useContext(SugarContext);
  const [showAdd, setShowAdd] = useState(false);
  const [np, setNp] = useState({ name:'', cat:'Premium', price:700, stock:10, desc:'Nuevo producto', img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80' });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px' }}>
        <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', margin:0 }}>📦 Inventario</motion.h1>
        <button className="btn-primary" onClick={() => setShowAdd(!showAdd)}><Plus size={16} /> Agregar Producto</button>
      </div>
      {showAdd && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} className="glass-panel" style={{ borderRadius:'14px', padding:'20px', marginBottom:'20px' }}>
          <h3 style={{ margin:'0 0 12px' }}>Nuevo Producto</h3>
          <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
            <input className="input-field" placeholder="Nombre" value={np.name} onChange={e=>setNp(p=>({...p,name:e.target.value}))} style={{ flex:'1 1 200px' }} />
            <select className="input-field" value={np.cat} onChange={e=>setNp(p=>({...p,cat:e.target.value}))} style={{ flex:'1 1 150px' }}>
              {['Premium','Tradicionales','Frescas','Tajín y Chamoy','Postres Especiales'].map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <input className="input-field" type="number" placeholder="Precio" value={np.price} onChange={e=>setNp(p=>({...p,price:Number(e.target.value)}))} style={{ flex:'1 1 100px' }} />
            <input className="input-field" type="number" placeholder="Stock" value={np.stock} onChange={e=>setNp(p=>({...p,stock:Number(e.target.value)}))} style={{ flex:'1 1 100px' }} />
            <button className="btn-secondary" onClick={() => { if(np.name){ addProduct(np); setNp({name:'',cat:'Premium',price:700,stock:10,desc:'',img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80'}); setShowAdd(false); } }}>Guardar</button>
          </div>
        </motion.div>
      )}
      <div style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'2px solid #eee' }}>
              {['Categoría','Producto','Precio','Stock','Estado','Acciones'].map(h=><th key={h} style={{ padding:'10px 12px', color:'#888', fontWeight:600, fontSize:'0.85rem', textAlign:'left' }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} style={{ borderBottom:'1px solid #f5f5f5' }}>
                <td style={{ padding:'10px 12px', fontSize:'0.85rem' }}>{p.cat}</td>
                <td style={{ padding:'10px 12px', fontWeight:600 }}>{p.name}</td>
                <td style={{ padding:'10px 12px', color:'#e91e63', fontWeight:600 }}>₡{p.price}</td>
                <td style={{ padding:'10px 12px', fontWeight:700 }}>{p.stock}</td>
                <td style={{ padding:'10px 12px' }}>
                  <span style={{ padding:'3px 10px', borderRadius:'12px', fontSize:'0.75rem', fontWeight:700,
                    background: p.stock === 0 ? '#ffebee' : p.stock < 5 ? '#fff3e0' : '#e8f5e9',
                    color: p.stock === 0 ? '#c62828' : p.stock < 5 ? '#e65100' : '#2e7d32' }}>
                    {p.stock === 0 ? 'Agotado' : p.stock < 5 ? 'Bajo' : 'Disponible'}
                  </span>
                </td>
                <td style={{ padding:'10px 12px' }}>
                  <div style={{ display:'flex', gap:'4px' }}>
                    <button onClick={() => updateStock(p.id,-1)} style={{ width:'30px', height:'30px', borderRadius:'6px', border:'1px solid #e0e0e0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Minus size={14} /></button>
                    <button onClick={() => updateStock(p.id,1)} style={{ width:'30px', height:'30px', borderRadius:'6px', border:'none', background:'#1a1a2e', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: FINANZAS
// ============================================================================
function AdminFinanzas() {
  const { orders, gastos, setGastos } = useContext(SugarContext);
  const [newGasto, setNewGasto] = useState({ concepto:'', monto:'' });
  const totalIngresos = orders.reduce((s,o) => s+(o.total||0), 0);
  const totalGastos = gastos.reduce((s,g) => s+g.monto, 0);
  const ganancia = totalIngresos - totalGastos;

  const addGasto = () => {
    if (newGasto.concepto && newGasto.monto) {
      setGastos(p => [...p, { id:Date.now(), ...newGasto, monto:Number(newGasto.monto), fecha:new Date().toLocaleDateString() }]);
      setNewGasto({ concepto:'', monto:'' });
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>💵 Finanzas</motion.h1>
      <div style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <KPICard icon={TrendingUp} label="Ingresos" value={totalIngresos} color="#4caf50" prefix="₡" />
        <KPICard icon={Minus} label="Gastos" value={totalGastos} color="#f44336" prefix="₡" />
        <KPICard icon={DollarSign} label="Ganancia Real" value={ganancia} color={ganancia>=0?'#00695c':'#f44336'} prefix="₡" />
      </div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', marginBottom:'20px' }}>
        <h3 style={{ marginBottom:'12px' }}>Registrar Gasto</h3>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <input className="input-field" placeholder="Concepto" value={newGasto.concepto} onChange={e=>setNewGasto(p=>({...p,concepto:e.target.value}))} style={{ flex:'1 1 200px' }} />
          <input className="input-field" type="number" placeholder="Monto (₡)" value={newGasto.monto} onChange={e=>setNewGasto(p=>({...p,monto:e.target.value}))} style={{ flex:'1 1 120px' }} />
          <button className="btn-primary" onClick={addGasto}>Agregar</button>
        </div>
      </motion.div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ marginBottom:'12px' }}>Historial de Gastos</h3>
        {gastos.map(g => (
          <div key={g.id} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f5f5f5', fontSize:'0.9rem' }}>
            <span>{g.concepto}</span>
            <div><span style={{ color:'#888', marginRight:'15px' }}>{g.fecha}</span><span style={{ fontWeight:700, color:'#f44336' }}>-₡{g.monto.toLocaleString()}</span></div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: PEDIDOS
// ============================================================================
function AdminPedidos() {
  const { orders, updateOrderStatus } = useContext(SugarContext);
  const estados = ['Pendiente','En preparación','En camino','Entregado'];
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>🛒 Bandeja de Pedidos</motion.h1>
      {orders.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'40px' }}>No hay pedidos registrados.</p> :
        orders.map(order => (
          <motion.div key={order.id} variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', marginBottom:'12px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'10px', marginBottom:'10px' }}>
              <div>
                <h3 style={{ margin:0 }}>{order.id}</h3>
                <span style={{ fontSize:'0.8rem', color:'#888' }}>{order.fecha} · {order.clientName} · {order.metodo}</span>
              </div>
              <select value={order.estado} onChange={e=>updateOrderStatus(order.id,e.target.value)}
                style={{ padding:'8px 14px', borderRadius:'8px', border:'1.5px solid #e0e0e0', fontWeight:600, fontSize:'0.85rem', background:'#fff' }}>
                {estados.map(e=><option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div style={{ fontSize:'0.85rem' }}>
              {order.items?.map((it,i) => <span key={i} style={{ marginRight:'12px', background:'#f5f5f5', padding:'3px 10px', borderRadius:'12px', display:'inline-block', marginBottom:'4px' }}>{it.name} x{it.qty}</span>)}
              <span style={{ float:'right', fontWeight:700, color:'#e91e63', fontSize:'1.1rem' }}>₡{order.total?.toLocaleString()}</span>
            </div>
          </motion.div>
        ))
      }
    </motion.div>
  );
}

// ============================================================================
// ADMIN: CLIENTES
// ============================================================================
function AdminClientes() {
  const { clientes } = useContext(SugarContext);
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>👥 Clientes</motion.h1>
      <div style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', overflowX:'auto' }}>
        {clientes.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'30px' }}>Los clientes aparecerán cuando realicen pedidos.</p> :
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #eee' }}>
                {['Nombre','Pedidos','Total Gastado','Producto Favorito'].map(h=><th key={h} style={{ padding:'10px', textAlign:'left', color:'#888', fontSize:'0.85rem' }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id} style={{ borderBottom:'1px solid #f5f5f5' }}>
                  <td style={{ padding:'10px', fontWeight:600 }}>{c.nombre}</td>
                  <td style={{ padding:'10px' }}>{c.pedidos}</td>
                  <td style={{ padding:'10px', color:'#4caf50', fontWeight:600 }}>₡{c.totalGastado?.toLocaleString()}</td>
                  <td style={{ padding:'10px' }}>{c.favorito}</td>
                </tr>
              ))}
            </tbody>
          </table>
        }
      </div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: DONACIONES
// ============================================================================
function AdminDonaciones() {
  const { donaciones } = useContext(SugarContext);
  const total = donaciones.reduce((s,d)=>s+d.monto, 0);
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>🤝 Donaciones</motion.h1>
      <motion.div variants={fadeIn} className="kpi-card" style={{ borderLeft:'4px solid #ff9800', marginBottom:'20px', maxWidth:'300px' }}>
        <span style={{ color:'#888', fontSize:'0.85rem' }}>Total Recaudado</span>
        <p style={{ fontSize:'2rem', fontWeight:700, color:'#ff9800', margin:'8px 0 0' }}>₡{total.toLocaleString()}</p>
      </motion.div>
      <div style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
        {donaciones.length === 0 ? <p style={{ color:'#999', textAlign:'center' }}>No hay donaciones registradas.</p> :
          donaciones.map(d => (
            <div key={d.id} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f5f5f5', alignItems:'center' }}>
              <div><p style={{ fontWeight:600, margin:0 }}>{d.nombre}</p><span style={{ fontSize:'0.8rem', color:'#888' }}>{d.fecha}</span></div>
              <span style={{ fontWeight:700, color:'#4caf50', fontSize:'1.1rem' }}>₡{d.monto.toLocaleString()}</span>
            </div>
          ))
        }
      </div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: EVENTOS
// ============================================================================
function AdminEventos() {
  const { eventos, setEventos } = useContext(SugarContext);
  const [ne, setNe] = useState({ titulo:'', fecha:'', paquete:'', total:'' });

  const addEvento = () => {
    if (ne.titulo && ne.fecha) {
      setEventos(p => [...p, { id:Date.now(), ...ne, total:Number(ne.total)||0, estado:'Pendiente' }]);
      setNe({ titulo:'', fecha:'', paquete:'', total:'' });
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>🎉 Eventos</motion.h1>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', marginBottom:'20px' }}>
        <h3 style={{ margin:'0 0 12px' }}>Nuevo Evento</h3>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <input className="input-field" placeholder="Título del evento" value={ne.titulo} onChange={e=>setNe(p=>({...p,titulo:e.target.value}))} style={{ flex:'1 1 200px' }} />
          <input className="input-field" type="date" value={ne.fecha} onChange={e=>setNe(p=>({...p,fecha:e.target.value}))} style={{ flex:'1 1 150px' }} />
          <input className="input-field" placeholder="Paquete/detalle" value={ne.paquete} onChange={e=>setNe(p=>({...p,paquete:e.target.value}))} style={{ flex:'1 1 200px' }} />
          <input className="input-field" type="number" placeholder="Total (₡)" value={ne.total} onChange={e=>setNe(p=>({...p,total:e.target.value}))} style={{ flex:'1 1 120px' }} />
          <button className="btn-secondary" onClick={addEvento}>Crear</button>
        </div>
      </motion.div>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {eventos.map(ev => (
          <motion.div key={ev.id} variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'18px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'10px' }}>
            <div>
              <h4 style={{ margin:'0 0 4px' }}>{ev.titulo}</h4>
              <span style={{ fontSize:'0.8rem', color:'#888' }}>{ev.fecha} · {ev.paquete}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
              <span style={{ fontWeight:700, color:'#e91e63' }}>₡{ev.total?.toLocaleString()}</span>
              <span style={{ padding:'4px 12px', borderRadius:'12px', fontSize:'0.75rem', fontWeight:700,
                background: ev.estado==='Confirmado'?'#e8f5e9':'#fff3e0', color: ev.estado==='Confirmado'?'#2e7d32':'#e65100' }}>{ev.estado}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: CONFIGURACIÓN
// ============================================================================
function AdminConfig() {
  const { configNegocio, setConfigNegocio } = useContext(SugarContext);
  const [conf, setConf] = useState({ ...configNegocio });
  const [saved, setSaved] = useState(false);

  const save = () => { setConfigNegocio(conf); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>⚙️ Configuración</motion.h1>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'25px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', maxWidth:'600px' }}>
        {[
          { label:'Nombre del Negocio', key:'nombre' },
          { label:'Teléfono', key:'telefono' },
          { label:'SINPE Móvil', key:'sinpe' },
          { label:'Dirección', key:'direccion' },
          { label:'Horario', key:'horario' },
          { label:'IVA (%)', key:'iva', type:'number' },
          { label:'Costo de Envío (₡)', key:'envio', type:'number' },
          { label:'Pedido Mínimo (₡)', key:'pedidoMinimo', type:'number' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom:'12px' }}>
            <label style={{ fontSize:'0.85rem', fontWeight:600, color:'#555', display:'block', marginBottom:'4px' }}>{f.label}</label>
            <input className="input-field" type={f.type||'text'} value={conf[f.key]} onChange={e=>setConf(p=>({...p,[f.key]:f.type==='number'?Number(e.target.value):e.target.value}))} />
          </div>
        ))}
        <button className="btn-secondary" onClick={save} style={{ marginTop:'10px' }}>{saved ? '✅ Guardado' : 'Guardar Configuración'}</button>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: DIRECTORIO DISTRIBUIDORAS
// ============================================================================
function AdminDirectorio() {
  const tabs = [...new Set(DISTRIBUTORS.map(d => d.tab))];
  const [tab, setTab] = useState(tabs[0]);
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>📖 Directorio de Distribuidoras</motion.h1>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'15px' }}>
        {DISTRIBUTORS.filter(d => d.tab === tab).map(d => (
          <motion.div key={d.id} variants={fadeIn} whileHover={{ y:-4 }} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin:'0 0 8px', fontSize:'1.05rem' }}>{d.nombre}</h3>
            <p style={{ fontSize:'0.85rem', color:'#888', margin:'4px 0' }}>👤 {d.encargado}</p>
            <p style={{ fontSize:'0.85rem', color:'#00695c', fontWeight:700, margin:'4px 0' }}>📞 {d.contacto}</p>
            <p style={{ fontSize:'0.8rem', color:'#999', margin:'8px 0 0', fontStyle:'italic' }}>{d.nota}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ============================================================================
// ADMIN: BUZÓN
// ============================================================================
function AdminBuzon() {
  const { reportes, markReport, mensajes } = useContext(SugarContext);
  const [tab, setTab] = useState('Reportes');
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#1a1a2e', fontSize:'2rem', marginBottom:'20px' }}>📬 Buzón</motion.h1>
      <TabBar tabs={['Reportes','Mensajes']} active={tab} onChange={setTab} />
      {tab === 'Reportes' ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {reportes.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'30px' }}>Sin reportes.</p> :
            reportes.map(r => (
              <motion.div key={r.id} variants={fadeIn} style={{ background:'#fff', borderRadius:'12px', padding:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div>
                  <span style={{ fontSize:'0.8rem', color:'#888' }}>{r.fecha}</span>
                  <span style={{ marginLeft:'10px', padding:'3px 10px', borderRadius:'10px', fontSize:'0.75rem', fontWeight:700,
                    background: r.estado==='Pendiente'?'#ffebee':'#e8f5e9', color: r.estado==='Pendiente'?'#c62828':'#2e7d32' }}>{r.estado}</span>
                  <p style={{ margin:'5px 0 0', fontSize:'0.9rem' }}>{r.detalles}</p>
                </div>
                {r.estado === 'Pendiente' && <button className="btn-secondary" onClick={() => markReport(r.id)} style={{ padding:'6px 14px', fontSize:'0.8rem' }}>Resolver</button>}
              </motion.div>
            ))
          }
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {mensajes.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'30px' }}>Sin mensajes.</p> :
            mensajes.map(m => (
              <motion.div key={m.id} variants={fadeIn} style={{ background:'#fff', borderRadius:'12px', padding:'16px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
                <span style={{ fontSize:'0.8rem', color:'#888' }}>{m.fecha}</span>
                <p style={{ margin:'5px 0 0', fontSize:'0.9rem' }}>{m.texto}</p>
              </motion.div>
            ))
          }
        </div>
      )}
    </motion.div>
  );
}

// ============================================================================
// SIDEBAR
// ============================================================================
function Sidebar() {
  const { role, setRole, cart } = useContext(SugarContext);
  const location = useLocation();

  const clienteLinks = [
    { path:'/', label:'Inicio', icon:Home },
    { path:'/catalogo', label:'Catálogo', icon:IceCream },
    { path:'/promos', label:'Promociones', icon:Tag },
    { path:'/arma-postre', label:'Arma tu Postre', icon:Layers },
    { path:'/pedido', label:'Hacer Pedido', icon:ShoppingCart, badge:cart.length },
    { path:'/mis-pedidos', label:'Mis Pedidos', icon:Package },
    { path:'/favoritos', label:'Favoritos', icon:Heart },
    { path:'/puntos', label:'Puntos', icon:Target },
    { path:'/resenas', label:'Reseñas', icon:Star },
    { path:'/donar', label:'Donaciones', icon:Gift },
    { path:'/contacto', label:'Contacto', icon:Phone },
  ];

  const adminLinks = [
    { path:'/', label:'Dashboard', icon:Zap },
    { path:'/reportes-admin', label:'Reportes', icon:BarChart2 },
    { path:'/inventario', label:'Inventario', icon:Package },
    { path:'/finanzas', label:'Finanzas', icon:DollarSign },
    { path:'/pedidos-admin', label:'Pedidos', icon:ShoppingCart },
    { path:'/clientes', label:'Clientes', icon:Users },
    { path:'/donaciones-admin', label:'Donaciones', icon:Gift },
    { path:'/eventos', label:'Eventos', icon:Calendar },
    { path:'/directorio', label:'Directorio', icon:BookOpen },
    { path:'/buzon', label:'Buzón', icon:Inbox },
    { path:'/config', label:'Configuración', icon:Settings },
  ];

  const links = role === 'cliente' ? clienteLinks : adminLinks;
  const bg = role === 'cliente' ? 'linear-gradient(180deg,#00695c 0%,#004d40 100%)' : 'linear-gradient(180deg,#1a1a2e 0%,#16213e 100%)';
  const accent = role === 'cliente' ? '#ff4081' : '#60a5fa';
  const isHome = location.pathname === '/';

  if (isHome) return null;

  return (
    <div style={{ width:'260px', minWidth:'260px', height:'100vh', background:bg, color:'#fff', padding:'18px', display:'flex', flexDirection:'column', position:'sticky', top:0, overflowY:'auto' }}>
      <div style={{ textAlign:'center', marginBottom:'25px' }}>
        <IceCream size={40} color={accent} />
        <h2 style={{ margin:'8px 0 4px', fontSize:'1.2rem', color:'#fff' }}>SUGAR MOOD</h2>
        <span style={{ fontSize:'0.7rem', padding:'3px 10px', borderRadius:'12px', background:'rgba(255,255,255,0.15)', fontWeight:600 }}>
          {role === 'cliente' ? '🛍️ CLIENTE' : '🔧 ADMIN'}
        </span>
      </div>

      <div style={{ flexGrow:1, display:'flex', flexDirection:'column', gap:'4px' }}>
        {links.map(link => {
          const Icon = link.icon;
          const active = location.pathname === link.path;
          return (
            <Link key={link.path} to={link.path} style={{ textDecoration:'none' }}>
              <div style={{ padding:'10px 14px', borderRadius:'10px', display:'flex', alignItems:'center', gap:'10px',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? accent : 'rgba(255,255,255,0.75)', fontWeight: active ? 700 : 500, fontSize:'0.88rem',
                transition:'all 0.15s' }}>
                <Icon size={18} />
                <span>{link.label}</span>
                {link.badge > 0 && <span style={{ marginLeft:'auto', background:accent, color:'#fff', borderRadius:'10px', padding:'1px 8px', fontSize:'0.7rem', fontWeight:700 }}>{link.badge}</span>}
              </div>
            </Link>
          );
        })}
      </div>

      <div style={{ borderTop:'1px solid rgba(255,255,255,0.15)', paddingTop:'15px', marginTop:'10px' }}>
        <button onClick={() => setRole(role === 'cliente' ? 'admin' : 'cliente')}
          style={{ width:'100%', padding:'11px', background:accent, color:'#fff', border:'none', borderRadius:'10px', fontWeight:700, fontSize:'0.85rem', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
          <User size={16} /> {role === 'cliente' ? 'Ir a Admin' : 'Ir a Cliente'}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN CONTENT
// ============================================================================
function MainContent() {
  const { role } = useContext(SugarContext);
  return (
    <div style={{ flexGrow:1, overflowY:'auto', background: role === 'cliente' ? 'transparent' : '#f5f6fa', minHeight:'100vh' }}>
      <AnimatePresence mode="wait">
        {role === 'cliente' ? (
          <Routes>
            <Route path="/" element={<PaginaInicio />} />
            <Route path="/catalogo" element={<CatalogoCliente />} />
            <Route path="/promos" element={<PromocionesCliente />} />
            <Route path="/arma-postre" element={<ArmaPostre />} />
            <Route path="/pedido" element={<CarritoCheckout />} />
            <Route path="/mis-pedidos" element={<MisPedidos />} />
            <Route path="/favoritos" element={<FavoritosCliente />} />
            <Route path="/puntos" element={<ProgramaPuntos />} />
            <Route path="/resenas" element={<ResenasCliente />} />
            <Route path="/donar" element={<DonacionesCliente />} />
            <Route path="/contacto" element={<ContactoCliente />} />
            <Route path="*" element={<PaginaInicio />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/reportes-admin" element={<AdminReportes />} />
            <Route path="/inventario" element={<AdminInventario />} />
            <Route path="/finanzas" element={<AdminFinanzas />} />
            <Route path="/pedidos-admin" element={<AdminPedidos />} />
            <Route path="/clientes" element={<AdminClientes />} />
            <Route path="/donaciones-admin" element={<AdminDonaciones />} />
            <Route path="/eventos" element={<AdminEventos />} />
            <Route path="/directorio" element={<AdminDirectorio />} />
            <Route path="/buzon" element={<AdminBuzon />} />
            <Route path="/config" element={<AdminConfig />} />
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// APP
// ============================================================================
export default function App() {
  return (
    <SugarProvider>
      <BrowserRouter>
        <div style={{ display:'flex', minHeight:'100vh', width:'100%' }}>
          <Sidebar />
          <MainContent />
        </div>
      </BrowserRouter>
    </SugarProvider>
  );
}