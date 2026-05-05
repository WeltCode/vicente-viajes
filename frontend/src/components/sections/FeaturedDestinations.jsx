import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { apiUrl } from "../../services/api";
import WaveDivider from "./WaveDivider";

const fallbackStates = [
  {
    id: 1,
    title: "Punta Cana",
    subtitle: "Escapada al Caribe con plazas limitadas",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=700&h=1200&fit=crop",
  },
  {
    id: 2,
    title: "Riviera Maya",
    subtitle: "Playas cristalinas y hoteles todo incluido",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=700&h=1200&fit=crop",
  },
  {
    id: 3,
    title: "Santorini",
    subtitle: "Circuito mediterraneo con salidas programadas",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=700&h=1200&fit=crop",
  },
  {
    id: 4,
    title: "Dubai",
    subtitle: "Oferta especial para tu proxima aventura",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=700&h=1200&fit=crop",
  },
];

const FALLBACK_AUTOPLAY_MS = 3200;
const DEFAULT_VISIBLE_CARDS = 4;

const getVisibleCardsForViewport = () => {
  if (typeof window === "undefined") return DEFAULT_VISIBLE_CARDS;
  if (window.innerWidth < 768) return 1;
  if (window.innerWidth < 1024) return 2;
  return 3;
};

const getCyclicSlice = (list, start, count) => {
  if (!list.length) return [];
  const result = [];
  for (let idx = 0; idx < count; idx += 1) {
    const sourceIndex = (start + idx) % list.length;
    result.push({ item: list[sourceIndex], sourceIndex });
  }
  return result;
};

const FeaturedDestinations = () => {
  const [items, setItems] = useState([]);
  const [hasLoadError, setHasLoadError] = useState(false);
  const [visibleCards, setVisibleCards] = useState(getVisibleCardsForViewport);
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const dragStartX = useRef(0);
  const suppressClickRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStates() {
      try {
        const resp = await axios.get(apiUrl("estados/"));
        const data = Array.isArray(resp.data) ? resp.data : [];
        if (isMounted) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const filteredItems =
            data.filter((item) => {
              if (!(item.image_url || item.image) || !item.is_active || !item.excursion_date) {
                return false;
              }
              const excursionDate = new Date(`${item.excursion_date}T00:00:00`);
              return excursionDate > today;
            });

          setItems(filteredItems);
          setHasLoadError(filteredItems.length === 0);
        }
      } catch {
        if (isMounted) {
          setItems([]);
          setHasLoadError(true);
        }
      }
    }

    loadStates();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setVisibleCards(getVisibleCardsForViewport());
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const states = items.length ? items : hasLoadError ? fallbackStates : [];

  const triggerNext = () => {
    if (isAnimating || states.length <= 1) return;
    setDirection("next");
    setIsAnimating(true);
  };

  const triggerPrev = () => {
    if (isAnimating || states.length <= 1) return;
    setDirection("prev");
    setIsAnimating(true);
  };

  useEffect(() => {
    if (states.length <= 1 || isPaused || isDragging || !isAutoplayEnabled) return undefined;
    const timer = setInterval(() => {
      triggerNext();
    }, FALLBACK_AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [states.length, isPaused, isDragging, isAnimating, isAutoplayEnabled]);

  const frameItems = useMemo(() => {
    if (states.length <= 1) {
      return getCyclicSlice(states, startIndex, 1);
    }
    if (direction === "prev") {
      const previousStart = (startIndex - 1 + states.length) % states.length;
      return getCyclicSlice(states, previousStart, visibleCards + 1);
    }
    return getCyclicSlice(states, startIndex, visibleCards + 1);
  }, [states, startIndex, direction, visibleCards]);

  const shiftPercent = frameItems.length ? 100 / frameItems.length : 0;

  const handleTrackTransitionEnd = () => {
    if (!isAnimating) return;
    if (direction === "prev") {
      setStartIndex((prev) => (prev - 1 + states.length) % states.length);
    } else {
      setStartIndex((prev) => (prev + 1) % states.length);
    }
    setIsAnimating(false);
  };

  const handleMouseDown = (e) => {
    suppressClickRef.current = false;
    dragStartX.current = e.clientX;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > 8) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    if (delta <= -40) triggerNext();
    if (delta >= 40) triggerPrev();
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleTouchStart = (e) => {
    dragStartX.current = e.touches[0].clientX;
    suppressClickRef.current = false;
    setIsDragging(true);
    setIsPaused(true);
  };

  const handleTouchEnd = (e) => {
    const delta = e.changedTouches[0].clientX - dragStartX.current;
    if (Math.abs(delta) > 8) {
      suppressClickRef.current = true;
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
    if (delta <= -40) triggerNext();
    if (delta >= 40) triggerPrev();
    setIsDragging(false);
    setIsPaused(false);
  };

  const handleCardClick = (item) => {
    if (suppressClickRef.current) return;
    setSelectedState(item);
  };

  const selectedStateIndex = selectedState
    ? states.findIndex((item) => item.id === selectedState.id)
    : -1;

  const handleModalPrev = () => {
    if (selectedStateIndex < 0 || states.length <= 1) return;
    setSelectedState(states[(selectedStateIndex - 1 + states.length) % states.length]);
  };

  const handleModalNext = () => {
    if (selectedStateIndex < 0 || states.length <= 1) return;
    setSelectedState(states[(selectedStateIndex + 1) % states.length]);
  };

  useEffect(() => {
    if (!selectedState) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedState(null);
      }
      if (event.key === "ArrowLeft") {
        handleModalPrev();
      }
      if (event.key === "ArrowRight") {
        handleModalNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedState, selectedStateIndex, states]);

  if (!states.length) {
    return null;
  }

  return (
    <section className="relative py-24 bg-mist overflow-hidden">
      <div className="absolute top-20 left-0 w-72 h-72 rounded-full bg-teal/5 blur-3xl" />
      <div className="absolute bottom-20 right-0 w-96 h-96 rounded-full bg-sage/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-teal/10 text-teal font-medium text-sm uppercase tracking-wider mb-4">
            📅 Próximas Salidas
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-forest mb-6 font-display">
            Excursiones Disponibles
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Descubre nuestras próximas salidas y reserva tu lugar antes de que se agoten las plazas.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setIsAutoplayEnabled((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-[#c9d5d1] bg-white px-5 py-2.5 text-sm font-semibold text-[#1f7770] shadow-sm transition hover:bg-[#f4f8f7]"
            >
              {isAutoplayEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isAutoplayEnabled ? "Pausar carrusel" : "Reanudar carrusel"}
            </button>
          </div>
        </motion.div>

        <div
          className="relative overflow-hidden rounded-3xl border border-[#d6dfdc] bg-white/80 p-3 md:p-5 shadow-card"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => {
            setIsPaused(false);
            setIsDragging(false);
          }}
        >
          <button
            onClick={triggerPrev}
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#1f7770] shadow-md transition hover:bg-white"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={triggerNext}
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-[#1f7770] shadow-md transition hover:bg-white"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            className="flex cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={(e) => {
              if (isDragging) {
                handleMouseUp(e);
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            style={{
              width: `${(frameItems.length / visibleCards) * 100}%`,
              transform: isAnimating
                ? direction === "prev"
                  ? `translateX(${shiftPercent}%)`
                  : `translateX(-${shiftPercent}%)`
                : "translateX(0)",
              transition: isAnimating ? "transform 650ms ease" : "none",
            }}
            onTransitionEnd={handleTrackTransitionEnd}
          >
            {frameItems.map(({ item, sourceIndex }, index) => {
              const isActiveCard = sourceIndex === startIndex;

              return (
              <div
                key={`${item.id}-${index}`}
                className="px-2"
                style={{ width: `${100 / frameItems.length}%` }}
              >
                <button
                  type="button"
                  onClick={() => handleCardClick(item)}
                  className={`relative block w-full overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                    isActiveCard
                      ? "border-[#1f7770] ring-2 ring-[#1f7770]/20"
                      : "border-[#d3dcda] hover:border-[#bdd0cb]"
                  }`}
                >
                  <img
                    src={item.image_url || item.image}
                    alt={item.title || "Estado"}
                    className="h-[520px] sm:h-[580px] md:h-[620px] lg:h-[460px] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#122127]/70 to-transparent px-4 pb-4 pt-10 text-left text-white">
                    <p className="text-sm font-semibold">{item.title || `Estado ${item.id}`}</p>
                    <p className="text-xs text-white/80">{item.subtitle || "Toca para ampliar"}</p>
                  </div>
                </button>
              </div>
            )})}
          </div>

          {states.length > 1 && (
            <div className="mt-5 flex items-center justify-center gap-2">
              {states.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isAnimating) return;
                    setStartIndex(index);
                  }}
                  className={`rounded-full transition-all ${
                    index === startIndex
                      ? "h-2.5 w-8 bg-[#1f7770]"
                      : "h-2.5 w-2.5 bg-[#b7c8c4] hover:bg-[#8fa7a1]"
                  }`}
                  aria-label={`Ir a la imagen ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm"
            onClick={() => setSelectedState(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            >
              {states.length > 1 && (
                <>
                  <button
                    onClick={handleModalPrev}
                    className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleModalNext}
                    className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="relative">
                <img
                  src={selectedState.image_url || selectedState.image}
                  alt={selectedState.title || "Estado"}
                  className="max-h-[86vh] w-full object-contain bg-[#0f1b20]"
                />
                <button
                  onClick={() => setSelectedState(null)}
                  className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
                  aria-label="Cerrar imagen"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-5 pt-12 text-white">
                  <h3 className="text-2xl font-display font-bold">
                    {selectedState.title || `Estado ${selectedState.id}`}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    {selectedState.subtitle || "Vista ampliada del estado seleccionado."}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <WaveDivider position="bottom" fillColor="#e3f2f1" />
    </section>
  );
};

export default FeaturedDestinations;
