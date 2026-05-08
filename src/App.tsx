import React, { useEffect, useState } from 'react';
import {
  Instagram, ShoppingBag, ChevronDown, Star,
  Leaf, Heart, Package, ArrowRight, Menu, X,
  MapPin, Sparkles, Gift
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  bg: string;
  emoji: string;
  badge?: string;
  tags: string[];
}

interface Benefit { icon: React.ElementType; title: string; desc: string; }
interface Collection { label: string; bg: string; emoji: string; }

// ─── Data ────────────────────────────────────────────────────────────────────

const STORE_URL = 'https://magec-velas.sumaplastore.com';
const IG_URL    = 'https://www.instagram.com/magec.velas';

const NAV = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Productos', href: '#productos' },
  { label: 'Colecciones', href: '#colecciones' },
  { label: 'Galería', href: '#galeria' },
];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Vela Joyero',
    subtitle: 'Descubre una joya en su interior',
    price: 'Desde $18',
    bg: '#EDE5D6',
    emoji: '💎',
    badge: 'Best Seller',
    tags: ['Cera natural', 'Con sorpresa'],
  },
  {
    id: 2,
    name: 'Vela Barqueta',
    subtitle: 'La vela que transforma tu baño',
    price: 'Desde $14',
    bg: '#F7E8E0',
    emoji: '🛁',
    tags: ['Escultórica', 'Artesanal'],
  },
  {
    id: 3,
    name: 'Vela Carrusel',
    subtitle: 'Magia y detalle en cada llama',
    price: 'Desde $22',
    bg: '#F0EBE0',
    emoji: '🎠',
    badge: 'Premium',
    tags: ['Edición especial', 'Regalo ideal'],
  },
  {
    id: 4,
    name: 'Velón XXL',
    subtitle: 'Aroma, diseño y funcionalidad',
    price: 'Desde $16',
    bg: '#E8EDE8',
    emoji: '🕯️',
    tags: ['Gran tamaño', 'Cera de soja'],
  },
  {
    id: 5,
    name: 'Mikados',
    subtitle: 'Aromas constantes para tu hogar',
    price: 'Desde $12',
    bg: '#EBE8F0',
    emoji: '🪔',
    tags: ['Sin llama', 'Larga duración'],
  },
  {
    id: 6,
    name: 'Ambientador Coche',
    subtitle: 'Tu fragancia favorita en cada viaje',
    price: 'Desde $8',
    bg: '#F0E8E8',
    emoji: '🚗',
    tags: ['Compacto', 'Potente'],
  },
];

const BENEFITS: Benefit[] = [
  {
    icon: Leaf,
    title: 'Cera natural 100%',
    desc: 'Usamos cera de soja y cera natural. Sin parafina, sin químicos dañinos.',
  },
  {
    icon: Heart,
    title: 'Hecho a mano',
    desc: 'Cada pieza es elaborada a mano con dedicación y atención al detalle.',
  },
  {
    icon: Sparkles,
    title: 'Cada producto tiene su magia',
    desc: 'Desde velas joyero con sorpresa hasta esculturas únicas. Nada es ordinario.',
  },
  {
    icon: Gift,
    title: 'El regalo perfecto',
    desc: 'Packaging cuidado, listo para regalar. También hacemos pedidos personalizados.',
  },
  {
    icon: Package,
    title: 'Envío a toda España',
    desc: 'Enviamos a toda la península e islas. También disponibles en ferias de Tenerife.',
  },
  {
    icon: MapPin,
    title: 'Tenerife, Canarias',
    desc: 'Marca canaria con corazón. Nos encontrás en mercados y ferias locales.',
  },
];

const COLLECTIONS: Collection[] = [
  { label: 'Halloween', bg: 'linear-gradient(135deg,#3D2410 0%,#8B3A0F 100%)', emoji: '👻' },
  { label: 'Navidad', bg: 'linear-gradient(135deg,#1A3A1A 0%,#2E5E2E 100%)', emoji: '🎄' },
  { label: 'Verano', bg: 'linear-gradient(135deg,#C47A2A 0%,#E4A84B 100%)', emoji: '☀️' },
  { label: 'Harry Potter', bg: 'linear-gradient(135deg,#1A1A3A 0%,#3A2A5A 100%)', emoji: '⚡' },
  { label: 'San Valentín', bg: 'linear-gradient(135deg,#7A1A2E 0%,#C44A6A 100%)', emoji: '❤️' },
  { label: 'Personalizada', bg: 'linear-gradient(135deg,#2C2416 0%,#5A4A2A 100%)', emoji: '✨' },
];

const GALLERY_ITEMS = [
  { bg: 'linear-gradient(135deg,#EDE5D6,#D4C4A8)', title: 'Vela Joyero', hint: '💎' },
  { bg: 'linear-gradient(135deg,#F7E8E0,#E8C8B8)', title: 'Vela Barqueta', hint: '🛁' },
  { bg: 'linear-gradient(135deg,#3D2410,#8B5A30)', title: 'Halloween', hint: '👻' },
  { bg: 'linear-gradient(135deg,#F0EBE0,#DAD0C0)', title: 'Vela Carrusel', hint: '🎠' },
  { bg: 'linear-gradient(135deg,#1A3A1A,#3A6A3A)', title: 'Colección Navidad', hint: '🎄' },
  { bg: 'linear-gradient(135deg,#EBE8F0,#C8C0D8)', title: 'Mikados', hint: '🪔' },
];

const TICKER_ITEMS = [
  '✦ Hecho a mano',
  '✦ Cera natural',
  '✦ Envío a toda España',
  '✦ Tenerife, Canarias',
  '✦ Cada producto tiene su magia',
  '✦ Velas escultóricas únicas',
  '✦ Pedidos personalizados',
];

// ─── Candle SVG Component ─────────────────────────────────────────────────────

function AnimatedCandle({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const scale = size === 'sm' ? 0.6 : size === 'lg' ? 1.4 : 1;
  return (
    <div className="float-anim relative inline-flex flex-col items-center" style={{ transform: `scale(${scale})`, transformOrigin: 'bottom center' }}>
      {/* Smoke particles */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="smoke absolute rounded-full"
          style={{
            width: 3, height: 3,
            backgroundColor: 'rgba(200,180,140,0.5)',
            top: -8 - i * 6,
            left: '50%',
            transform: 'translateX(-50%)',
            animationDelay: `${i * 0.8}s`,
          }}
        />
      ))}
      {/* Flame */}
      <div
        className="flame relative z-10 -mb-0.5"
        style={{
          width: 18, height: 26,
          borderRadius: '50% 50% 30% 30%',
          background: 'radial-gradient(ellipse at 50% 85%, #FFFBC8 0%, #FFCC33 35%, #FF8C00 65%, #E83A00 100%)',
        }}
      />
      {/* Wick */}
      <div style={{ width: 2, height: 8, backgroundColor: '#3D2410', zIndex: 20, position: 'relative' }} />
      {/* Body */}
      <div
        style={{
          width: 44,
          height: 72,
          borderRadius: '4px 4px 6px 6px',
          background: 'linear-gradient(160deg, #F5F0E8 0%, #E4D4B8 40%, #C8A878 100%)',
          boxShadow: '2px 4px 12px rgba(44,36,22,.2)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Wax melt line */}
        <div style={{ position: 'absolute', top: 14, left: 0, right: 0, height: 2, background: 'rgba(255,255,255,0.4)', borderRadius: 2 }} />
      </div>
    </div>
  );
}

// ─── Scroll hook ─────────────────────────────────────────────────────────────

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useReveal();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ backgroundColor: '#F5F0E8', color: '#2C2416', fontFamily: '"DM Sans", sans-serif' }}>

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════ */}
      <header
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(245,240,232,0.96)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(196,132,90,0.18)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-1.5 group">
            <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.6rem', fontWeight: 600, letterSpacing: '0.08em', color: '#2C2416', lineHeight: 1 }}>
              MAGEC
            </span>
            <span style={{ fontSize: '0.55rem', letterSpacing: '0.25em', color: '#C4845A', fontWeight: 500, alignSelf: 'flex-end', paddingBottom: 3 }}>
              VELAS
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className="nav-link text-sm font-medium" style={{ color: '#3D3025' }}>{l.label}</a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-opacity hover:opacity-70"
              style={{ border: '1.5px solid #C4845A', color: '#C4845A' }}
            >
              <Instagram size={14} /> Instagram
            </a>
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#2C2416', color: '#F5F0E8' }}
            >
              <ShoppingBag size={14} /> Tienda online
            </a>
          </div>

          <button className="md:hidden p-2 rounded-lg" style={{ color: '#2C2416' }} onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden px-6 pt-3 pb-6 flex flex-col gap-5"
            style={{ backgroundColor: 'rgba(245,240,232,0.98)', borderTop: '1px solid rgba(196,132,90,0.15)' }}
          >
            {NAV.map((l) => (
              <a key={l.href} href={l.href} className="text-base font-medium" style={{ color: '#3D3025' }} onClick={() => setMenuOpen(false)}>{l.label}</a>
            ))}
            <div className="flex gap-3 pt-2">
              <a href={IG_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: '#C4845A' }}>
                <Instagram size={15} /> @magec.velas
              </a>
            </div>
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold"
              style={{ backgroundColor: '#2C2416', color: '#F5F0E8' }}
            >
              <ShoppingBag size={15} /> Ir a la tienda
            </a>
          </div>
        )}
      </header>

      {/* ══ TICKER ══════════════════════════════════════════════════════════ */}
      <div className="overflow-hidden py-2.5 pt-16" style={{ backgroundColor: '#2C2416' }}>
        <div className="marquee-track whitespace-nowrap flex">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="inline-block px-8 text-xs font-medium tracking-widest uppercase" style={{ color: '#C4845A' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══ HERO ════════════════════════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: 'linear-gradient(165deg, #F5F0E8 0%, #EDE5D6 55%, #E0D2BC 100%)' }}
      >
        {/* Orbs */}
        <div className="absolute" style={{ top: '15%', left: '8%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(196,132,90,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div className="absolute" style={{ bottom: '10%', right: '6%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,132,60,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="relative z-10 flex flex-col items-center max-w-3xl">
          {/* Candle */}
          <div className="mb-10">
            <AnimatedCandle size="lg" />
          </div>

          {/* Eyebrow */}
          <p style={{ letterSpacing: '0.35em', fontSize: '0.72rem', fontWeight: 500, color: '#C4845A', marginBottom: 16, textTransform: 'uppercase' }}>
            Velas artesanales · Tenerife, Canarias
          </p>

          {/* Headline */}
          <h1
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(3.2rem, 9vw, 6.5rem)',
              fontWeight: 600,
              color: '#2C2416',
              lineHeight: 1.05,
              marginBottom: 24,
            }}
          >
            Cada producto tiene{' '}
            <em style={{ color: '#C4845A', fontStyle: 'italic' }}>su magia</em>
          </h1>

          {/* Subheadline */}
          <p style={{ fontSize: '1.1rem', color: '#7A6A55', fontWeight: 300, maxWidth: 500, lineHeight: 1.7, marginBottom: 40 }}>
            Velas escultóricas, joyeros, mikados y más — hechos a mano con cera natural en Tenerife.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-9 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: '#2C2416', color: '#F5F0E8' }}
            >
              <ShoppingBag size={18} />
              Comprar ahora
              <ArrowRight size={16} />
            </a>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-9 py-4 rounded-full font-semibold text-base transition-all hover:opacity-75"
              style={{ border: '2px solid #C4845A', color: '#C4845A' }}
            >
              <Instagram size={18} />
              Ver Instagram
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#C4845A" color="#C4845A" />)}
              <span style={{ fontSize: '0.85rem', color: '#7A6A55', marginLeft: 4 }}>+500 clientes felices</span>
            </div>
            <span style={{ color: '#C4845A', opacity: 0.4 }}>·</span>
            <div className="flex items-center gap-1.5" style={{ fontSize: '0.85rem', color: '#7A6A55' }}>
              <MapPin size={14} style={{ color: '#C4845A' }} />
              Disponibles en Tenerife y online
            </div>
          </div>
        </div>

        <a href="#nosotros" className="absolute bottom-8 flex flex-col items-center gap-1 opacity-40 hover:opacity-70 transition-opacity">
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#7A6A55' }}>Descubrir</span>
          <ChevronDown size={18} style={{ color: '#C4845A' }} className="animate-bounce" />
        </a>
      </section>

      {/* ══ SOBRE NOSOTROS ══════════════════════════════════════════════════ */}
      <section id="nosotros" style={{ backgroundColor: '#2C2416' }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">

          {/* Visual side */}
          <div className="reveal flex justify-center">
            <div className="relative" style={{ width: 280, height: 360 }}>
              {/* Glow */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(196,132,90,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />

              {/* Three candles */}
              <div className="absolute flex items-end gap-4" style={{ bottom: 40, left: '50%', transform: 'translateX(-50%)' }}>
                <AnimatedCandle size="sm" />
                <AnimatedCandle size="md" />
                <AnimatedCandle size="sm" />
              </div>

              {/* Floating chip */}
              <div
                className="absolute"
                style={{
                  top: 30, right: 10,
                  backgroundColor: '#C4845A', color: '#F5F0E8',
                  padding: '6px 14px', borderRadius: 999,
                  fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em',
                }}
              >
                Hecho a mano ✦
              </div>
              <div
                className="absolute"
                style={{
                  bottom: 20, left: 0,
                  backgroundColor: '#F5F0E8', color: '#2C2416',
                  padding: '6px 14px', borderRadius: 999,
                  fontSize: '0.72rem', fontWeight: 600,
                }}
              >
                Cera natural 🌿
              </div>
            </div>
          </div>

          {/* Text side */}
          <div className="reveal">
            <p style={{ letterSpacing: '0.35em', fontSize: '0.7rem', fontWeight: 500, color: '#C4845A', marginBottom: 16, textTransform: 'uppercase' }}>
              Nuestra historia
            </p>
            <h2
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 600,
                color: '#F5F0E8',
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              Una marca nacida en{' '}
              <em style={{ color: '#D4A878' }}>Tenerife</em>{' '}
              con magia propia
            </h2>
            <p style={{ color: '#A89880', fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 16 }}>
              MAGEC Velas nació del amor por los aromas y el diseño artesanal. Desde nuestra isla creamos velas escultóricas únicas — desde joyeros con sorpresa hasta carruseles de cera — con materiales naturales y mucho cariño.
            </p>
            <p style={{ color: '#A89880', fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 28 }}>
              Nos encontrás en mercados de Tenerife y en nuestra tienda online. Cada pieza es irrepetible, como las personas para las que las regalás.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-semibold group"
                style={{ color: '#D4A878' }}
              >
                Visitar tienda <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <span style={{ color: '#5A4A3A' }}>|</span>
              <a
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
                style={{ color: '#A89880' }}
              >
                <Instagram size={14} /> @magec.velas
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ PRODUCTOS ═══════════════════════════════════════════════════════ */}
      <section id="productos" style={{ backgroundColor: '#F5F0E8' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal text-center mb-14">
            <p style={{ letterSpacing: '0.35em', fontSize: '0.7rem', fontWeight: 500, color: '#C4845A', marginBottom: 12, textTransform: 'uppercase' }}>
              Lo que creamos
            </p>
            <h2
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                fontWeight: 600,
                color: '#2C2416',
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              Nuestros productos
            </h2>
            <p style={{ color: '#7A6A55', fontWeight: 300, maxWidth: 480, margin: '0 auto' }}>
              Desde velas con joyería escondida hasta mikados para tu hogar — todos hechos a mano.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className="product-card reveal rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  backgroundColor: '#FFF8F0',
                  border: '1px solid rgba(196,132,90,0.13)',
                  animationDelay: `${i * 70}ms`,
                }}
              >
                {/* Card image area */}
                <div
                  className="card-img relative transition-transform duration-500"
                  style={{ height: 180, backgroundColor: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
                >
                  <span style={{ fontSize: '4rem', filter: 'drop-shadow(0 4px 8px rgba(44,36,22,0.15))' }}>{p.emoji}</span>

                  {/* Overlay */}
                  <div
                    className="card-overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(44,36,22,0.45)' }}
                  >
                    <a
                      href={STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: '#C4845A', color: '#F5F0E8' }}
                    >
                      Ver producto
                    </a>
                  </div>

                  {p.badge && (
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide"
                      style={{ backgroundColor: '#C4845A', color: '#F5F0E8' }}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3
                      style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.15rem', fontWeight: 600, color: '#2C2416', lineHeight: 1.2 }}
                    >
                      {p.name}
                    </h3>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#C4845A', whiteSpace: 'nowrap' }}>{p.price}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: '#7A6A55', fontWeight: 300, marginBottom: 14, lineHeight: 1.5 }}>{p.subtitle}</p>
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.04em',
                          padding: '3px 10px', borderRadius: 999,
                          backgroundColor: 'rgba(196,132,90,0.1)', color: '#8A5A38',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="reveal text-center mt-12">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ backgroundColor: '#2C2416', color: '#F5F0E8' }}
            >
              <ShoppingBag size={18} />
              Ver catálogo completo
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ══ BENEFICIOS ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: '#EDE5D6' }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-14">
            <p style={{ letterSpacing: '0.35em', fontSize: '0.7rem', fontWeight: 500, color: '#C4845A', marginBottom: 12, textTransform: 'uppercase' }}>
              Por qué MAGEC
            </p>
            <h2
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 600,
                color: '#2C2416',
                lineHeight: 1.2,
              }}
            >
              El arte de hacer con alma
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="reveal p-6 rounded-2xl transition-all hover:shadow-md"
                style={{
                  backgroundColor: '#FFF8F0',
                  border: '1px solid rgba(196,132,90,0.1)',
                  animationDelay: `${i * 80}ms`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'rgba(196,132,90,0.12)' }}
                >
                  <b.icon size={20} style={{ color: '#C4845A' }} />
                </div>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem', fontWeight: 600, color: '#2C2416', marginBottom: 6 }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#7A6A55', fontWeight: 300, lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ COLECCIONES TEMÁTICAS ════════════════════════════════════════════ */}
      <section id="colecciones" style={{ backgroundColor: '#F5F0E8' }} className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-14">
            <p style={{ letterSpacing: '0.35em', fontSize: '0.7rem', fontWeight: 500, color: '#C4845A', marginBottom: 12, textTransform: 'uppercase' }}>
              Para cada momento
            </p>
            <h2
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 600,
                color: '#2C2416',
              }}
            >
              Colecciones especiales
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {COLLECTIONS.map((c, i) => (
              <a
                key={c.label}
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal group relative rounded-2xl overflow-hidden flex flex-col items-center justify-center py-10 px-6 text-center transition-transform hover:scale-[1.02]"
                style={{ background: c.bg, animationDelay: `${i * 90}ms`, minHeight: 140 }}
              >
                <span style={{ fontSize: '2.5rem', marginBottom: 8, display: 'block' }}>{c.emoji}</span>
                <span
                  style={{
                    fontFamily: '"Cormorant Garamond", serif',
                    fontSize: '1.1rem', fontWeight: 600,
                    color: 'rgba(245,240,232,0.95)', letterSpacing: '0.04em',
                  }}
                >
                  {c.label}
                </span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4"
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                >
                  <span style={{ fontSize: '0.75rem', color: 'rgba(245,240,232,0.8)', fontWeight: 500 }}>Ver en Instagram →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GALERÍA IG ══════════════════════════════════════════════════════ */}
      <section id="galeria" style={{ backgroundColor: '#2C2416' }} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal text-center mb-12">
            <p style={{ letterSpacing: '0.35em', fontSize: '0.7rem', fontWeight: 500, color: '#C4845A', marginBottom: 12, textTransform: 'uppercase' }}>
              @magec.velas
            </p>
            <h2
              style={{
                fontFamily: '"Cormorant Garamond", serif',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 600,
                color: '#F5F0E8',
                marginBottom: 10,
              }}
            >
              Seguinos en Instagram
            </h2>
            <p style={{ color: '#A89880', fontWeight: 300 }}>
              Nuevos productos, tips y colecciones exclusivas cada semana
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {GALLERY_ITEMS.map((item, i) => (
              <a
                key={i}
                href={IG_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="reveal group relative rounded-xl overflow-hidden"
                style={{ aspectRatio: '1/1', background: item.bg, animationDelay: `${i * 80}ms` }}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span style={{ fontSize: '3rem', opacity: 0.7 }}>{item.hint}</span>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(44,36,22,0.6)', fontWeight: 500, marginTop: 6 }}>{item.title}</span>
                </div>
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  style={{ backgroundColor: 'rgba(44,36,22,0.5)' }}
                >
                  <Instagram size={30} color="white" />
                </div>
              </a>
            ))}
          </div>

          <div className="reveal text-center">
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-base transition-all hover:opacity-75"
              style={{ border: '2px solid rgba(196,132,90,0.6)', color: '#D4A878' }}
            >
              <Instagram size={18} />
              Ver perfil completo
            </a>
          </div>
        </div>
      </section>

      {/* ══ CTA FINAL ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #EDE5D6 0%, #E0D0B8 50%, #D4C4A0 100%)' }}
      >
        <div className="max-w-2xl mx-auto reveal">
          <div className="mb-10 flex justify-center">
            <AnimatedCandle size="lg" />
          </div>
          <p style={{ letterSpacing: '0.35em', fontSize: '0.7rem', fontWeight: 500, color: '#C4845A', marginBottom: 16, textTransform: 'uppercase' }}>
            Llevalos a casa
          </p>
          <h2
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: 'clamp(2.2rem, 6vw, 4rem)',
              fontWeight: 600,
              color: '#2C2416',
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            Regalá magia,{' '}
            <em style={{ color: '#C4845A' }}>regalá MAGEC</em>
          </h2>
          <p style={{ color: '#7A6A55', fontWeight: 300, fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 36 }}>
            Pedidos online con envío a toda España. También en ferias y mercados de Tenerife.
            Para pedidos personalizados o al por mayor, escribinos por Instagram.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full font-semibold text-base transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: '#2C2416', color: '#F5F0E8' }}
            >
              <ShoppingBag size={18} />
              Ir a la tienda online
            </a>
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-9 py-4 rounded-full font-semibold text-base transition-all hover:opacity-75"
              style={{ border: '2px solid #C4845A', color: '#C4845A' }}
            >
              <Instagram size={18} />
              Escribir por Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer style={{ backgroundColor: '#1E160C', borderTop: '1px solid rgba(196,132,90,0.12)' }} className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Logo */}
            <div className="flex items-center gap-1.5">
              <span style={{ fontFamily: '"Cormorant Garamond",serif', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.08em', color: '#F5F0E8' }}>
                MAGEC
              </span>
              <span style={{ fontSize: '0.5rem', letterSpacing: '0.25em', color: '#C4845A', fontWeight: 500, alignSelf: 'flex-end', paddingBottom: 2 }}>
                VELAS
              </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap items-center justify-center gap-6">
              {NAV.map((l) => (
                <a key={l.href} href={l.href} className="text-sm hover:opacity-70 transition-opacity" style={{ color: '#7A6A55' }}>{l.label}</a>
              ))}
            </nav>

            {/* Social */}
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
              style={{ color: '#C4845A' }}
            >
              <Instagram size={16} />
              @magec.velas
            </a>
          </div>

          <div style={{ height: 1, backgroundColor: 'rgba(196,132,90,0.1)', marginBottom: 24 }} />

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ color: '#4A3A28' }}>
            <p>© 2026 MAGEC Velas · Tenerife, Canarias, España</p>
            <a href={STORE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 transition-colors" style={{ color: '#6A5A44' }}>
              magec-velas.sumaplastore.com
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
