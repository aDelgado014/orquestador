import React, { useEffect, useRef, useState } from 'react';
import { Instagram, ShoppingBag, ChevronDown, Star, Leaf, Heart, Package, ArrowRight, Menu, X, Flame } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Colecciones', href: '#colecciones' },
  { label: 'Por qué MAGEC', href: '#beneficios' },
  { label: 'Galería', href: '#galeria' },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Vela Ámbar & Vainilla',
    category: 'Aromática',
    price: '$2.800',
    gradient: 'from-amber-200 to-amber-400',
    accent: '#C8862A',
    description: 'Notas cálidas que envuelven cada rincón de tu hogar.',
    tags: ['Soja 100%', '45h quema'],
  },
  {
    id: 2,
    name: 'Bruma de Jazmín',
    category: 'Floral',
    price: '$2.600',
    gradient: 'from-rose-100 to-pink-200',
    accent: '#C96FA0',
    description: 'Suavidad floral para momentos de calma y bienestar.',
    tags: ['Natural', '40h quema'],
  },
  {
    id: 3,
    name: 'Bosque Nocturno',
    category: 'Maderas',
    price: '$3.100',
    gradient: 'from-stone-300 to-stone-500',
    accent: '#6B5A4A',
    description: 'Cedro, pachulí y musgo para una atmósfera profunda.',
    tags: ['Premium', '55h quema'],
  },
  {
    id: 4,
    name: 'Lluvia de Verano',
    category: 'Fresh',
    price: '$2.500',
    gradient: 'from-sky-100 to-teal-200',
    accent: '#3A8A8A',
    description: 'Frescura limpia y mineral, ideal para espacios de trabajo.',
    tags: ['Soja 100%', '38h quema'],
  },
  {
    id: 5,
    name: 'Canela & Naranja',
    category: 'Especiada',
    price: '$2.900',
    gradient: 'from-orange-200 to-orange-400',
    accent: '#D4621A',
    description: 'El calor del hogar en cada llama.',
    tags: ['Artesanal', '42h quema'],
  },
  {
    id: 6,
    name: 'Set Regalo MAGEC',
    category: 'Gift Set',
    price: '$7.500',
    gradient: 'from-yellow-100 to-amber-300',
    accent: '#B8860B',
    description: 'Tres velas cuidadosamente seleccionadas, ideal para regalar.',
    tags: ['3 velas', 'Con caja'],
  },
];

const BENEFITS = [
  {
    icon: Leaf,
    title: 'Cera de soja 100% natural',
    desc: 'Sin parafina, sin tóxicos. Velas limpias que cuidan tu hogar y el planeta.',
  },
  {
    icon: Flame,
    title: 'Aromas artesanales',
    desc: 'Cada fragancia es desarrollada en pequeños lotes con aceites esenciales de primera calidad.',
  },
  {
    icon: Heart,
    title: 'Hecho con amor',
    desc: 'Elaboradas a mano, una a una. Cada vela lleva la dedicación de quienes las crean.',
  },
  {
    icon: Package,
    title: 'Packaging sostenible',
    desc: 'Embalaje reciclable y reutilizable. Bonito por fuera, responsable por dentro.',
  },
];

const GALLERY_ITEMS = [
  { gradient: 'from-amber-100 via-amber-300 to-orange-400', delay: 0 },
  { gradient: 'from-rose-100 via-pink-200 to-rose-300', delay: 100 },
  { gradient: 'from-stone-200 via-amber-200 to-stone-400', delay: 200 },
  { gradient: 'from-orange-200 via-amber-300 to-yellow-300', delay: 300 },
  { gradient: 'from-cream-100 via-amber-100 to-orange-200', delay: 400 },
  { gradient: 'from-yellow-100 via-amber-200 to-amber-400', delay: 500 },
];

// ─── Components ──────────────────────────────────────────────────────────────

function CandleIcon() {
  return (
    <div className="relative inline-flex flex-col items-center">
      {/* Smoke */}
      <div className="relative w-1 h-6 flex flex-col items-center justify-end overflow-visible">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="smoke-particle absolute w-1 h-1 rounded-full bg-amber-300/40"
            style={{ animationDelay: `${i * 1}s`, bottom: `${i * 6}px` }}
          />
        ))}
      </div>
      {/* Flame */}
      <div className="flame relative -mb-1 z-10">
        <div
          className="w-4 h-6 rounded-t-full rounded-b-sm candle-glow"
          style={{
            background: 'radial-gradient(ellipse at 50% 80%, #FFF7AA 0%, #FFCC33 40%, #FF8C00 80%, transparent 100%)',
          }}
        />
      </div>
      {/* Wick */}
      <div className="w-0.5 h-2 bg-stone-800 -mt-1 z-20" />
      {/* Body */}
      <div
        className="w-10 h-16 rounded-b-sm rounded-t-sm"
        style={{ background: 'linear-gradient(160deg, #FDF6EC 0%, #E4C99A 50%, #C8A06A 100%)' }}
      />
    </div>
  );
}

function useIntersectionObserver(selector: string) {
  useEffect(() => {
    const els = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector]);
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useIntersectionObserver('.fade-in-up');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#FDF6EC', color: '#2C1A0E' }}>

      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(253,246,236,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(200,134,42,0.15)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 700, color: '#2C1A0E', letterSpacing: '0.05em' }}>
              MAGEC
            </span>
            <span style={{ fontSize: '0.65rem', color: '#C8862A', letterSpacing: '0.2em', fontWeight: 500, marginTop: '2px' }}>VELAS</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium transition-colors hover:text-amber-600" style={{ color: '#4A2E1A' }}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all hover:opacity-80"
              style={{ border: '1.5px solid #C8862A', color: '#C8862A' }}
            >
              <Instagram size={15} />
              Instagram
            </a>
            <a
              href="#colecciones"
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#C8862A', color: '#FDF6EC' }}
            >
              <ShoppingBag size={15} />
              Tienda
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen((v) => !v)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pb-6 pt-2 flex flex-col gap-4" style={{ backgroundColor: 'rgba(253,246,236,0.97)', borderTop: '1px solid rgba(200,134,42,0.15)' }}>
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-base font-medium" style={{ color: '#4A2E1A' }} onClick={() => setMenuOpen(false)}>
                {l.label}
              </a>
            ))}
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: '#C8862A' }}
            >
              <Instagram size={16} /> Instagram
            </a>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #FDF6EC 0%, #F5E9D4 50%, #EDD9B8 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #E4A84B 0%, transparent 70%)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #C8862A 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col items-center max-w-3xl">
          <div className="mb-8">
            <CandleIcon />
          </div>

          <p className="uppercase tracking-[0.4em] text-xs font-medium mb-4" style={{ color: '#C8862A' }}>
            Velas artesanales · Buenos Aires
          </p>

          <h1
            className="mb-6 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, color: '#2C1A0E' }}
          >
            Ilumina cada{' '}
            <span className="italic" style={{ color: '#C8862A' }}>
              momento
            </span>
          </h1>

          <p className="text-lg mb-10 max-w-xl leading-relaxed" style={{ color: '#7A6A5A', fontWeight: 300 }}>
            Velas de soja 100% natural, aromas únicos hechos a mano. Cada llama cuenta una historia.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <a
              href="#colecciones"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 active:scale-95 shadow-lg"
              style={{ backgroundColor: '#2C1A0E', color: '#FDF6EC' }}
            >
              <ShoppingBag size={18} />
              Ver colección
            </a>
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-80"
              style={{ border: '2px solid #C8862A', color: '#C8862A', backgroundColor: 'transparent' }}
            >
              <Instagram size={18} />
              Seguirnos
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex items-center gap-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#C8862A" color="#C8862A" />
              ))}
            </div>
            <span className="text-sm" style={{ color: '#7A6A5A' }}>
              +500 clientes satisfechos
            </span>
            <span style={{ color: '#C8862A', opacity: 0.5 }}>·</span>
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline"
              style={{ color: '#7A6A5A' }}
            >
              @magec.velas
            </a>
          </div>
        </div>

        {/* Scroll cue */}
        <a href="#nosotros" className="absolute bottom-8 flex flex-col items-center gap-1 opacity-50 hover:opacity-80 transition-opacity">
          <span className="text-xs tracking-widest uppercase" style={{ color: '#7A6A5A' }}>Descubrir</span>
          <ChevronDown size={18} style={{ color: '#C8862A' }} className="animate-bounce" />
        </a>
      </section>

      {/* ── Sobre nosotros ── */}
      <section id="nosotros" className="py-24 px-6" style={{ backgroundColor: '#2C1A0E' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          {/* Candle visual */}
          <div className="fade-in-up flex items-center justify-center">
            <div className="relative w-56 h-72 flex flex-col items-center justify-end">
              {/* Glow background */}
              <div
                className="absolute inset-0 rounded-full opacity-20 candle-glow"
                style={{ background: 'radial-gradient(ellipse at 50% 60%, #E4A84B 0%, transparent 70%)' }}
              />
              {/* Large candle */}
              <div className="relative flex flex-col items-center">
                <div className="flame">
                  <div
                    className="w-8 h-12 rounded-t-full rounded-b-sm mb-1"
                    style={{
                      background: 'radial-gradient(ellipse at 50% 80%, #FFF7AA 0%, #FFCC33 40%, #FF8C00 80%, transparent 100%)',
                      filter: 'drop-shadow(0 0 12px #E4A84B)',
                    }}
                  />
                </div>
                <div className="w-1 h-4 rounded" style={{ backgroundColor: '#5C3A1E' }} />
                <div
                  className="w-28 rounded-t-sm rounded-b-lg shadow-2xl"
                  style={{
                    height: '160px',
                    background: 'linear-gradient(160deg, #FDF6EC 0%, #E4C99A 40%, #C8A06A 100%)',
                  }}
                />
              </div>

              {/* Floating tags */}
              <div
                className="absolute top-4 -right-8 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg"
                style={{ backgroundColor: '#C8862A', color: '#FDF6EC' }}
              >
                100% soja
              </div>
              <div
                className="absolute bottom-16 -left-8 px-3 py-1.5 rounded-full text-xs font-medium shadow-lg"
                style={{ backgroundColor: '#FDF6EC', color: '#2C1A0E' }}
              >
                Artesanal
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="fade-in-up">
            <p className="uppercase tracking-[0.4em] text-xs font-medium mb-4" style={{ color: '#C8862A' }}>
              Nuestra historia
            </p>
            <h2
              className="mb-6 leading-tight"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#FDF6EC' }}
            >
              Nació de la pasión por crear ambientes
              <span className="italic" style={{ color: '#E4A84B' }}> únicos</span>
            </h2>
            <p className="mb-5 leading-relaxed font-light" style={{ color: '#B8A898', fontSize: '1.05rem' }}>
              MAGEC Velas surgió de un amor profundo por los aromas y los espacios cargados de intención. Cada vela es elaborada a mano, con ingredientes naturales seleccionados para crear experiencias sensoriales que transforman cualquier ambiente.
            </p>
            <p className="mb-8 leading-relaxed font-light" style={{ color: '#B8A898', fontSize: '1.05rem' }}>
              Creemos que una vela no es solo luz: es presencia, calma, ritual. Por eso ponemos todo nuestro cuidado en cada paso del proceso.
            </p>
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold group"
              style={{ color: '#E4A84B' }}
            >
              Seguinos en Instagram
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Colecciones ── */}
      <section id="colecciones" className="py-24 px-6" style={{ backgroundColor: '#FDF6EC' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <p className="uppercase tracking-[0.4em] text-xs font-medium mb-3" style={{ color: '#C8862A' }}>Nuestros productos</p>
            <h2
              className="mb-4"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#2C1A0E' }}
            >
              Colecciones
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: '#7A6A5A', fontWeight: 300 }}>
              Cada fragancia fue pensada para acompañar un momento diferente de tu día.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <div
                key={p.id}
                className="product-card fade-in-up rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
                style={{ animationDelay: `${i * 80}ms`, backgroundColor: '#FFF8F0', border: '1px solid rgba(200,134,42,0.12)' }}
              >
                {/* Visual */}
                <div className={`relative h-48 bg-gradient-to-br ${p.gradient} flex items-end justify-center overflow-hidden`}>
                  {/* Candle silhouette */}
                  <div className="mb-4 flex flex-col items-center opacity-90">
                    <div className="flame">
                      <div
                        className="w-3 h-5 rounded-t-full rounded-b-sm"
                        style={{ background: 'radial-gradient(ellipse at 50% 80%, #FFF7AA 0%, #FFCC33 40%, #FF8C00 80%, transparent 100%)' }}
                      />
                    </div>
                    <div className="w-0.5 h-2 rounded" style={{ backgroundColor: '#5C3A1E' }} />
                    <div
                      className="w-14 h-20 rounded-t-sm rounded-b-md shadow-md"
                      style={{ backgroundColor: 'rgba(253,246,236,0.85)' }}
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div
                    className="product-overlay absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300"
                    style={{ backgroundColor: 'rgba(44,26,14,0.5)' }}
                  >
                    <span className="px-5 py-2.5 rounded-full text-sm font-semibold" style={{ backgroundColor: '#C8862A', color: '#FDF6EC' }}>
                      Ver producto
                    </span>
                  </div>

                  {/* Category badge */}
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                    style={{ backgroundColor: 'rgba(44,26,14,0.7)', color: '#FDF6EC' }}
                  >
                    {p.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-base leading-tight" style={{ color: '#2C1A0E', fontFamily: 'Playfair Display, serif' }}>
                      {p.name}
                    </h3>
                    <span className="text-base font-bold ml-2 shrink-0" style={{ color: '#C8862A' }}>{p.price}</span>
                  </div>
                  <p className="text-sm mb-4 font-light leading-relaxed" style={{ color: '#7A6A5A' }}>{p.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: 'rgba(200,134,42,0.1)', color: '#9B6520' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 fade-in-up">
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 active:scale-95 shadow-md"
              style={{ backgroundColor: '#2C1A0E', color: '#FDF6EC' }}
            >
              <ShoppingBag size={18} />
              Ver catálogo completo
            </a>
          </div>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section id="beneficios" className="py-24 px-6" style={{ backgroundColor: '#F5E9D4' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 fade-in-up">
            <p className="uppercase tracking-[0.4em] text-xs font-medium mb-3" style={{ color: '#C8862A' }}>
              Por qué elegirnos
            </p>
            <h2
              style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#2C1A0E' }}
            >
              El arte de hacer velas con alma
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="fade-in-up flex gap-5 p-6 rounded-2xl transition-all hover:shadow-md"
                style={{ backgroundColor: '#FDF6EC', border: '1px solid rgba(200,134,42,0.1)', animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(200,134,42,0.12)' }}
                >
                  <b.icon size={22} style={{ color: '#C8862A' }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1.5" style={{ color: '#2C1A0E', fontFamily: 'Playfair Display, serif', fontSize: '1.05rem' }}>
                    {b.title}
                  </h3>
                  <p className="text-sm leading-relaxed font-light" style={{ color: '#7A6A5A' }}>{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Galería Instagram ── */}
      <section id="galeria" className="py-24 px-6" style={{ backgroundColor: '#FDF6EC' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 fade-in-up">
            <p className="uppercase tracking-[0.4em] text-xs font-medium mb-3" style={{ color: '#C8862A' }}>
              @magec.velas
            </p>
            <h2
              className="mb-4"
              style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#2C1A0E' }}
            >
              Nuestra comunidad
            </h2>
            <p style={{ color: '#7A6A5A', fontWeight: 300 }}>
              Seguinos en Instagram y sé parte del mundo MAGEC
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
            {GALLERY_ITEMS.map((item, i) => (
              <a
                key={i}
                href="https://www.instagram.com/magec.velas"
                target="_blank"
                rel="noopener noreferrer"
                className="fade-in-up group relative aspect-square rounded-xl overflow-hidden"
                style={{ animationDelay: `${item.delay}ms` }}
              >
                <div className={`w-full h-full bg-gradient-to-br ${item.gradient}`} />
                {/* Candle silhouette overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-4 rounded-t-full rounded-b-sm" style={{ backgroundColor: 'rgba(255,200,50,0.8)' }} />
                    <div className="w-0.5 h-2" style={{ backgroundColor: '#5C3A1E' }} />
                    <div className="w-8 h-14 rounded-t-sm rounded-b-md" style={{ backgroundColor: 'rgba(253,246,236,0.6)' }} />
                  </div>
                </div>
                {/* Instagram hover */}
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ backgroundColor: 'rgba(44,26,14,0.45)' }}
                >
                  <Instagram size={28} color="white" />
                </div>
              </a>
            ))}
          </div>

          <div className="text-center fade-in-up">
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-80"
              style={{ border: '2px solid #C8862A', color: '#C8862A' }}
            >
              <Instagram size={18} />
              Ver Instagram completo
            </a>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-24 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #2C1A0E 0%, #4A2E1A 50%, #2C1A0E 100%)' }}
      >
        <div className="max-w-2xl mx-auto fade-in-up">
          <div className="mb-8 flex justify-center">
            <CandleIcon />
          </div>
          <h2
            className="mb-4 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: '#FDF6EC' }}
          >
            Llevá MAGEC a tu hogar
          </h2>
          <p className="mb-10 font-light text-lg" style={{ color: '#B8A898' }}>
            Hacemos envíos a todo el país. También podés encontrarnos en ferias y eventos. Escribinos por Instagram para pedidos personalizados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#C8862A', color: '#FDF6EC' }}
            >
              <Instagram size={18} />
              Comprar por Instagram
            </a>
            <a
              href="#colecciones"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-80"
              style={{ border: '2px solid rgba(253,246,236,0.4)', color: '#FDF6EC' }}
            >
              Ver colección
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-10 px-6 text-center"
        style={{ backgroundColor: '#1E0F06', borderTop: '1px solid rgba(200,134,42,0.15)' }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.4rem', fontWeight: 700, color: '#FDF6EC', letterSpacing: '0.05em' }}>
              MAGEC <span style={{ color: '#C8862A', fontSize: '0.6em', letterSpacing: '0.25em' }}>VELAS</span>
            </span>

            <nav className="flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="text-sm transition-colors hover:text-amber-400" style={{ color: '#7A6A5A' }}>
                  {l.label}
                </a>
              ))}
            </nav>

            <a
              href="https://www.instagram.com/magec.velas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: '#C8862A' }}
            >
              <Instagram size={16} />
              @magec.velas
            </a>
          </div>

          <div style={{ height: '1px', backgroundColor: 'rgba(200,134,42,0.1)', marginBottom: '1.5rem' }} />

          <p className="text-xs" style={{ color: '#4A2E1A' }}>
            © 2026 MAGEC Velas · Velas artesanales · Buenos Aires, Argentina
          </p>
        </div>
      </footer>
    </div>
  );
}
