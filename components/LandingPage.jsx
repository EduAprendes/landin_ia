'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Play, MessageCircle, Zap, Cloud, Code2, Check, CheckCircle2,
  ChevronRight, ChevronLeft, X, Clock, TrendingDown, Sparkles, Calendar,
  Filter, Moon, HelpCircle, Building2, User, Globe, ArrowRight, Bot,
  Puzzle,
} from 'lucide-react';

/* lucide-react ya no incluye íconos de marcas (Instagram, etc.) */
function Instagram({ size = 24, strokeWidth = 2, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Datos de contenido                                                 */
/* ------------------------------------------------------------------ */

const WHATSAPP_NUMBER = '584121234567'; // TODO: reemplazar por el número real del negocio
const ADVISOR_MESSAGE = 'Hola, quiero hablar con un asesor sobre la IA para WhatsApp e Instagram.';

const PLANS = [
  {
    id: 'pyme',
    name: 'Plan Pyme',
    tagline: 'Para empezar a automatizar sin fricción',
    price: 49,
    setupFee: 150,
    setupNote: 'Configuración de Meta Developer API + entrenamiento inicial en 48h.',
    volume: 'Hasta 50 mensajes / día',
    features: [
      'Un canal: WhatsApp o Instagram',
      'Respuestas a preguntas frecuentes',
      'Captura y calificación de leads',
      'Reporte semanal por correo',
    ],
    highlight: false,
  },
  {
    id: 'escala',
    name: 'Plan Escala',
    tagline: 'El más elegido por negocios en crecimiento',
    price: 89,
    setupFee: 250,
    setupNote: 'Configuración de Meta Developer API + entrenamiento con tu base de datos en 72h.',
    volume: 'Hasta 150 mensajes / día',
    features: [
      'WhatsApp e Instagram al mismo tiempo',
      'Agendamiento automático de citas',
      'Catálogo de productos integrado',
      'Panel en vivo + reporte semanal',
    ],
    highlight: true,
  },
  {
    id: 'prioritario',
    name: 'Plan Prioritario',
    tagline: 'Para operaciones de alto volumen',
    price: 149,
    setupFee: 400,
    setupNote: 'Integración a medida + entrenamiento profundo con tu base de datos en 5 días.',
    volume: '+150 mensajes / día · sin límite',
    features: [
      'WhatsApp e Instagram sin límite',
      'Integraciones a medida (CRM, ERP)',
      'Soporte prioritario 24/7',
      'Optimización mensual con tu equipo',
    ],
    highlight: false,
  },
];

const BELIEFS = [
  {
    icon: Bot,
    belief: 'Los bots suenan robóticos y la gente se molesta.',
    realityIcon: Sparkles,
    reality:
      'La IA lee el contexto real de cada conversación, entiende modismos locales y responde como tu mejor vendedor humano — no como un menú de opciones.',
  },
  {
    icon: Cloud,
    belief: 'Si se va la luz o el internet en mi negocio, la IA deja de funcionar.',
    realityIcon: Zap,
    reality:
      'Toda la infraestructura corre en la nube, sobre la Meta Cloud API. Tu negocio sigue vendiendo mientras duermes, mientras no hay luz o no tienes señal.',
  },
  {
    icon: Puzzle,
    belief: 'Necesito una plataforma costosa con una interfaz difícil de aprender.',
    realityIcon: Code2,
    reality:
      'Conexión directa a código, sin capas de software que aprender ni mensualidades infladas por herramientas no-code que nunca terminas de dominar.',
  },
];

const CHANNEL_OPTIONS = ['WhatsApp', 'Instagram', 'Ambos'];
const VOLUME_OPTIONS = ['Menos de 20', '20 – 50', '50 – 150', '+150 · Cliente Prioritario'];
const OBJECTIVE_OPTIONS = [
  { label: 'Responder preguntas frecuentes', icon: HelpCircle },
  { label: 'Agendar citas o reservas', icon: Calendar },
  { label: 'Filtrar y calificar clientes', icon: Filter },
  { label: 'Atender fuera de horario / de noche', icon: Moon },
];
const YES_NO_OPTIONS = ['Sí', 'No'];
const AFTER_HOURS_OPTIONS = ['Yo mismo', 'Alguien de mi equipo', 'Nadie, se quedan sin responder'];
const LOST_CUSTOMER_OPTIONS = ['Sí', 'Seguramente', 'No sé'];

const TOTAL_STEPS = 5;

/* ------------------------------------------------------------------ */
/*  Utilidades y hooks                                                 */
/* ------------------------------------------------------------------ */

function formatUSD(n) {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function useCountUp(target, duration = 550) {
  const [display, setDisplay] = useState(target);
  const prevTarget = useRef(target);

  useEffect(() => {
    const start = prevTarget.current;
    const end = target;
    const t0 = performance.now();
    let frame;
    function step(now) {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + (end - start) * eased);
      if (p < 1) {
        frame = requestAnimationFrame(step);
      } else {
        prevTarget.current = end;
      }
    }
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return display;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ------------------------------------------------------------------ */
/*  Piezas visuales pequeñas                                           */
/* ------------------------------------------------------------------ */

function Eyebrow({ children }) {
  return (
    <span className="eyebrow">
      <span className="eyebrow-dot" />
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, className = '', icon: Icon = ArrowRight, type = 'button' }) {
  return (
    <button type={type} onClick={onClick} className={`btn-coral ${className}`}>
      <span>{children}</span>
      <Icon size={18} strokeWidth={2.25} />
    </button>
  );
}

function ChoiceCard({ label, icon: Icon, selected, onClick, sub }) {
  return (
    <button type="button" onClick={onClick} className={`choice-card ${selected ? 'choice-card-active' : ''}`}>
      {Icon && (
        <span className={`choice-card-icon ${selected ? 'choice-card-icon-active' : ''}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      )}
      <span className="choice-card-text">
        <span className="choice-card-label">{label}</span>
        {sub && <span className="choice-card-sub">{sub}</span>}
      </span>
      {selected && (
        <span className="choice-card-check">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Problema cuantificado vs. solución cuantificada                    */
/* ------------------------------------------------------------------ */

const PROBLEM_STATS = [
  { number: '3h 40min', desc: 'tiempo promedio en responder un WhatsApp de negocio' },
  { number: '67%', desc: 'de los clientes no vuelve a escribir tras 1 hora sin respuesta' },
  { number: '1 de 3', desc: 'mensajes se pierde fuera de tu horario de atención' },
];

const SOLUTION_STATS = [
  { number: '<3 seg', desc: 'tiempo de respuesta, sin importar la hora' },
  { number: '100%', desc: 'de tus mensajes atendidos, incluso de madrugada' },
  { number: '24/7', desc: 'funcionando aunque se vaya la luz o no tengas datos' },
];

function ProblemSolutionStats() {
  return (
    <div>
      <div className="stats-compare">
        <div className="stats-col">
          <p className="stats-col-label">Sin respuesta a tiempo</p>
          {PROBLEM_STATS.map((s) => (
            <div className="stats-row" key={s.desc}>
              <span className="stats-number stats-number-problem">{s.number}</span>
              <span className="stats-desc">{s.desc}</span>
            </div>
          ))}
        </div>

        <div className="stats-divider" aria-hidden="true">
          <ArrowRight size={16} strokeWidth={2.4} />
        </div>

        <div className="stats-col stats-col-solution">
          <p className="stats-col-label stats-col-label-coral">Con Respondia</p>
          {SOLUTION_STATS.map((s) => (
            <div className="stats-row" key={s.desc}>
              <span className="stats-number stats-number-coral">{s.number}</span>
              <span className="stats-desc">{s.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="stats-caption">Cifras de referencia del sector · tu pérdida real la calculas abajo con tus propios números.</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mockup de teléfono con conversación sin responder                  */
/* ------------------------------------------------------------------ */

function PhoneMockup() {
  return (
    <div className="phone-stage">
      <div className="ig-float">
        <div className="ig-float-header">
          <Instagram size={13} strokeWidth={2.2} />
          <span>Instagram · DM</span>
        </div>
        <p className="ig-float-text">“Hola! Vi el vestido azul, ¿aún hay talla M? 👗”</p>
        <span className="ig-float-time">Sin leer · 09:14</span>
      </div>

      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          <div className="phone-topbar">
            <div className="phone-contact">
              <span className="phone-avatar">
                <MessageCircle size={15} strokeWidth={2.2} />
              </span>
              <span>
                <span className="phone-contact-name">Cliente nuevo</span>
                <span className="phone-contact-status">últ. vez hoy 08:52</span>
              </span>
            </div>
          </div>

          <div className="phone-chat">
            <div className="chat-bubble-in">
              Hola buenas, ¿tienen envíos a Maracaibo?
              <span className="chat-time">10:32</span>
            </div>
            <div className="chat-bubble-in">
              Vi su catálogo en el estado, quisiera precios 🙏
              <span className="chat-time">10:41</span>
            </div>
            <div className="chat-bubble-in chat-bubble-fade">
              ¿Siguen ahí? Voy a ver en otra tienda...
              <span className="chat-time">11:14</span>
            </div>
          </div>

          <div className="phone-badge">
            <Clock size={12} strokeWidth={2.4} />
            42 min sin respuesta
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Calculadora de fuga de dinero (elemento distintivo)                 */
/* ------------------------------------------------------------------ */

function LossCalculator({ onUseInDiagnosis }) {
  const [price, setPrice] = useState(25);
  const [messages, setMessages] = useState(40);

  const lossRate = 0.12; // tasa promedio de abandono estimada por demora en responder
  const lostMessagesPerMonth = Math.round(messages * 30 * lossRate);
  const monthlyLoss = Math.round(lostMessagesPerMonth * price);
  const animatedLoss = useCountUp(monthlyLoss);

  const pricePct = ((price - 5) / (500 - 5)) * 100;
  const messagesPct = ((messages - 5) / (300 - 5)) * 100;

  const cheapestPlan = PLANS[0].price;
  const multiple = monthlyLoss > 0 ? (monthlyLoss / cheapestPlan).toFixed(1) : '0';

  return (
    <div className="calc-card">
      <div className="calc-header">
        <span className="calc-header-icon">
          <TrendingDown size={16} strokeWidth={2.3} />
        </span>
        <div>
          <p className="calc-title">Calculadora de fuga de clientes</p>
          <p className="calc-subtitle">Estima cuánto se te está escapando cada mes</p>
        </div>
      </div>

      <div className="calc-sliders">
        <label className="calc-field">
          <span className="calc-field-row">
            <span>Precio promedio de tu producto/servicio</span>
            <span className="calc-field-value">${price} USD</span>
          </span>
          <input
            type="range"
            min={5}
            max={500}
            step={5}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="range-coral"
            style={{
              background: `linear-gradient(to right, #FF5E3A 0%, #FF5E3A ${pricePct}%, #E5E7EB ${pricePct}%, #E5E7EB 100%)`,
            }}
          />
        </label>

        <label className="calc-field">
          <span className="calc-field-row">
            <span>Mensajes que recibes al día</span>
            <span className="calc-field-value">{messages}</span>
          </span>
          <input
            type="range"
            min={5}
            max={300}
            step={5}
            value={messages}
            onChange={(e) => setMessages(Number(e.target.value))}
            className="range-coral"
            style={{
              background: `linear-gradient(to right, #FF5E3A 0%, #FF5E3A ${messagesPct}%, #E5E7EB ${messagesPct}%, #E5E7EB 100%)`,
            }}
          />
        </label>
      </div>

      <div className="calc-result">
        <div className="calc-result-drip" aria-hidden="true">
          <span className="drip drip-1" />
          <span className="drip drip-2" />
          <span className="drip drip-3" />
        </div>
        <p className="calc-result-label">Pierdes aproximadamente</p>
        <p className="calc-result-value">
          <span className="calc-result-currency">$</span>
          {formatUSD(animatedLoss)}
          <span className="calc-result-unit">/mes</span>
        </p>
        <p className="calc-result-note">
          ≈ {formatUSD(lostMessagesPerMonth)} clientes al mes que escriben y no reciben respuesta a tiempo.
        </p>
        {monthlyLoss > 0 && (
          <p className="calc-result-compare">
            Eso es <strong>{multiple}×</strong> lo que cuesta el plan más económico de la solución.
          </p>
        )}
      </div>

      {onUseInDiagnosis && (
        <button type="button" className="calc-cta" onClick={onUseInDiagnosis}>
          Quiero dejar de perder esto
          <ArrowRight size={16} strokeWidth={2.25} />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjetas de creencias limitantes                                    */
/* ------------------------------------------------------------------ */

function BeliefCard({ item, index }) {
  const [ref, inView] = useInView(0.15);
  const BeliefIcon = item.icon;
  const RealityIcon = item.realityIcon;

  return (
    <div
      ref={ref}
      className="belief-card"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 600ms ease ${index * 120}ms, transform 600ms ease ${index * 120}ms`,
      }}
    >
      <div className="belief-row belief-row-muted">
        <span className="belief-icon belief-icon-muted">
          <BeliefIcon size={16} strokeWidth={2} />
        </span>
        <div>
          <span className="belief-chip belief-chip-muted">Creencia</span>
          <p className="belief-text belief-text-muted">“{item.belief}”</p>
        </div>
      </div>

      <div className="belief-divider" />

      <div className="belief-row">
        <span className="belief-icon belief-icon-coral">
          <RealityIcon size={16} strokeWidth={2.1} />
        </span>
        <div>
          <span className="belief-chip belief-chip-coral">Realidad</span>
          <p className="belief-text">{item.reality}</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjetas de planes                                                  */
/* ------------------------------------------------------------------ */

function PricingCard({ plan, index, onSelect }) {
  const [ref, inView] = useInView(0.15);

  return (
    <div
      ref={ref}
      className={`plan-card ${plan.highlight ? 'plan-card-highlight' : ''}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(18px)',
        transition: `opacity 600ms ease ${index * 110}ms, transform 600ms ease ${index * 110}ms`,
      }}
    >
      {plan.highlight && <span className="plan-tag">Más elegido</span>}

      <p className="plan-name">{plan.name}</p>
      <p className="plan-tagline">{plan.tagline}</p>

      <p className="plan-price">
        <span className="plan-price-currency">$</span>
        {plan.price}
        <span className="plan-price-unit">/mes</span>
      </p>
      <p className="plan-setup">
        + ${plan.setupFee} implementación (pago único)
      </p>
      <p className="plan-setup-note">{plan.setupNote}</p>

      <p className="plan-volume">{plan.volume}</p>

      <ul className="plan-features">
        {plan.features.map((f) => (
          <li key={f}>
            <Check size={15} strokeWidth={2.5} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelect(plan.id)}
        className={plan.highlight ? 'btn-coral plan-cta' : 'btn-outline plan-cta'}
      >
        Seleccionar plan y diagnosticar
        <ArrowRight size={16} strokeWidth={2.25} />
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Formulario multi-paso                                               */
/* ------------------------------------------------------------------ */

function DiagnosisModal({ open, onClose, initialPlanId }) {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    company: '',
    contact: '',
    handle: '',
    channel: '',
    volume: '',
    objective: '',
    hasWebsite: '',
    hasAds: '',
    adsVolume: '',
    afterHoursResponder: '',
    lostCustomer: '',
  });

  useEffect(() => {
    if (open) {
      setStep(1);
      setSubmitted(false);
      setForm((f) => ({
        ...f,
        company: '',
        contact: '',
        handle: '',
        channel: '',
        volume: '',
        objective: '',
        hasWebsite: '',
        hasAds: '',
        adsVolume: '',
        afterHoursResponder: '',
        lostCustomer: '',
      }));
    }
  }, [open]);

  const planName = useMemo(() => PLANS.find((p) => p.id === initialPlanId)?.name, [initialPlanId]);

  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const canAdvance = {
    1: form.company.trim().length > 0 && form.contact.trim().length > 0,
    2: form.channel !== '' && form.volume !== '',
    3: form.objective !== '',
    4:
      form.hasWebsite !== '' &&
      form.hasAds !== '' &&
      (form.hasAds !== 'Sí' || form.adsVolume.trim().length > 0) &&
      form.afterHoursResponder !== '' &&
      form.lostCustomer !== '',
    5: true,
  }[step];

  const handleNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSend = () => {
    const lines = [
      `Hola, soy ${form.contact} de ${form.company}. Quiero automatizar mi atención con IA.`,
      '',
      `Plan de interés: ${planName || 'Aún no decido, quiero un diagnóstico'}`,
      `Canal principal: ${form.channel}`,
      `Volumen diario: ${form.volume}`,
      `Objetivo principal: ${form.objective}`,
      `¿Página web o tienda en línea?: ${form.hasWebsite}`,
      `¿Ya hace ads?: ${form.hasAds}`,
      ...(form.hasAds === 'Sí' ? [`Mensajes con campañas activas: ${form.adsVolume}`] : []),
      `Quién responde fuera de horario: ${form.afterHoursResponder}`,
      `¿Se le ha ido algún cliente por no responder a tiempo?: ${form.lostCustomer}`,
      `Instagram/Web: ${form.handle || 'No indicado'}`,
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-shell" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
          <X size={18} strokeWidth={2.2} />
        </button>

        {!submitted ? (
          <>
            <div className="modal-head">
              <p className="modal-eyebrow">Diagnóstico rápido</p>
              <p className="modal-step-label">Paso {step} de {TOTAL_STEPS}</p>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            {planName && (
              <div className="modal-plan-badge">
                Plan seleccionado: <strong>&nbsp;{planName}</strong>
              </div>
            )}

            <div className="modal-slider-viewport">
              <div
                className="modal-slider-track"
                style={{ transform: `translateX(-${(step - 1) * 20}%)` }}
              >
                {/* Paso 1 */}
                <div className="modal-step">
                  <h3 className="modal-step-title">Cuéntanos de tu negocio</h3>
                  <p className="modal-step-desc">Lo básico para poder ubicarte y hablar tu idioma.</p>

                  <label className="text-field">
                    <span className="text-field-icon"><Building2 size={16} strokeWidth={2} /></span>
                    <input
                      type="text"
                      placeholder="Nombre de la empresa"
                      value={form.company}
                      onChange={(e) => set('company')(e.target.value)}
                    />
                  </label>

                  <label className="text-field">
                    <span className="text-field-icon"><User size={16} strokeWidth={2} /></span>
                    <input
                      type="text"
                      placeholder="Nombre de contacto"
                      value={form.contact}
                      onChange={(e) => set('contact')(e.target.value)}
                    />
                  </label>

                  <label className="text-field">
                    <span className="text-field-icon"><Globe size={16} strokeWidth={2} /></span>
                    <input
                      type="text"
                      placeholder="Instagram o sitio web (opcional)"
                      value={form.handle}
                      onChange={(e) => set('handle')(e.target.value)}
                    />
                  </label>
                </div>

                {/* Paso 2 */}
                <div className="modal-step">
                  <h3 className="modal-step-title">Diagnóstico de volumen</h3>
                  <p className="modal-step-desc">¿Por dónde y cuánto te escriben hoy?</p>

                  <p className="modal-group-label">Canal principal</p>
                  <div className="choice-grid choice-grid-3">
                    {CHANNEL_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt}
                        label={opt}
                        selected={form.channel === opt}
                        onClick={() => set('channel')(opt)}
                      />
                    ))}
                  </div>

                  <p className="modal-group-label modal-group-label-spaced">Volumen diario de mensajes</p>
                  <div className="choice-grid choice-grid-2">
                    {VOLUME_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt}
                        label={opt}
                        selected={form.volume === opt}
                        onClick={() => set('volume')(opt)}
                      />
                    ))}
                  </div>
                </div>

                {/* Paso 3 */}
                <div className="modal-step">
                  <h3 className="modal-step-title">Caso de uso</h3>
                  <p className="modal-step-desc">¿Qué es lo primero que quieres resolver?</p>

                  <div className="choice-grid choice-grid-1">
                    {OBJECTIVE_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt.label}
                        label={opt.label}
                        icon={opt.icon}
                        selected={form.objective === opt.label}
                        onClick={() => set('objective')(opt.label)}
                      />
                    ))}
                  </div>
                </div>

                {/* Paso 4 */}
                <div className="modal-step">
                  <h3 className="modal-step-title">Madurez tecnológica</h3>
                  <p className="modal-step-desc">Así sabemos con qué material vamos a entrenar la IA.</p>

                  <p className="modal-group-label">¿Tu negocio cuenta con página web o tienda en línea?</p>
                  <div className="choice-grid choice-grid-2">
                    {YES_NO_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt}
                        label={opt}
                        selected={form.hasWebsite === opt}
                        onClick={() => set('hasWebsite')(opt)}
                      />
                    ))}
                  </div>

                  <p className="modal-group-label modal-group-label-spaced">¿Tu negocio ya hace ads?</p>
                  <div className="choice-grid choice-grid-2">
                    {YES_NO_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt}
                        label={opt}
                        selected={form.hasAds === opt}
                        onClick={() => set('hasAds')(opt)}
                      />
                    ))}
                  </div>

                  {form.hasAds === 'Sí' && (
                    <label className="text-field" style={{ marginTop: 12 }}>
                      <span className="text-field-icon"><MessageCircle size={16} strokeWidth={2} /></span>
                      <input
                        type="text"
                        placeholder="¿Cuántos mensajes recibes cuando tienes campañas activas?"
                        value={form.adsVolume}
                        onChange={(e) => set('adsVolume')(e.target.value)}
                      />
                    </label>
                  )}

                  <p className="modal-group-label modal-group-label-spaced">
                    Cuando el negocio no está disponible pero te escriben, ¿quién responde los mensajes?
                  </p>
                  <div className="choice-grid choice-grid-1">
                    {AFTER_HOURS_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt}
                        label={opt}
                        selected={form.afterHoursResponder === opt}
                        onClick={() => set('afterHoursResponder')(opt)}
                      />
                    ))}
                  </div>

                  <p className="modal-group-label modal-group-label-spaced">¿Se te ha ido algún cliente por no responder a tiempo?</p>
                  <div className="choice-grid choice-grid-3">
                    {LOST_CUSTOMER_OPTIONS.map((opt) => (
                      <ChoiceCard
                        key={opt}
                        label={opt}
                        selected={form.lostCustomer === opt}
                        onClick={() => set('lostCustomer')(opt)}
                      />
                    ))}
                  </div>

                  <p className="modal-insight-message">
                    Nosotros la entrenamos, ella no olvida, no se cansa y cierra ventas como tú mejor vendedor, las 24 horas 👍🏻
                  </p>
                </div>

                {/* Paso 5 */}
                <div className="modal-step">
                  <h3 className="modal-step-title">Confirma y envía</h3>
                  <p className="modal-step-desc">Esto es lo que le llegará a nuestro equipo por WhatsApp.</p>

                  <div className="summary-box">
                    <div className="summary-row"><span>Empresa</span><strong>{form.company || '—'}</strong></div>
                    <div className="summary-row"><span>Contacto</span><strong>{form.contact || '—'}</strong></div>
                    <div className="summary-row"><span>Plan</span><strong>{planName || 'Por definir'}</strong></div>
                    <div className="summary-row"><span>Canal</span><strong>{form.channel || '—'}</strong></div>
                    <div className="summary-row"><span>Volumen</span><strong>{form.volume || '—'}</strong></div>
                    <div className="summary-row"><span>Objetivo</span><strong>{form.objective || '—'}</strong></div>
                    <div className="summary-row"><span>Web / tienda en línea</span><strong>{form.hasWebsite || '—'}</strong></div>
                    <div className="summary-row"><span>Hace ads</span><strong>{form.hasAds || '—'}</strong></div>
                    {form.hasAds === 'Sí' && (
                      <div className="summary-row"><span>Mensajes en campañas</span><strong>{form.adsVolume || '—'}</strong></div>
                    )}
                    <div className="summary-row"><span>Responde fuera de horario</span><strong>{form.afterHoursResponder || '—'}</strong></div>
                    <div className="summary-row"><span>¿Se le ha ido un cliente?</span><strong>{form.lostCustomer || '—'}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-nav">
              {step > 1 ? (
                <button type="button" className="btn-ghost" onClick={handleBack}>
                  <ChevronLeft size={17} strokeWidth={2.2} />
                  Atrás
                </button>
              ) : <span />}

              {step < TOTAL_STEPS ? (
                <button type="button" className="btn-coral" disabled={!canAdvance} onClick={handleNext}>
                  Siguiente
                  <ChevronRight size={17} strokeWidth={2.2} />
                </button>
              ) : (
                <button type="button" className="btn-coral" onClick={handleSend}>
                  Enviar por WhatsApp
                  <MessageCircle size={17} strokeWidth={2.2} />
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="modal-success">
            <span className="modal-success-icon">
              <CheckCircle2 size={30} strokeWidth={2} />
            </span>
            <h3 className="modal-step-title">Listo, te estamos esperando en WhatsApp</h3>
            <p className="modal-step-desc">
              Abrimos una conversación con tu diagnóstico ya redactado. Un asesor te va a responder en breve.
            </p>
            <button type="button" className="btn-coral" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Componente principal                                                */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const mechanismRef = useRef(null);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
    window.setTimeout(() => {
      mechanismRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }, []);

  const openDiagnosis = useCallback((planId = null) => {
    setSelectedPlan(planId);
    setModalOpen(true);
  }, []);

  const openAdvisor = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(ADVISOR_MESSAGE)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

        .page-root {
          --coral: #FF5E3A;
          --coral-dark: #E8491F;
          --coral-tint: #FFE9E2;
          --coral-tint-2: #FFF3EF;
          --ink: #111827;
          --ink-muted: #6B7280;
          --ink-faint: #9CA3AF;
          --bg-soft: #F8F9FA;
          --line: #E9EAEC;
          --whatsapp: #25D366;
          font-family: 'Inter', -apple-system, sans-serif;
          color: var(--ink);
          background: #FFFFFF;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .page-root h1, .page-root h2, .page-root h3,
        .page-root .font-display {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
        }
        .page-root * { box-sizing: border-box; }

        /* ---- utilidades de marca ---- */
        .bg-soft { background-color: var(--bg-soft); }
        .text-muted { color: var(--ink-muted); }

        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12.5px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--coral-dark);
          background: var(--coral-tint-2); padding: 6px 14px 6px 10px;
          border-radius: 999px;
        }
        .eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--coral); }

        .btn-coral {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--coral); color: #fff; border: none;
          padding: 14px 24px; border-radius: 14px; font-weight: 600; font-size: 15px;
          cursor: pointer; transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
          box-shadow: 0 10px 24px -10px rgba(255, 94, 58, 0.55);
        }
        .btn-coral:hover:not(:disabled) { background: var(--coral-dark); transform: translateY(-1px); }
        .btn-coral:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }

        .btn-outline {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          background: #fff; color: var(--ink); border: 1.5px solid var(--line);
          padding: 13px 24px; border-radius: 14px; font-weight: 600; font-size: 15px;
          cursor: pointer; transition: border-color 180ms ease, transform 180ms ease;
        }
        .btn-outline:hover { border-color: var(--coral); transform: translateY(-1px); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; border: none; color: var(--ink-muted);
          font-weight: 600; font-size: 14.5px; cursor: pointer; padding: 10px 6px;
        }
        .btn-ghost:hover { color: var(--ink); }

        /* ---- nav ---- */
        .nav {
          position: sticky; top: 0; z-index: 30;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 6vw; background: rgba(255,255,255,0.85);
          backdrop-filter: blur(10px); border-bottom: 1px solid var(--line);
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; font-weight: 700; font-size: 17px; }
        .nav-logo-mark { width: 10px; height: 10px; border-radius: 3px; background: var(--coral); }

        /* ---- hero ---- */
        .hero { padding: 56px 6vw 64px; }
        .hero-grid {
          display: grid; grid-template-columns: 1fr; gap: 44px;
          max-width: 1180px; margin: 0 auto;
        }
        @media (min-width: 1024px) {
          .hero-grid { grid-template-columns: 1.05fr 0.95fr; align-items: start; gap: 56px; }
        }
        .hero-title {
          font-weight: 600; letter-spacing: -0.02em; line-height: 1.08;
          font-size: clamp(32px, 5.4vw, 52px); margin: 18px 0 16px;
        }
        .hero-title-accent { color: var(--coral); }
        .hero-sub { font-size: 17px; line-height: 1.6; color: var(--ink-muted); max-width: 54ch; }
        .hero-sub strong { color: var(--ink); font-weight: 600; }

        /* ---- problema vs. solución cuantificados ---- */
        .stats-compare {
          margin-top: 26px; display: grid; grid-template-columns: 1fr; gap: 0;
          background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 22px 20px;
        }
        @media (min-width: 640px) {
          .stats-compare { grid-template-columns: 1fr auto 1fr; align-items: start; gap: 22px; padding: 24px 26px; }
        }
        .stats-col { display: flex; flex-direction: column; gap: 13px; }
        .stats-col-solution {
          margin-top: 18px; padding-top: 16px; border-top: 1px dashed var(--line);
        }
        @media (min-width: 640px) { .stats-col-solution { margin-top: 0; padding-top: 0; border-top: none; } }
        .stats-col-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-faint);
        }
        .stats-col-label-coral { color: var(--coral-dark); }
        .stats-row { display: flex; align-items: baseline; gap: 10px; }
        .stats-number {
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 17px;
          white-space: nowrap; min-width: 74px; font-variant-numeric: tabular-nums;
        }
        .stats-number-problem { color: #DC2626; }
        .stats-number-coral { color: var(--coral-dark); }
        .stats-desc { font-size: 12.5px; color: var(--ink-muted); line-height: 1.4; }
        .stats-divider {
          display: none; align-self: center;
        }
        @media (min-width: 640px) {
          .stats-divider {
            display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;
            border-radius: 50%; background: var(--bg-soft); color: var(--ink-faint); margin-top: 4px;
          }
        }
        .stats-caption { margin-top: 10px; font-size: 11.5px; color: var(--ink-faint); text-align: center; }

        .vsl-card {
          margin-top: 32px; position: relative; border-radius: 22px; overflow: hidden;
          aspect-ratio: 16 / 9; background: linear-gradient(135deg, #1a1a1a 0%, #2b2b2b 55%, #1a1a1a 100%);
          display: flex; align-items: center; justify-content: center; cursor: pointer;
          box-shadow: 0 24px 48px -20px rgba(17,24,39,0.35);
        }
        .vsl-play {
          width: 68px; height: 68px; border-radius: 50%; background: var(--coral);
          display: flex; align-items: center; justify-content: center; color: #fff;
          box-shadow: 0 0 0 14px rgba(255,255,255,0.08);
        }
        .vsl-caption {
          position: absolute; bottom: 16px; left: 20px; color: rgba(255,255,255,0.75);
          font-size: 12.5px; font-weight: 500; letter-spacing: 0.03em;
        }

        .hero-cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; margin-top: 28px; }
        .hero-cta-hint { font-size: 13px; color: var(--ink-faint); }

        /* ---- phone mockup ---- */
        .phone-stage { position: relative; display: flex; justify-content: center; padding-top: 8px; }
        .phone-frame {
          width: 258px; background: #111827; border-radius: 38px; padding: 12px;
          box-shadow: 0 30px 60px -24px rgba(17,24,39,0.45);
          position: relative;
        }
        .phone-notch {
          position: absolute; top: 12px; left: 50%; transform: translateX(-50%);
          width: 70px; height: 18px; background: #111827; border-radius: 0 0 14px 14px; z-index: 2;
        }
        .phone-screen {
          background: #fff; border-radius: 26px; overflow: hidden; min-height: 360px;
          display: flex; flex-direction: column; padding-top: 20px;
        }
        .phone-topbar { padding: 10px 16px 12px; border-bottom: 1px solid var(--line); }
        .phone-contact { display: flex; align-items: center; gap: 10px; }
        .phone-avatar {
          width: 32px; height: 32px; border-radius: 50%; background: var(--bg-soft);
          display: flex; align-items: center; justify-content: center; color: var(--ink-muted); flex-shrink: 0;
        }
        .phone-contact-name { display: block; font-size: 13.5px; font-weight: 600; color: var(--ink); }
        .phone-contact-status { display: block; font-size: 11px; color: var(--ink-faint); }
        .phone-chat { flex: 1; padding: 16px 14px; display: flex; flex-direction: column; gap: 10px; }
        .chat-bubble-in {
          align-self: flex-start; max-width: 84%; background: var(--bg-soft); color: var(--ink);
          padding: 10px 12px; border-radius: 14px 14px 14px 3px; font-size: 12.5px; line-height: 1.4;
          position: relative;
        }
        .chat-bubble-fade { opacity: 0.55; }
        .chat-time { display: block; margin-top: 4px; font-size: 10px; color: var(--ink-faint); }
        .phone-badge {
          margin: 0 14px 14px; align-self: flex-start; display: inline-flex; align-items: center; gap: 6px;
          background: #FEF2F2; color: #DC2626; font-size: 11px; font-weight: 600;
          padding: 6px 10px; border-radius: 999px; width: fit-content;
        }

        .ig-float {
          position: absolute; top: -6px; right: -4px; z-index: 3; width: 168px;
          background: #fff; border-radius: 16px; padding: 12px 13px;
          box-shadow: 0 18px 34px -14px rgba(17,24,39,0.3); border: 1px solid var(--line);
          transform: rotate(4deg);
        }
        .ig-float-header {
          display: flex; align-items: center; gap: 6px; font-size: 10.5px; font-weight: 700;
          background: linear-gradient(90deg, #F58529, #DD2A7B 55%, #8134AF);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .ig-float-text { font-size: 11px; line-height: 1.4; color: var(--ink); margin: 7px 0 5px; }
        .ig-float-time { font-size: 9.5px; color: var(--ink-faint); font-weight: 600; }

        @media (max-width: 1023px) {
          .phone-stage { margin-top: 8px; transform: scale(0.94); }
        }

        /* ---- calculadora ---- */
        .calc-card {
          margin-top: 28px; background: #fff; border: 1px solid var(--line); border-radius: 22px;
          padding: 24px; box-shadow: 0 20px 42px -28px rgba(17,24,39,0.25);
        }
        .calc-header { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
        .calc-header-icon {
          width: 34px; height: 34px; border-radius: 10px; background: var(--coral-tint);
          color: var(--coral-dark); display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .calc-title { font-weight: 600; font-size: 15px; color: var(--ink); }
        .calc-subtitle { font-size: 13px; color: var(--ink-muted); margin-top: 2px; }

        .calc-sliders { display: flex; flex-direction: column; gap: 18px; }
        .calc-field { display: flex; flex-direction: column; gap: 8px; }
        .calc-field-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 13.5px; font-weight: 500; color: var(--ink); }
        .calc-field-value { font-weight: 700; color: var(--coral-dark); font-variant-numeric: tabular-nums; }

        .range-coral {
          -webkit-appearance: none; appearance: none; width: 100%; height: 6px;
          border-radius: 999px; outline: none; cursor: pointer;
        }
        .range-coral::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%;
          background: #fff; border: 3px solid var(--coral); box-shadow: 0 2px 8px rgba(17,24,39,0.2); cursor: pointer;
        }
        .range-coral::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%; background: #fff;
          border: 3px solid var(--coral); box-shadow: 0 2px 8px rgba(17,24,39,0.2); cursor: pointer;
        }

        .calc-result {
          margin-top: 22px; text-align: center; background: var(--bg-soft); border-radius: 16px;
          padding: 22px 16px 20px; position: relative; overflow: hidden;
        }
        .calc-result-drip { position: absolute; top: 0; left: 0; right: 0; height: 3px; display: flex; }
        .drip { flex: 1; background: var(--coral); animation: drip-fall 2600ms ease-in-out infinite; opacity: 0.7; }
        .drip-2 { animation-delay: 400ms; } .drip-3 { animation-delay: 800ms; }
        @keyframes drip-fall { 0%, 100% { transform: scaleY(1); opacity: 0.5; } 50% { transform: scaleY(2.4); opacity: 1; } }

        .calc-result-label { font-size: 12.5px; color: var(--ink-muted); font-weight: 500; }
        .calc-result-value {
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; color: var(--coral-dark);
          font-size: clamp(34px, 6vw, 44px); line-height: 1.1; margin: 4px 0 8px; font-variant-numeric: tabular-nums;
        }
        .calc-result-currency { font-size: 0.55em; vertical-align: 6px; margin-right: 2px; }
        .calc-result-unit { font-size: 0.4em; color: var(--ink-muted); font-weight: 600; margin-left: 4px; }
        .calc-result-note { font-size: 12.5px; color: var(--ink-muted); max-width: 34ch; margin: 0 auto; line-height: 1.4; }
        .calc-result-compare { margin-top: 10px; font-size: 12.5px; color: var(--ink); }
        .calc-result-compare strong { color: var(--coral-dark); }

        .calc-cta {
          margin-top: 18px; width: 100%; background: transparent; border: 1.5px solid var(--coral);
          color: var(--coral-dark); font-weight: 600; font-size: 14px; padding: 12px 18px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
          transition: background 180ms ease;
        }
        .calc-cta:hover { background: var(--coral-tint-2); }

        /* ---- unlock wrapper ---- */
        .unlock-wrap {
          display: grid; transition: grid-template-rows 750ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .unlock-inner { overflow: hidden; min-height: 0; }
        .unlock-fade { transition: opacity 550ms ease 150ms; }

        /* ---- secciones genéricas ---- */
        .section { padding: 88px 6vw; }
        .section-inner { max-width: 1180px; margin: 0 auto; }
        .section-head { max-width: 640px; margin-bottom: 48px; }
        .section-title {
          font-weight: 600; letter-spacing: -0.015em; font-size: clamp(28px, 4vw, 38px);
          margin: 16px 0 14px; line-height: 1.15;
        }
        .section-desc { font-size: 16px; color: var(--ink-muted); line-height: 1.6; }

        /* ---- belief cards ---- */
        .belief-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 900px) { .belief-grid { grid-template-columns: repeat(3, 1fr); } }
        .belief-card {
          background: #fff; border: 1px solid var(--line); border-radius: 20px; padding: 22px;
          display: flex; flex-direction: column; gap: 16px;
        }
        .belief-row { display: flex; align-items: flex-start; gap: 12px; }
        .belief-icon {
          width: 30px; height: 30px; border-radius: 9px; display: flex; align-items: center;
          justify-content: center; flex-shrink: 0; margin-top: 2px;
        }
        .belief-icon-muted { background: #F3F4F6; color: var(--ink-faint); }
        .belief-icon-coral { background: var(--coral-tint); color: var(--coral-dark); }
        .belief-chip {
          display: inline-block; font-size: 10.5px; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; padding: 3px 8px; border-radius: 999px; margin-bottom: 6px;
        }
        .belief-chip-muted { background: #F3F4F6; color: var(--ink-faint); }
        .belief-chip-coral { background: var(--coral-tint); color: var(--coral-dark); }
        .belief-text { font-size: 13.5px; line-height: 1.55; color: var(--ink); }
        .belief-text-muted { color: var(--ink-muted); font-style: italic; }
        .belief-divider { height: 1px; background: var(--line); }

        /* ---- pricing ---- */
        .plan-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }
        @media (min-width: 900px) { .plan-grid { grid-template-columns: repeat(3, 1fr); align-items: stretch; } }
        .plan-card {
          position: relative; background: #fff; border: 1.5px solid var(--line); border-radius: 24px;
          padding: 28px 24px; display: flex; flex-direction: column;
        }
        .plan-card-highlight { border-color: var(--coral); box-shadow: 0 24px 46px -26px rgba(255,94,58,0.4); }
        @media (min-width: 900px) { .plan-card-highlight { transform: translateY(-10px); } }
        .plan-tag {
          position: absolute; top: -13px; left: 24px; background: var(--coral); color: #fff;
          font-size: 11.5px; font-weight: 700; padding: 5px 12px; border-radius: 999px; letter-spacing: 0.02em;
        }
        .plan-name { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 19px; }
        .plan-tagline { font-size: 13px; color: var(--ink-muted); margin-top: 4px; min-height: 34px; }
        .plan-price {
          font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 38px;
          margin-top: 18px; color: var(--ink); font-variant-numeric: tabular-nums;
        }
        .plan-price-currency { font-size: 0.5em; vertical-align: 8px; }
        .plan-price-unit { font-size: 0.35em; color: var(--ink-muted); font-weight: 600; margin-left: 2px; }
        .plan-setup { font-size: 13px; color: var(--ink-muted); margin-top: 4px; font-weight: 500; }
        .plan-setup-note { font-size: 12px; color: var(--ink-faint); margin-top: 4px; line-height: 1.4; min-height: 32px; }
        .plan-volume {
          margin-top: 16px; font-size: 12.5px; font-weight: 600; color: var(--coral-dark);
          background: var(--coral-tint-2); display: inline-block; padding: 5px 11px; border-radius: 999px; width: fit-content;
        }
        .plan-features { list-style: none; margin: 20px 0 24px; padding: 0; display: flex; flex-direction: column; gap: 11px; flex: 1; }
        .plan-features li { display: flex; align-items: flex-start; gap: 9px; font-size: 13.5px; color: var(--ink); line-height: 1.4; }
        .plan-features li svg { color: var(--coral); margin-top: 2px; flex-shrink: 0; }
        .plan-cta { width: 100%; }

        .plan-diagnose-cta {
          margin-top: 40px; display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: 10px; padding-top: 36px; border-top: 1px solid var(--line);
        }
        .plan-diagnose-cta p { font-size: 14.5px; color: var(--ink-muted); }

        /* ---- modal ---- */
        .modal-backdrop {
          position: fixed; inset: 0; background: rgba(17,24,39,0.55); backdrop-filter: blur(3px);
          display: flex; align-items: flex-end; justify-content: center; z-index: 100; padding: 0;
        }
        @media (min-width: 640px) {
          .modal-backdrop { align-items: center; padding: 24px; }
        }
        .modal-shell {
          background: #fff; width: 100%; max-width: 560px; max-height: 92vh; overflow-y: auto;
          border-radius: 24px 24px 0 0; padding: 28px 24px 24px; position: relative;
        }
        @media (min-width: 640px) {
          .modal-shell { border-radius: 26px; padding: 32px 32px 28px; }
        }
        .modal-close {
          position: absolute; top: 18px; right: 18px; width: 32px; height: 32px; border-radius: 50%;
          background: var(--bg-soft); border: none; display: flex; align-items: center; justify-content: center;
          color: var(--ink-muted); cursor: pointer;
        }
        .modal-close:hover { color: var(--ink); }
        .modal-head { display: flex; justify-content: space-between; align-items: center; padding-right: 30px; }
        .modal-eyebrow { font-size: 12.5px; font-weight: 700; color: var(--coral-dark); text-transform: uppercase; letter-spacing: 0.05em; }
        .modal-step-label { font-size: 12.5px; color: var(--ink-faint); font-weight: 600; }
        .progress-track { height: 5px; background: var(--bg-soft); border-radius: 999px; margin-top: 14px; overflow: hidden; }
        .progress-fill { height: 100%; background: var(--coral); border-radius: 999px; transition: width 400ms ease; }
        .modal-plan-badge {
          margin-top: 14px; font-size: 12.5px; color: var(--ink-muted); background: var(--coral-tint-2);
          padding: 8px 12px; border-radius: 10px;
        }

        .modal-slider-viewport { overflow: hidden; margin-top: 22px; }
        .modal-slider-track { display: flex; width: 500%; transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1); }
        .modal-step { width: 20%; flex-shrink: 0; padding-right: 6px; }

        .modal-step-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600; font-size: 19px; }
        .modal-step-desc { font-size: 13.5px; color: var(--ink-muted); margin: 6px 0 20px; line-height: 1.5; }

        .text-field {
          display: flex; align-items: center; gap: 10px; border: 1.5px solid var(--line); border-radius: 13px;
          padding: 12px 14px; margin-bottom: 12px;
        }
        .text-field:focus-within { border-color: var(--coral); }
        .text-field-icon { color: var(--ink-faint); flex-shrink: 0; }
        .text-field input {
          border: none; outline: none; width: 100%; font-size: 14.5px; font-family: inherit; color: var(--ink);
        }
        .text-field input::placeholder { color: var(--ink-faint); }

        .modal-group-label { font-size: 12.5px; font-weight: 700; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 10px; }
        .modal-group-label-spaced { margin-top: 22px; }

        .choice-grid { display: grid; gap: 10px; }
        .choice-grid-1 { grid-template-columns: 1fr; }
        .choice-grid-2 { grid-template-columns: 1fr 1fr; }
        .choice-grid-3 { grid-template-columns: repeat(3, 1fr); }
        @media (max-width: 420px) { .choice-grid-3 { grid-template-columns: 1fr 1fr; } }

        .choice-card {
          display: flex; align-items: center; gap: 10px; text-align: left; width: 100%;
          border: 1.5px solid var(--line); border-radius: 13px; padding: 12px 13px; background: #fff;
          cursor: pointer; transition: border-color 160ms ease, background 160ms ease;
        }
        .choice-card:hover { border-color: var(--coral); }
        .choice-card-active { border-color: var(--coral); background: var(--coral-tint-2); }
        .choice-card-icon {
          width: 28px; height: 28px; border-radius: 8px; background: var(--bg-soft); color: var(--ink-muted);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .choice-card-icon-active { background: var(--coral); color: #fff; }
        .choice-card-text { flex: 1; min-width: 0; }
        .choice-card-label { display: block; font-size: 13.5px; font-weight: 600; color: var(--ink); }
        .choice-card-sub { display: block; font-size: 11.5px; color: var(--ink-muted); }
        .choice-card-check {
          width: 20px; height: 20px; border-radius: 50%; background: var(--coral); color: #fff;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }

        .modal-insight-message {
          margin-top: 22px; font-size: 14px; font-weight: 600; line-height: 1.5; color: var(--ink);
          background: var(--coral-tint); border-radius: 14px; padding: 14px 16px;
        }

        .summary-box { background: var(--bg-soft); border-radius: 16px; padding: 6px 16px; }
        .summary-row {
          display: flex; justify-content: space-between; gap: 12px; padding: 12px 0;
          border-bottom: 1px solid var(--line); font-size: 13.5px;
        }
        .summary-row:last-child { border-bottom: none; }
        .summary-row span { color: var(--ink-muted); }
        .summary-row strong { color: var(--ink); text-align: right; font-weight: 600; }

        .modal-nav { display: flex; align-items: center; justify-content: space-between; margin-top: 26px; }

        .modal-success { text-align: center; padding: 20px 4px 4px; }
        .modal-success-icon {
          width: 60px; height: 60px; border-radius: 50%; background: var(--coral-tint); color: var(--coral-dark);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 18px;
        }
        .modal-success button { margin-top: 22px; }

        /* ---- sticky whatsapp ---- */
        .sticky-wa {
          position: fixed; bottom: 22px; right: 22px; z-index: 50;
          display: flex; align-items: center; gap: 10px; background: var(--whatsapp); color: #fff;
          border: none; border-radius: 999px; padding: 14px; cursor: pointer;
          box-shadow: 0 14px 30px -12px rgba(37,211,102,0.6);
        }
        .sticky-wa-ring {
          position: absolute; inset: 0; border-radius: 999px; border: 2px solid var(--whatsapp);
          animation: wa-ping 2200ms cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes wa-ping { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.6); opacity: 0; } }
        .sticky-wa-label {
          max-width: 0; overflow: hidden; white-space: nowrap; font-size: 13.5px; font-weight: 600;
          transition: max-width 260ms ease;
        }
        .sticky-wa:hover .sticky-wa-label { max-width: 160px; }
        .sticky-wa:hover { padding: 14px 18px 14px 16px; }

        /* ---- footer ---- */
        .footer {
          padding: 40px 6vw 100px; border-top: 1px solid var(--line); text-align: center;
        }
        .footer p { font-size: 12.5px; color: var(--ink-faint); }
      `}</style>

      {/* NAV */}
      <div className="nav">
        <div className="nav-logo">
          <span className="nav-logo-mark" />
          Respondia
        </div>
        <button type="button" className="btn-outline" onClick={openAdvisor} style={{ display: 'none' }}>
          Hablar con un asesor
        </button>
      </div>

      {/* SECCIÓN 1 — HERO */}
      <section className="hero">
        <div className="hero-grid">
          <div>
            <Eyebrow>Para negocios en Venezuela</Eyebrow>
            <h1 className="hero-title">
              El costo invisible de <span className="hero-title-accent">responder tarde</span>
            </h1>
            <p className="hero-sub">
              La IA que responde por tu negocio en milisegundos a través de <strong>WhatsApp e Instagram</strong>, directo a código.
              Funciona 24/7: aunque se vaya la luz, no tengas datos o estés desconectado.
            </p>

            <ProblemSolutionStats />

            <div className="vsl-card" role="button" tabIndex={0} aria-label="Reproducir video explicativo">
              <span className="vsl-play"><Play size={26} strokeWidth={0} fill="#fff" /></span>
              <span className="vsl-caption">Video explicativo · 3 min</span>
            </div>

            <div className="hero-cta-row">
              <PrimaryButton onClick={handleUnlock}>Ver planes y solución</PrimaryButton>
              <span className="hero-cta-hint">Toma 3 minutos ver cómo funciona</span>
            </div>
          </div>

          <div>
            <PhoneMockup />
            <LossCalculator onUseInDiagnosis={handleUnlock} />
          </div>
        </div>
      </section>

      {/* CONTENIDO DESBLOQUEABLE: SECCIONES 2 Y 3 */}
      <div className="unlock-wrap" style={{ gridTemplateRows: unlocked ? '1fr' : '0fr' }}>
        <div className="unlock-inner">
          <div className="unlock-fade" style={{ opacity: unlocked ? 1 : 0 }}>

            {/* SECCIÓN 2 — MECANISMO */}
            <section className="section bg-soft" ref={mechanismRef}>
              <div className="section-inner">
                <div className="section-head">
                  <Eyebrow>Cómo funciona</Eyebrow>
                  <h2 className="section-title">Un mecanismo que no depende de ti</h2>
                  <p className="section-desc">
                    No depende de que la tienda esté abierta, de que tengas señal, ni de que estés frente al teléfono.
                    La IA vive en la nube y responde en el instante en que llega el mensaje.
                  </p>
                </div>

                <div className="belief-grid">
                  {BELIEFS.map((item, i) => (
                    <BeliefCard key={item.belief} item={item} index={i} />
                  ))}
                </div>
              </div>
            </section>

            {/* SECCIÓN 3 — PLANES */}
            <section className="section" id="planes">
              <div className="section-inner">
                <div className="section-head">
                  <Eyebrow>Planes</Eyebrow>
                  <h2 className="section-title">Elige según tu volumen de mensajes</h2>
                  <p className="section-desc">
                    Cada plan incluye una implementación única y una suscripción mensual. Sin permanencia forzada.
                  </p>
                </div>

                <div className="plan-grid">
                  {PLANS.map((plan, i) => (
                    <PricingCard key={plan.id} plan={plan} index={i} onSelect={openDiagnosis} />
                  ))}
                </div>

                <div className="plan-diagnose-cta">
                  <p>¿No sabes cuál plan es para ti? Diagnostica tu negocio en menos de 2 minutos.</p>
                  <button type="button" className="btn-outline" onClick={() => openDiagnosis(null)}>
                    Diagnosticar mi negocio
                    <ArrowRight size={16} strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Respondia · IA para WhatsApp e Instagram, directo a código.</p>
      </div>

      {/* STICKY WHATSAPP */}
      <button type="button" className="sticky-wa" onClick={openAdvisor} aria-label="Hablar con un asesor por WhatsApp">
        <span className="sticky-wa-ring" />
        <MessageCircle size={22} strokeWidth={2.2} />
        <span className="sticky-wa-label">Hablar con un asesor</span>
      </button>

      <DiagnosisModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPlanId={selectedPlan}
      />
    </div>
  );
}
