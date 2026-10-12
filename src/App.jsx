import React, { useState, useContext, createContext, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ShoppingCart, Phone, AlertTriangle, IceCream, Star, CheckCircle,
  User, BarChart2, Package, Inbox, Heart, Gift, BookOpen,
  MapPin, Clock, ChevronRight, Plus, Minus, Trash2, CreditCard,
  Smartphone, DollarSign, TrendingUp, Users, Settings, Calendar, Award,
  Truck, Layers, Zap, Target, Check, Tag, Search, ArrowUpRight, ArrowRight, Menu, X, Sparkles, SlidersHorizontal
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useMockDatabase } from './hooks/useMockDatabase.js';
import { validateOrder, stockLimit } from './domain/shop.js';

// ============================================================================
// CONTEXT GLOBAL
// ============================================================================
const SugarContext = createContext();

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
  { id:2, title:'Combo Familiar 👨‍👩‍👧‍👦', desc:'4 paletas Premium + 2 Postres Especiales por ₡5,500.', badge:'COMBO', color:'#aa774b' },
  { id:3, title:'Postre de Temporada 🍓', desc:'Nuevo Cheesecake de Fresa por solo ₡900 esta semana.', badge:'NUEVO', color:'#a43d59' },
  { id:4, title:'Tajín Day 🌶️', desc:'15% de descuento en toda la línea Tajín y Chamoy. ¡Atrévete!', badge:'-15%', color:'#ac4655' },
];

function SugarProvider({ children }) {
  const database = useMockDatabase();
  const [role, setRole] = useState('cliente');
  const [productos, setProductos] = database.field('productos');
  const [cart, setCart] = database.field('cart');
  const [orders, setOrders] = database.field('orders');
  const [favs, setFavs] = database.field('favs');
  const [ratings, setRatings] = database.field('ratings');
  const [comments, setComments] = database.field('comments');
  const [reportes, setReportes] = database.field('reportes');
  const [mensajes, setMensajes] = database.field('mensajes');
  const [donaciones, setDonaciones] = database.field('donaciones');
  const [clientes, setClientes] = database.field('clientes');
  const [puntos, setPuntos] = database.field('puntos');
  const [nivel, setNivel] = database.field('nivel');
  const [eventos, setEventos] = database.field('eventos');
  const [configNegocio, setConfigNegocio] = database.field('configNegocio');
  const [gastos, setGastos] = database.field('gastos');

  const toggleFav = (id) => setFavs(p => p.includes(id) ? p.filter(f => f !== id) : [...p, id]);
  const rateProduct = (id, r) => setRatings(p => ({ ...p, [id]: r }));
  const addComment = (id, text) => { if (!text.trim()) return; setComments(p => ({ ...p, [id]: [...(p[id]||[]), { user:'Cliente', text: text.trim(), date: new Date().toLocaleDateString() }] })); };
  const updateStock = (id, delta) => setProductos(p => p.map(x => x.id === id ? { ...x, stock: Math.max(0, x.stock + delta) } : x));

  const addToCart = (prod) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === prod.id);
      if ((exists?.qty || 0) >= stockLimit(prod, productos)) return prev;
      if (exists) return prev.map(c => c.id === prod.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...prod, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCart(p => p.filter(c => c.id !== id));
  const updateCartQty = (id, delta) => setCart(p => p.map(c => c.id === id ? { ...c, qty: Math.max(1, Math.min(stockLimit(c, productos), c.qty + delta)) } : c));

  const placeOrder = (orderData) => {
    const error = validateOrder(cart, productos, configNegocio, orderData);
    if (error) throw new Error(error);
    const newOrder = {
      id: 'SM-' + Date.now().toString(36).toUpperCase(),
      items: [...cart],
      ...orderData,
      fecha: new Date().toLocaleString(),
      estado: 'Pendiente',
      tracking: ['Pedido recibido'],
    };
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const pts = Math.floor(total / 100);
    const np = puntos + pts;
    if (np >= 500) setNivel('Oro');
    else if (np >= 200) setNivel('Plata');
    else setNivel('Bronce');

    setOrders(prev => [newOrder, ...prev]);
    cart.forEach(item => {
      setProductos(prev => prev.map(p => p.id === item.id ? { ...p, stock: Math.max(0, p.stock - item.qty), sold: p.sold + item.qty } : p));
    });
    setPuntos(np);
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

  if (!database.data) return <main className="connection-panel"><h1>Sugar Mood</h1><p role={database.error ? 'alert' : 'status'}>{database.error || 'Cargando datos de JSON Server…'}</p>{database.error && <button className="btn-secondary" onClick={database.retry}>Reintentar conexión</button>}</main>;
  return (
    <SugarContext.Provider value={{
      role, setRole, productos, setProductos, cart, setCart, addToCart, removeFromCart,
      updateCartQty, orders, placeOrder, updateOrderStatus, favs, toggleFav,
      ratings, rateProduct, comments, addComment, reportes, setReportes,
      mensajes, setMensajes, donaciones, setDonaciones, clientes, puntos, nivel,
      updateStock, markReport, addProduct, eventos, setEventos, configNegocio,
      setConfigNegocio, gastos, setGastos,
    }}>
      <div className="sync-status" role={database.error ? 'alert' : 'status'}>{database.error || (database.saving ? 'Guardando cambios…' : 'Modo demostración · Cambios guardados')}{database.error && <button onClick={database.retry}>Reintentar guardado</button>}</div>
      <div inert={database.error ? true : undefined}>{children}</div>
    </SugarContext.Provider>
  );
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================
const fadeIn = { hidden:{opacity:0,y:20}, visible:{opacity:1,y:0} };
const stagger = { visible:{ transition:{ staggerChildren: 0.08 } } };

function TabBar({ tabs, active, onChange }) {
  return <div className="category-tabs" aria-label="Categorías">{tabs.map(t => <button key={t} aria-pressed={active === t} className={active === t ? 'active' : ''} onClick={() => onChange(t)}>{t}</button>)}</div>;
}

function ProductImage({ src, alt, ...props }) {
  return <img src={src} alt={alt} loading="lazy" {...props} onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/product-fallback.svg'; }} />;
}

function RatingStars({ value, onChange, name }) {
  return <div className="rating-stars" aria-label={name}>{[1,2,3,4,5].map(star => <button key={star} aria-label={star + ' de 5 estrellas para ' + name} aria-pressed={value === star} onClick={() => onChange(star)}><Star size={16} fill={star <= value ? 'currentColor' : 'none'} /></button>)}</div>;
}

function ProductCard({ product, compact = false }) {
  const { cart, addToCart, favs, toggleFav, ratings, rateProduct } = useContext(SugarContext);
  const qty = cart.find(item => item.id === product.id)?.qty || 0;
  const favorite = favs.includes(product.id);
  const unavailable = product.stock <= qty;
  return <article className="product-card">
    <Link to="/catalogo" className="product-photo" aria-label={'Ver ' + product.name}><ProductImage src={product.img} alt={product.name} />{product.stock === 0 && <span className="product-tag">Agotado</span>}{product.stock > 0 && product.stock < 5 && <span className="product-tag">Últimas unidades</span>}</Link>
    <button className={'favorite-button' + (favorite ? ' selected' : '')} aria-label={(favorite ? 'Quitar de' : 'Agregar a') + ' favoritos: ' + product.name} aria-pressed={favorite} onClick={() => toggleFav(product.id)}><Heart size={18} fill={favorite ? 'currentColor' : 'none'} /></button>
    <div className="product-info"><span className="eyebrow">{product.cat}</span><h3>{product.name}</h3>{!compact && <p>{product.desc}</p>}
      {!compact && <RatingStars value={ratings[product.id] || 0} onChange={value => rateProduct(product.id, value)} name={product.name} />}
      <div className="product-bottom"><div><strong>₡{product.price.toLocaleString('es-CR')}</strong><small>{qty ? qty + ' en tu carrito' : 'Por unidad'}</small></div><button className="add-product" disabled={unavailable} aria-label={'Agregar ' + product.name + ' al carrito'} onClick={() => addToCart(product)}>{unavailable ? <Check size={18} /> : <Plus size={19} />}</button></div>
    </div>
  </article>;
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

function ProgressBar({ value, max, color = '#5b7967', label }) {
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
  const { productos, configNegocio } = useContext(SugarContext);
  const destacados = [...productos].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const categories = [...new Set(productos.map(product => product.cat))];
  return <div className="home-page">
    <section className="store-hero">
      <div className="hero-copy"><span className="eyebrow"><span className="tiny-star"></span> PEQUEÑOS ANTOJOS, GRANDES MOMENTOS</span><h1>La felicidad<br />se sirve <em>fría.</em></h1><p>Paletas cremosas, sabores tropicales y postres para consentirte. Encuentra ese pequeño gusto que hace tu día más bonito.</p><div className="hero-actions"><Link className="btn-primary" to="/catalogo">Encuentra tu favorito <ArrowUpRight size={19} /></Link><Link className="text-link" to="/arma-postre">Crea tu postre <ArrowRight size={17} /></Link></div><div className="hero-note"><span className="note-icon"><IceCream size={19} /></span><span>Un sabor para cada mood.<br /><strong>Hechos para disfrutarse.</strong></span></div></div>
      <div className="hero-visual"><img src="https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1000&q=85" alt="Helado cremoso con chocolate y toppings servido en una copa" fetchPriority="high" onError={e => { e.currentTarget.src = '/product-fallback.svg'; e.currentTarget.onerror = null; }} /><span className="hero-stamp">un poquito<br /><em>de felicidad</em><Sparkles size={19} /></span><div className="hero-caption"><span>EL PLAN DE HOY</span><strong>Algo dulce. Algo tuyo.</strong><Link to="/catalogo" aria-label="Explorar catálogo"><ArrowUpRight size={22} /></Link></div></div>
    </section>
    <section className="service-strip" aria-label="Información del negocio"><div><MapPin size={19} /><span><small>ENCUÉNTRANOS</small>{configNegocio.direccion}</span></div><div><Clock size={19} /><span><small>A TU TIEMPO</small>{configNegocio.horario}</span></div><div><Truck size={20} /><span><small>HASTA TU PUERTA</small>Envío desde ₡{configNegocio.envio.toLocaleString('es-CR')}</span></div><div><Smartphone size={19} /><span><small>FÁCIL Y RÁPIDO</small>SINPE {configNegocio.sinpe}</span></div></section>
    <section className="home-section"><div className="section-heading"><div><span className="eyebrow">ELIGE TU MOOD</span><h2>¿Qué se te antoja?</h2></div><Link className="text-link" to="/catalogo">Ver todos los sabores <ArrowUpRight size={17} /></Link></div><div className="category-collection">{categories.map((category, index) => <Link key={category} to={'/catalogo?categoria=' + encodeURIComponent(category)} className={'category-tile category-' + index}><span className="category-number">0{index + 1}</span><IceCream size={26} strokeWidth={1.4} /><strong>{category}</strong><span>{productos.filter(p => p.cat === category).length} sabores <ArrowUpRight size={15} /></span></Link>)}</div></section>
    <section className="home-section"><div className="section-heading"><div><span className="eyebrow">SIEMPRE ES UNA BUENA IDEA</span><h2>Los favoritos de la casa</h2></div><Link className="text-link" to="/catalogo">Explorar catálogo <ArrowUpRight size={17} /></Link></div><div className="product-grid">{destacados.map(product => <ProductCard key={product.id} product={product} compact />)}</div></section>
    <section className="custom-banner"><div className="custom-icon"><Layers size={42} strokeWidth={1.2} /></div><div><span className="eyebrow">TÚ PONES LA CREATIVIDAD</span><h2>Tu antojo, tus reglas.</h2><p>Elige la base, combina sabores y termina con tus toppings favoritos.</p></div><Link className="btn-primary" to="/arma-postre">Armar mi postre <ArrowUpRight size={18} /></Link></section>
    <footer className="store-footer"><span className="footer-brand">sugar mood<span></span></span><p>El lado dulce de tu día.</p><Link to="/contacto">Hablemos <ArrowUpRight size={16} /></Link></footer>
  </div>;
}

function CatalogoCliente() {
  const { productos } = useContext(SugarContext);
  const location = useLocation();
  const selectedCategory = new URLSearchParams(location.search).get('categoria');
  const categories = ['Todos', ...new Set(productos.map(product => product.cat))];
  const [tab, setTab] = useState(selectedCategory && categories.includes(selectedCategory) ? selectedCategory : 'Todos');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('favorites');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const filtered = productos.filter(product => (tab === 'Todos' || product.cat === tab) && normalize(product.name + ' ' + product.desc).includes(normalize(search))).sort((a,b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'name' ? a.name.localeCompare(b.name, 'es') : b.sold - a.sold);
  return <div className="catalog-page"><div className="page-intro"><span className="eyebrow">UN GUSTITO BIEN MERECIDO</span><h1>Encuentra tu nuevo <em>favorito.</em></h1><p>De lo clásico a lo inesperado. Tenemos un sabor para ti.</p></div><div className="catalog-tools"><label className="search-field"><Search size={19} /><input aria-label="Buscar sabores" placeholder="Busca un sabor, un antojo…" value={search} onChange={e => setSearch(e.target.value)} />{search && <button aria-label="Limpiar búsqueda" onClick={() => setSearch('')}><X size={16} /></button>}</label><label className="sort-field"><SlidersHorizontal size={17} /><select aria-label="Ordenar productos" value={sort} onChange={e => setSort(e.target.value)}><option value="favorites">Más vendidos</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option><option value="name">Nombre A–Z</option></select></label></div><TabBar tabs={categories} active={tab} onChange={setTab} /><div className="catalog-count"><span>{filtered.length} {filtered.length === 1 ? 'sabor para disfrutar' : 'sabores para disfrutar'}</span><span>Precios por unidad · IVA en checkout</span></div>{filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><Search size={36} strokeWidth={1.3} /><h2>No encontramos ese antojo</h2><p>Prueba con otro sabor o explora todas las categorías.</p><button className="btn-secondary" onClick={() => { setSearch(''); setTab('Todos'); }}>Ver todos los sabores</button></div>}<div className="catalog-help"><Sparkles size={21} /><span>¿Tienes una combinación en mente? <Link to="/arma-postre">Crea un postre a tu medida <ArrowRight size={15} /></Link></span></div></div>;
}

function PromocionesCliente() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#593342', fontSize:'2rem', marginBottom:'20px' }}>Promociones</motion.h1>
      <p className="section-note">Ideas de temporada. Las ofertas de demostración no se aplican automáticamente en el checkout.</p>
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
    if (!sel.base || !sel.sabor) return;
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
            style={{ padding:'12px 22px', borderRadius:'14px', border: active ? '2px solid #593342' : '2px solid #e0e0e0',
              background: active ? 'rgba(89,51,66,0.1)' : '#fff', fontWeight:600, fontSize:'0.9rem', display:'flex', flexDirection:'column', alignItems:'center', gap:'4px' }}>
            <span>{item.n}</span>
            <span style={{ fontSize:'0.75rem', color:'#a43d59' }}>+₡{item.p}</span>
          </motion.button>
        );
      })}
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#593342', fontSize:'2rem', marginBottom:'20px' }}>Arma tu Postre</motion.h1>
      <div style={{ display:'flex', gap:'8px', marginBottom:'25px' }}>
        {steps.map((s,i) => (
          <div key={s} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
            <div style={{ width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight:700,
              background: i <= step ? '#593342' : '#e0e0e0', color: i <= step ? '#fff' : '#999' }}>{i+1}</div>
            <span style={{ fontSize:'0.85rem', fontWeight: i === step ? 700 : 400, color: i === step ? '#593342' : '#999' }}>{s}</span>
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
          {step < 4 && <button className="btn-primary" disabled={(step === 0 && !sel.base) || (step === 1 && !sel.sabor)} onClick={() => setStep(s=>s+1)}>Siguiente →</button>}
          {step === 4 && <button className="btn-primary" onClick={finalize} style={{ background:'linear-gradient(135deg,#aa774b,#ac4655)' }}>Agregar al Carrito</button>}
        </div>
        <div className="glass-panel" style={{ padding:'12px 24px', borderRadius:'14px' }}>
          <span style={{ color:'#888', fontSize:'0.85rem' }}>Total estimado: </span>
          <span style={{ color:'#a43d59', fontWeight:700, fontSize:'1.3rem' }}>₡{totalPrice()}</span>
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
  const [orderError, setOrderError] = useState('');

  const subtotal = cart.reduce((s,c) => s + c.price * c.qty, 0);
  const iva = Math.round(subtotal * configNegocio.iva / 100);
  const envio = entrega === 'Express' ? configNegocio.envio : 0;
  const total = subtotal + iva + envio;

  const handleOrder = () => {
    setOrderError('');
    try {
      const order = placeOrder({ clientName: clientName.trim(), metodo, entrega, direccion: direccion.trim(), subtotal, iva, envioFee: envio, total });
      setFactura(order);
    } catch (error) { setOrderError(error.message); return; }
    confetti({ particleCount:150, spread:80, origin:{ y:0.6 } });
  };

  const printFactura = () => { window.print(); };

  if (factura) {
    return (
      <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} style={{ padding:'20px', maxWidth:'600px' }}>
        <div className="glass-panel" style={{ borderRadius:'20px', padding:'30px', borderTop:'4px solid #593342' }}>
          <div style={{ textAlign:'center', marginBottom:'20px' }}>
            <CheckCircle size={48} color="#5b7967" />
            <h2 style={{ color:'#593342', margin:'10px 0 5px' }}>¡Pedido Confirmado!</h2>
            <p style={{ color:'#888', fontSize:'0.9rem' }}>Tu factura ha sido generada</p>
          </div>
          <div style={{ background:'#f9f9f9', borderRadius:'12px', padding:'20px', marginBottom:'20px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'12px' }}>
              <div><span style={{ color:'#888', fontSize:'0.8rem' }}>ID Pedido</span><p style={{ fontWeight:700, color:'#593342' }}>{factura.id}</p></div>
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
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'1.2rem', fontWeight:700, color:'#a43d59', marginTop:'8px' }}>
              <span>TOTAL</span><span>₡{factura.total?.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button className="btn-secondary" onClick={printFactura} style={{ flex:1 }}>Imprimir Factura</button>
            <button className="btn-primary" onClick={() => setFactura(null)} style={{ flex:1 }}>Nuevo Pedido</button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#593342', fontSize:'2rem', marginBottom:'20px' }}>Hacer Pedido</motion.h1>
      <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
        <motion.div variants={fadeIn} style={{ flex:'1 1 400px' }}>
          <div className="glass-panel" style={{ borderRadius:'16px', padding:'20px', marginBottom:'20px' }}>
            <h3 style={{ margin:'0 0 15px', color:'#593342' }}>Carrito ({cart.length} items)</h3>
            {cart.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'30px' }}>Tu carrito está vacío. Agrega productos desde el catálogo.</p> :
              cart.map(item => (
                <div className="cart-item" key={item.id} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px', borderBottom:'1px solid #f0f0f0' }}>
                  <ProductImage src={item.img} alt={item.name} style={{ width:'50px', height:'50px', borderRadius:'8px', objectFit:'cover' }} />
                  <div className="cart-item-name" style={{ flexGrow:1 }}>
                    <h4 style={{ margin:0, fontSize:'0.9rem' }}>{item.name}</h4>
                    <span style={{ color:'#a43d59', fontWeight:600, fontSize:'0.85rem' }}>₡{item.price}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                    <button aria-label={"Disminuir cantidad de " + item.name} disabled={item.qty <= 1} onClick={() => updateCartQty(item.id, -1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #ddd', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Minus size={14} /></button>
                    <span style={{ fontWeight:700, minWidth:'20px', textAlign:'center' }}>{item.qty}</span>
                    <button aria-label={"Aumentar cantidad de " + item.name} onClick={() => updateCartQty(item.id, 1)} style={{ width:'28px', height:'28px', borderRadius:'6px', border:'1px solid #ddd', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={14} /></button>
                  </div>
                  <span style={{ fontWeight:700, color:'#333', minWidth:'70px', textAlign:'right' }}>₡{(item.price*item.qty).toLocaleString()}</span>
                  <button aria-label={"Quitar " + item.name + " del carrito"} onClick={() => removeFromCart(item.id)} style={{ background:'none', border:'none', color:'#ac4655' }}><Trash2 size={16} /></button>
                </div>
              ))
            }
          </div>
        </motion.div>

        <motion.div variants={fadeIn} style={{ flex:'1 1 320px', maxWidth:'400px' }}>
          <div className="glass-panel" style={{ borderRadius:'16px', padding:'20px' }}>
            <h3 style={{ margin:'0 0 15px', color:'#593342' }}>Completa tu pedido</h3>
            <label htmlFor="checkout-name" style={{ fontSize:'0.85rem', fontWeight:600, color:'#555' }}>Tu nombre</label>
            <input id="checkout-name" autoComplete="name" className="input-field" value={clientName} onChange={e=>setClientName(e.target.value)} placeholder="Tu nombre..." style={{ marginBottom:'12px', marginTop:'4px' }} />

            <label style={{ fontSize:'0.85rem', fontWeight:600, color:'#555' }}>Tipo de Entrega</label>
            <div style={{ display:'flex', gap:'8px', marginBottom:'12px', marginTop:'4px' }}>
              {['Retiro en Local','Express'].map(t => (
                <button key={t} aria-pressed={entrega === t} onClick={() => setEntrega(t)} style={{ flex:1, padding:'10px', borderRadius:'10px', border: entrega===t ? '2px solid #593342' : '2px solid #e0e0e0',
                  background: entrega===t ? 'rgba(89,51,66,0.1)' : '#fff', fontWeight:600, fontSize:'0.85rem' }}>
                  {t === 'Express' && <Truck size={14} style={{ marginRight:4 }} />}{t}
                </button>
              ))}
            </div>
            {entrega === 'Express' && <input aria-label="Dirección de entrega" autoComplete="street-address" className="input-field" value={direccion} onChange={e=>setDireccion(e.target.value)} placeholder="Dirección de entrega..." style={{ marginBottom:'12px' }} />}

            <label style={{ fontSize:'0.85rem', fontWeight:600, color:'#555' }}>Método de Pago</label>
            <div style={{ display:'flex', flexDirection:'column', gap:'8px', margin:'6px 0 15px' }}>
              {['SINPE Móvil','Tarjeta','Efectivo'].map(m => (
                <button key={m} aria-pressed={metodo === m} onClick={() => setMetodo(m)} style={{ padding:'12px 14px', borderRadius:'10px', border: metodo===m ? '2px solid #a43d59' : '2px solid #e0e0e0',
                  background: metodo===m ? 'rgba(233,30,99,0.06)' : '#fff', fontWeight:600, fontSize:'0.85rem', textAlign:'left', display:'flex', alignItems:'center', gap:'10px' }}>
                  {m==='SINPE Móvil' && <Smartphone size={16} color="#5b7967" />}
                  {m==='Tarjeta' && <CreditCard size={16} color="#746184" />}
                  {m==='Efectivo' && <DollarSign size={16} color="#aa774b" />}
                  {m}
                  {metodo===m && <Check size={16} color="#a43d59" style={{ marginLeft:'auto' }} />}
                </button>
              ))}
            </div>
            {metodo === 'SINPE Móvil' && (
              <div style={{ background:'#e8f5e9', borderRadius:'10px', padding:'12px', marginBottom:'12px', fontSize:'0.85rem' }}>
                <p style={{ fontWeight:700, color:'#2e7d32' }}>SINPE Móvil</p>
                <p>Número: <b>{configNegocio.sinpe}</b></p>
                <p style={{ color:'#555', fontSize:'0.8rem' }}>Envía el monto exacto y guarda el comprobante.</p>
              </div>
            )}

            <div style={{ background:'#f9f9f9', borderRadius:'10px', padding:'14px', marginBottom:'15px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'4px' }}><span>Subtotal</span><span>₡{subtotal.toLocaleString()}</span></div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'4px' }}><span>IVA ({configNegocio.iva}%)</span><span>₡{iva.toLocaleString()}</span></div>
              {envio > 0 && <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.85rem', marginBottom:'4px' }}><span>Envío Express</span><span>₡{envio.toLocaleString()}</span></div>}
              <hr style={{ border:'none', borderTop:'1px solid #e0e0e0', margin:'8px 0' }} />
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'1.15rem', fontWeight:700, color:'#a43d59' }}><span>Total</span><span>₡{total.toLocaleString()}</span></div>
            </div>

            {orderError && <p role="alert" className="form-error">{orderError}</p>}
            {subtotal < configNegocio.pedidoMinimo && <p className="form-error">Pedido mínimo: ₡{configNegocio.pedidoMinimo.toLocaleString()}</p>}
            <button className="btn-primary" onClick={handleOrder} disabled={cart.length===0||!clientName.trim()||subtotal<configNegocio.pedidoMinimo||(entrega==='Express'&&!direccion.trim())}
              style={{ width:'100%', padding:'14px', fontSize:'1rem' }}>
              Confirmar pedido
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
      <motion.h1 variants={fadeIn} style={{ color:'#593342', fontSize:'2rem', marginBottom:'20px' }}>Mis Pedidos</motion.h1>
      {orders.length === 0 ? <p style={{ color:'#999', textAlign:'center', padding:'40px' }}>No tienes pedidos aún.</p> :
        orders.map(order => (
          <motion.div key={order.id} variants={fadeIn} className="glass-panel" style={{ borderRadius:'16px', padding:'20px', marginBottom:'15px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px', flexWrap:'wrap', gap:'10px' }}>
              <div>
                <h3 style={{ margin:0, color:'#593342' }}>{order.id}</h3>
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
                      background: done ? '#5b7967' : '#e0e0e0', color: done ? '#fff' : '#999', fontSize:'0.7rem' }}>
                      {done ? <Check size={14} /> : i+1}
                    </div>
                    {i<trackSteps.length-1 && <div style={{ flexGrow:1, height:'3px', background: order.tracking?.includes(trackSteps[i+1]) ? '#5b7967' : '#e0e0e0', borderRadius:'2px' }} />}
                  </React.Fragment>
                );
              })}
            </div>
            <div style={{ fontSize:'0.85rem' }}>
              {order.items?.map((it,i) => <span key={i} style={{ marginRight:'10px' }}>{it.name} x{it.qty}</span>)}
              <span style={{ float:'right', fontWeight:700, color:'#a43d59' }}>₡{order.total?.toLocaleString()}</span>
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
  const { productos, favs } = useContext(SugarContext);
  const favorites = productos.filter(product => favs.includes(product.id));
  return <div><div className="page-intro"><span className="eyebrow">GUARDADOS CON CARIÑO</span><h1>Tus favoritos</h1><p>Esos sabores a los que siempre quieres volver.</p></div>{favorites.length ? <div className="product-grid">{favorites.map(product => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><Heart size={34} strokeWidth={1.3} /><h2>Tus próximos favoritos te esperan</h2><p>Guarda los sabores que más te gustan con el corazón del catálogo.</p><Link className="btn-primary" to="/catalogo">Descubrir sabores <ArrowUpRight size={18} /></Link></div>}</div>;
}

function ProgramaPuntos() {
  const { puntos, nivel } = useContext(SugarContext);
  const niveles = [{ n:'Bronce', min:0, color:'#cd7f32' },{ n:'Plata', min:200, color:'#9e9e9e' },{ n:'Oro', min:500, color:'#ac7741' }];
  const currentNivel = niveles.find(n => n.n === nivel) || niveles[0];
  const nextNivel = niveles[niveles.indexOf(currentNivel)+1];
  const recompensas = [
    { pts:100, reward:'Postre gratis', icon:'🍦' },{ pts:250, reward:'Combo Premium', icon:'🎁' },
    { pts:500, reward:'Envío gratis x5', icon:'🚚' },{ pts:1000, reward:'Fiesta VIP', icon:'🎉' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#593342', fontSize:'2rem', marginBottom:'20px' }}>Programa de Puntos</motion.h1>
      <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'20px', padding:'30px', marginBottom:'20px', textAlign:'center' }}>
        <Award size={48} color={currentNivel.color} />
        <h2 style={{ color: currentNivel.color, margin:'10px 0' }}>Nivel: {nivel}</h2>
        <p style={{ fontSize:'2.5rem', fontWeight:700, color:'#593342', margin:'5px 0' }}>{puntos} pts</p>
        {nextNivel && <ProgressBar value={puntos} max={nextNivel.min} color={currentNivel.color} label={`${puntos}/${nextNivel.min} para ${nextNivel.n}`} />}
        <p style={{ color:'#888', fontSize:'0.85rem' }}>Ganas 1 punto por cada ₡100 en compras</p>
      </motion.div>
      <h3 style={{ color:'#593342', marginBottom:'12px' }}>Recompensas</h3><p className="section-note">Acumula puntos con tus pedidos. El canje de recompensas estará disponible próximamente.</p>
      <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
        {recompensas.map(r => (
          <motion.div key={r.pts} variants={fadeIn} className="glass-panel" style={{ borderRadius:'14px', padding:'20px', flex:'1 1 180px', textAlign:'center', opacity: puntos >= r.pts ? 1 : 0.5 }}>
            <span style={{ fontSize:'2rem' }}>{r.icon}</span>
            <h4 style={{ margin:'8px 0 4px' }}>{r.reward}</h4>
            <span style={{ fontSize:'0.85rem', color:'#a43d59', fontWeight:600 }}>{r.pts} pts</span>
            {puntos >= r.pts && <div><button className="btn-primary" disabled title="El canje estará disponible próximamente" style={{ marginTop:'8px', padding:'6px 16px', fontSize:'0.8rem' }}>Próximamente</button></div>}
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
      <motion.h1 variants={fadeIn} style={{ color:'#593342', fontSize:'2rem', marginBottom:'20px' }}>Reseñas</motion.h1>
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
              <h2 style={{ margin:0, color:'#593342' }}>{prod.name}</h2>
              <p style={{ color:'#888', fontSize:'0.9rem' }}>{prod.desc}</p>
              <div style={{ display:'flex', gap:'3px', marginTop:'8px' }}>
                {[1,2,3,4,5].map(s => <button className="star-button" key={s} aria-label={s + ' de 5 estrellas'} aria-pressed={myR === s} onClick={() => rateProduct(selProd, s)}><Star size={24} fill={s<=myR?'#ac7741':'none'} color="#ac7741" /></button>)}
                <span style={{ marginLeft:'8px', fontWeight:700, color:'#ac7741' }}>{myR}/5</span>
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
    if (!texto.trim()) return;
    if (tipo === 'Reporte') setReportes(p => [...p, { id:Date.now(), fecha:new Date().toLocaleDateString(), detalles:texto, estado:'Pendiente' }]);
    else setMensajes(p => [...p, { id:Date.now(), fecha:new Date().toLocaleDateString(), texto, leido:false }]);
    setSent(true); setTexto('');
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#593342', fontSize:'2rem', marginBottom:'20px' }}>Contacto</motion.h1>
      <div style={{ display:'flex', gap:'20px', flexWrap:'wrap' }}>
        <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'16px', padding:'25px', flex:'1 1 350px' }}>
          <h3 style={{ color:'#593342', marginBottom:'15px' }}>Información</h3>
          {[
            { icon:MapPin, text: configNegocio.direccion },
            { icon:Clock, text: configNegocio.horario },
            { icon:Phone, text: configNegocio.telefono },
            { icon:Smartphone, text:`SINPE: ${configNegocio.sinpe}` },
          ].map((item,i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:'rgba(89,51,66,0.1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <item.icon size={18} color="#593342" />
              </div>
              <span style={{ fontSize:'0.9rem' }}>{item.text}</span>
            </div>
          ))}
          <div style={{ marginTop:'15px', background:'rgba(89,51,66,0.05)', borderRadius:'12px', height:'180px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MapPin size={32} color="#593342" /><span style={{ marginLeft:'10px', color:'#593342', fontWeight:600 }}>San José, Costa Rica</span>
          </div>
        </motion.div>

        <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'16px', padding:'25px', flex:'1 1 350px' }}>
          <h3 style={{ color:'#593342', marginBottom:'15px' }}>Enviar Mensaje</h3>
          {sent ? (
            <div style={{ textAlign:'center', padding:'30px' }}>
              <CheckCircle size={40} color="#5b7967" />
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
    if (!Number.isFinite(Number(monto)) || Number(monto) <= 0) return;
    setDonaciones(p => [...p, { id:Date.now(), nombre:nombre||'Anónimo', monto:Number(monto), fecha:new Date().toLocaleDateString() }]);
    setSent(true);
    confetti({ particleCount:120, colors:['#ffeb3b','#fbc02d','#fff59d'] });
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#ff8f00', fontSize:'2rem', marginBottom:'20px' }}>Donaciones</motion.h1>
      <motion.div variants={fadeIn} className="glass-panel" style={{ borderRadius:'20px', padding:'30px', maxWidth:'500px', borderTop:'4px solid #ffb300' }}>
        <p style={{ color:'#555', marginBottom:'20px' }}>Tu apoyo nos ayuda a crecer. ¡Gracias por creer en Sugar Mood!</p>
        {sent ? (
          <div style={{ textAlign:'center', padding:'20px' }}>
            <h3 style={{ color:'#ff8f00' }}>¡Gracias por tu apoyo!</h3>
            <button className="btn-primary" onClick={() => { setSent(false); setMonto(''); setNombre(''); }} style={{ marginTop:'15px', background:'#ff8f00' }}>Hacer otra donación</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            <input className="input-field" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre (opcional)" />
            <input className="input-field" type="number" min="1" value={monto} onChange={e=>setMonto(e.target.value)} placeholder="Monto (₡)" required />
            <button type="submit" className="btn-primary" style={{ background:'linear-gradient(135deg,#ff8f00,#ffb300)' }}>Donar</button>
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
  const { productos, orders, donaciones, gastos } = useContext(SugarContext);
  const totalVentas = orders.reduce((s,o) => s + (o.total||0), 0);
  const totalDonaciones = donaciones.reduce((s,d) => s + d.monto, 0);
  const stockCritico = productos.filter(p => p.stock < 5).length;
  const pendientes = orders.filter(o => o.estado === 'Pendiente').length;
  const masVendido = [...productos].sort((a,b) => b.sold - a.sold)[0];
  const totalGastos = gastos.reduce((s,g) => s + g.monto, 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Dashboard</motion.h1>
      <motion.div variants={stagger} style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <KPICard icon={DollarSign} label="Ventas Totales" value={totalVentas} color="#5b7967" prefix="₡" />
        <KPICard icon={ShoppingCart} label="Pedidos" value={orders.length} color="#746184" />
        <KPICard icon={TrendingUp} label="Balance estimado" value={totalVentas - totalGastos} color="#593342" prefix="₡" />
        <KPICard icon={Gift} label="Donaciones" value={totalDonaciones} color="#aa774b" prefix="₡" />
      </motion.div>
      <motion.div variants={stagger} style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <KPICard icon={AlertTriangle} label="Stock Crítico" value={stockCritico} color="#ac4655" />
        <KPICard icon={Clock} label="Pendientes" value={pendientes} color="#b97456" />
        <KPICard icon={Award} label="Más Vendido" value={masVendido?.name||'N/A'} color="#856581" />
        <KPICard icon={Package} label="Productos" value={productos.length} color="#74757c" />
      </motion.div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ marginBottom:'15px' }}>Top 8 Productos por Ventas</h3>
        {[...productos].sort((a,b)=>b.sold-a.sold).slice(0,8).map(p => (
          <ProgressBar key={p.id} label={p.name} value={p.sold} max={50} color={p.stock<5?'#ac4655':'#5b7967'} />
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
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Reportes</motion.h1>
      <div style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <motion.div variants={fadeIn} className="kpi-card" style={{ flex:'1 1 250px', borderLeft:'4px solid #5b7967' }}>
          <h3 style={{ color:'#555', fontSize:'0.9rem' }}>Ingresos</h3><p style={{ fontSize:'1.8rem', fontWeight:700, color:'#5b7967' }}>₡{totalVentas.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={fadeIn} className="kpi-card" style={{ flex:'1 1 250px', borderLeft:'4px solid #ac4655' }}>
          <h3 style={{ color:'#555', fontSize:'0.9rem' }}>Gastos</h3><p style={{ fontSize:'1.8rem', fontWeight:700, color:'#ac4655' }}>₡{totalGastos.toLocaleString()}</p>
        </motion.div>
        <motion.div variants={fadeIn} className="kpi-card" style={{ flex:'1 1 250px', borderLeft:'4px solid #593342' }}>
          <h3 style={{ color:'#555', fontSize:'0.9rem' }}>Margen Bruto</h3><p style={{ fontSize:'1.8rem', fontWeight:700, color: margen>=0?'#593342':'#ac4655' }}>₡{margen.toLocaleString()}</p>
        </motion.div>
      </div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)', marginBottom:'20px' }}>
        <h3 style={{ marginBottom:'15px' }}>Métodos de Pago</h3>
        <ProgressBar label={`SINPE Móvil (${sinpe})`} value={sinpe} max={totalOrd} color="#5b7967" />
        <ProgressBar label={`Tarjeta (${tarjeta})`} value={tarjeta} max={totalOrd} color="#746184" />
        <ProgressBar label={`Efectivo (${efectivo})`} value={efectivo} max={totalOrd} color="#aa774b" />
      </motion.div>
      <motion.div variants={fadeIn} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
        <h3 style={{ marginBottom:'15px' }}>Categorías por Margen</h3>
        {[...new Set(productos.map(p=>p.cat))].map(cat => {
          const catProds = productos.filter(p=>p.cat===cat);
          const catSold = catProds.reduce((s,p)=>s+p.sold,0);
          return <ProgressBar key={cat} label={cat} value={catSold} max={100} color="#593342" />;
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
        <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', margin:0 }}>Inventario</motion.h1>
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
            <button className="btn-secondary" onClick={() => { if(np.name.trim() && Number.isFinite(np.price) && np.price > 0 && Number.isInteger(np.stock) && np.stock >= 0){ addProduct(np); setNp({name:'',cat:'Premium',price:700,stock:10,desc:'',img:'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=300&q=80'}); setShowAdd(false); } }}>Guardar</button>
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
                <td style={{ padding:'10px 12px', color:'#a43d59', fontWeight:600 }}>₡{p.price}</td>
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
                    <button onClick={() => updateStock(p.id,1)} style={{ width:'30px', height:'30px', borderRadius:'6px', border:'none', background:'#342a30', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Plus size={14} /></button>
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
    if (newGasto.concepto.trim() && Number.isFinite(Number(newGasto.monto)) && Number(newGasto.monto) > 0) {
      setGastos(p => [...p, { id:Date.now(), ...newGasto, monto:Number(newGasto.monto), fecha:new Date().toLocaleDateString() }]);
      setNewGasto({ concepto:'', monto:'' });
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Finanzas</motion.h1>
      <div style={{ display:'flex', gap:'15px', flexWrap:'wrap', marginBottom:'25px' }}>
        <KPICard icon={TrendingUp} label="Ingresos" value={totalIngresos} color="#5b7967" prefix="₡" />
        <KPICard icon={Minus} label="Gastos" value={totalGastos} color="#ac4655" prefix="₡" />
        <KPICard icon={DollarSign} label="Ganancia Real" value={ganancia} color={ganancia>=0?'#593342':'#ac4655'} prefix="₡" />
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
            <div><span style={{ color:'#888', marginRight:'15px' }}>{g.fecha}</span><span style={{ fontWeight:700, color:'#ac4655' }}>-₡{g.monto.toLocaleString()}</span></div>
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
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Bandeja de Pedidos</motion.h1>
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
              <span style={{ float:'right', fontWeight:700, color:'#a43d59', fontSize:'1.1rem' }}>₡{order.total?.toLocaleString()}</span>
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
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Clientes</motion.h1>
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
                  <td style={{ padding:'10px', color:'#5b7967', fontWeight:600 }}>₡{c.totalGastado?.toLocaleString()}</td>
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
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Donaciones</motion.h1>
      <motion.div variants={fadeIn} className="kpi-card" style={{ borderLeft:'4px solid #aa774b', marginBottom:'20px', maxWidth:'300px' }}>
        <span style={{ color:'#888', fontSize:'0.85rem' }}>Total Recaudado</span>
        <p style={{ fontSize:'2rem', fontWeight:700, color:'#aa774b', margin:'8px 0 0' }}>₡{total.toLocaleString()}</p>
      </motion.div>
      <div style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
        {donaciones.length === 0 ? <p style={{ color:'#999', textAlign:'center' }}>No hay donaciones registradas.</p> :
          donaciones.map(d => (
            <div key={d.id} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #f5f5f5', alignItems:'center' }}>
              <div><p style={{ fontWeight:600, margin:0 }}>{d.nombre}</p><span style={{ fontSize:'0.8rem', color:'#888' }}>{d.fecha}</span></div>
              <span style={{ fontWeight:700, color:'#5b7967', fontSize:'1.1rem' }}>₡{d.monto.toLocaleString()}</span>
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
    if (ne.titulo.trim() && ne.fecha && Number.isFinite(Number(ne.total)) && Number(ne.total) >= 0) {
      setEventos(p => [...p, { id:Date.now(), ...ne, total:Number(ne.total)||0, estado:'Pendiente' }]);
      setNe({ titulo:'', fecha:'', paquete:'', total:'' });
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Eventos</motion.h1>
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
              <span style={{ fontWeight:700, color:'#a43d59' }}>₡{ev.total?.toLocaleString()}</span>
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
  const [configError, setConfigError] = useState('');

  const save = () => { if (![conf.iva, conf.envio, conf.pedidoMinimo].every(v => Number.isFinite(v) && v >= 0) || conf.iva > 100) { setConfigError('Revisa los valores: el IVA debe estar entre 0 y 100; los importes deben ser positivos o cero.'); return; } setConfigError(''); setConfigNegocio(conf); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger} style={{ padding:'20px' }}>
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Configuración</motion.h1>
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
            <label htmlFor={"config-" + f.key} style={{ fontSize:'0.85rem', fontWeight:600, color:'#555', display:'block', marginBottom:'4px' }}>{f.label}</label>
            <input id={"config-" + f.key} className="input-field" type={f.type||'text'} value={conf[f.key]} onChange={e=>setConf(p=>({...p,[f.key]:f.type==='number'?Number(e.target.value):e.target.value}))} />
          </div>
        ))}
        {configError && <p role="alert" className="form-error">{configError}</p>}
        <button className="btn-secondary" onClick={save} style={{ marginTop:'10px' }}>{saved ? 'Cambios aplicados' : 'Guardar configuración'}</button>
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
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Directorio de Distribuidoras</motion.h1>
      <TabBar tabs={tabs} active={tab} onChange={setTab} />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'15px' }}>
        {DISTRIBUTORS.filter(d => d.tab === tab).map(d => (
          <motion.div key={d.id} variants={fadeIn} whileHover={{ y:-4 }} style={{ background:'#fff', borderRadius:'14px', padding:'20px', boxShadow:'0 4px 12px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin:'0 0 8px', fontSize:'1.05rem' }}>{d.nombre}</h3>
            <p style={{ fontSize:'0.85rem', color:'#888', margin:'4px 0' }}>{d.encargado}</p>
            <p style={{ fontSize:'0.85rem', color:'#593342', fontWeight:700, margin:'4px 0' }}>{d.contacto}</p>
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
      <motion.h1 variants={fadeIn} style={{ color:'#342a30', fontSize:'2rem', marginBottom:'20px' }}>Buzón</motion.h1>
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
function Sidebar({ open, onClose }) {
  const { role, setRole, cart } = useContext(SugarContext);
  const location = useLocation();
  const navigate = useNavigate();

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
  const switchRole = () => { setRole(role === 'cliente' ? 'admin' : 'cliente'); navigate('/'); onClose(); };
  return <><button className={'menu-backdrop' + (open ? ' visible' : '')} aria-label="Cerrar menú" onClick={onClose} tabIndex={open ? 0 : -1} /><aside id="store-navigation" className={'sidebar' + (open ? ' open' : '')} aria-label="Navegación principal"><Link to="/" onClick={onClose} className="brand"><span className="brand-mark"><IceCream size={27} strokeWidth={1.5} /></span><span>sugar mood<small>EL LADO DULCE DE TU DÍA</small></span></Link><button className="close-menu icon-button" aria-label="Cerrar menú" onClick={onClose}><X size={21} /></button><span className="navigation-label">{role === 'cliente' ? 'DESCUBRE & DISFRUTA' : 'TU NEGOCIO'}</span><nav>{links.map((link, index) => { const Icon = link.icon; const active = location.pathname === link.path; return <React.Fragment key={link.path}>{index === 5 && <span className="navigation-label nav-divider">{role === 'cliente' ? 'TU ESPACIO' : 'GESTIÓN'}</span>}<Link to={link.path} onClick={onClose} className={'nav-link' + (active ? ' active' : '')} aria-current={active ? 'page' : undefined}><Icon size={18} strokeWidth={1.6} /><span>{link.label}</span>{link.badge > 0 && <span className="cart-badge">{link.badge}</span>}{active && !link.badge && <span className="active-dot" />}</Link></React.Fragment>; })}</nav><div className="sidebar-note"><Sparkles size={22} /><strong>Un detalle que alegra.</strong><p>Siempre hay una buena razón para algo dulce.</p><Link to={role === 'cliente' ? '/arma-postre' : '/inventario'} onClick={onClose}>{role === 'cliente' ? 'Hazlo a tu gusto' : 'Ver inventario'} <ArrowUpRight size={15} /></Link></div><button className="role-switch" onClick={switchRole}><User size={17} /><span>{role === 'cliente' ? 'Vista de administración' : 'Volver a la tienda'}</span><ArrowUpRight size={15} /></button><span className="sidebar-footnote">Sugar Mood · Costa Rica</span></aside></>;
}

function StoreHeader({ onMenuToggle, menuOpen }) {
  const { role, cart } = useContext(SugarContext);
  const location = useLocation();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const titles = {
    '/': role === 'admin' ? 'Resumen' : 'Algo dulce te espera',
    '/catalogo': 'Catálogo', '/promos': 'Promociones', '/arma-postre': 'Crea tu postre',
    '/pedido': 'Tu pedido', '/mis-pedidos': 'Mis pedidos', '/favoritos': 'Favoritos',
    '/puntos': 'Programa de puntos', '/resenas': 'Reseñas', '/donar': 'Donaciones', '/contacto': 'Contacto',
    '/reportes-admin': 'Reportes', '/inventario': 'Inventario', '/finanzas': 'Finanzas',
    '/pedidos-admin': 'Pedidos', '/clientes': 'Clientes', '/donaciones-admin': 'Donaciones',
    '/eventos': 'Eventos', '/directorio': 'Distribuidores', '/buzon': 'Buzón', '/config': 'Configuración',
  };
  return (
    <header className="store-header">
      <div className="header-left">
        <button className="mobile-menu icon-button" aria-label="Abrir menú" aria-expanded={menuOpen} aria-controls="store-navigation" onClick={onMenuToggle}><Menu size={22} /></button>
        <span className="header-breadcrumb">{role === 'admin' ? 'Administración' : 'La tienda'} <ChevronRight size={13} /><strong>{titles[location.pathname] || 'Inicio'}</strong></span>
      </div>
      <div className="header-actions">
        <Link className="header-contact" to={role === 'cliente' ? '/contacto' : '/buzon'}><Phone size={16} />{role === 'cliente' ? 'Hablemos' : 'Buzón'}</Link>
        <Link className="header-cart" to={role === 'cliente' ? '/pedido' : '/pedidos-admin'}><ShoppingCart size={17} /><span>{role === 'cliente' ? 'Mi carrito' : 'Pedidos'}</span>{role === 'cliente' && <b>{count}</b>}</Link>
      </div>
    </header>
  );
}

function MainContent({ onMenuToggle, menuOpen }) {
  const { role } = useContext(SugarContext);
  return (
    <main inert={menuOpen ? true : undefined} tabIndex={-1} id="main-content" className={"main-content " + role}><StoreHeader onMenuToggle={onMenuToggle} menuOpen={menuOpen} /><div className="page-content">
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
    </div></main>
  );
}

// ============================================================================
// APP
// ============================================================================
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (!menuOpen) return;
    const navigation = document.getElementById('store-navigation');
    if (!navigation) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => [...navigation.querySelectorAll('a, button')].filter(element => element.getClientRects().length && !element.disabled);
    focusable()[0]?.focus();
    const handleKey = event => {
      if (event.key === 'Escape') setMenuOpen(false);
      if (event.key !== 'Tab') return;
      const items = focusable();
      const first = items[0];
      const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const wideScreen = window.matchMedia('(min-width: 761px)');
    const onResize = event => { if (event.matches) setMenuOpen(false); };
    wideScreen.addEventListener('change', onResize);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKey);
      wideScreen.removeEventListener('change', onResize);
      previousFocus?.focus();
    };
  }, [menuOpen]);
  return (
    <SugarProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">Saltar al contenido</a><div className="app-shell">
          <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
          <MainContent menuOpen={menuOpen} onMenuToggle={() => setMenuOpen(true)} />
        </div>
      </BrowserRouter>
    </SugarProvider>
  );
}
