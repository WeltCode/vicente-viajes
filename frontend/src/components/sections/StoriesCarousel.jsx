import React from "react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WaveDivider from "./WaveDivider";

const StoriesCarousel = ({ stories = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const autoplayTimerRef = useRef(null);

  // Use default stories if none provided
  const defaultStories = [
    {
      id: 1,
      title: "Machu Picchu",
      subtitle: "Perú",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=500&h=800&fit=crop",
      tag: "Aventura",
    },
    {
      id: 2,
      title: "Safari Africano",
      subtitle: "Kenia",
      image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=500&h=800&fit=crop",
      tag: "Naturaleza",
    },
    {
      id: 3,
      title: "Auroras Boreales",
      subtitle: "Islandia",
      image: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=500&h=800&fit=crop",
      tag: "Luces",
    },
    {
      id: 4,
      title: "Templos de Angkor",
      subtitle: "Camboya",
      image: "https://images.unsplash.com/photo-1569288063643-5d29ad64df09?w=500&h=800&fit=crop",
      tag: "Cultura",
    },
    {
      id: 5,
      title: "Glaciar Perito Moreno",
      subtitle: "Argentina",
      image: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=500&h=800&fit=crop",
      tag: "Hielo",
    },
    {
      id: 6,
      title: "Fuji-san",
      subtitle: "Japón",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=800&fit=crop",
      tag: "Montaña",
    },
    {
      id: 7,
      title: "Santorini",
      subtitle: "Grecia",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500&h=800&fit=crop",
      tag: "Romántico",
    },
    {
      id: 8,
      title: "Nueva York",
      subtitle: "Estados Unidos",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=800&fit=crop",
      tag: "Ciudad",
    },
    {
      id: 9,
      title: "Taj Mahal",
      subtitle: "India",
      image: "https://images.unsplash.com/photo-1564507592333-c60657d2c4af?w=500&h=800&fit=crop",
      tag: "Monumento",
    },
    {
      id: 10,
      title: "Maldivas",
      subtitle: "Océano Índico",
      image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=800&fit=crop",
      tag: "Playa",
    },
  ];

  const displayStories = stories.length > 0 ? stories : defaultStories;
  const totalStories = displayStories.length;

  // Autoplay effect
  useEffect(() => {
    if (isPressed || isDragging) {
      clearInterval(autoplayTimerRef.current);
      return;
    }

    autoplayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalStories);
    }, 5000);

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isPressed, isDragging, totalStories]);

  // Mobile touch handlers
  const handleTouchStart = (e) => {
    setIsPressed(true);
    setStartX(e.touches[0].clientX);
    clearInterval(autoplayTimerRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isPressed) return;
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;

    if (Math.abs(diff) > 10) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = (e) => {
    if (!isPressed) return;
    setIsPressed(false);

    if (!isDragging) {
      setIsDragging(false);
      // small tap - keep current
      return;
    }
    setIsDragging(false);

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    } else {
      // snap to nearest if movement was small
      snapToNearest();
    }
  };

  // Desktop drag handlers
  const handleMouseDown = (e) => {
    setIsPressed(true);
    setStartX(e.pageX);
    clearInterval(autoplayTimerRef.current);
  };

  const handleMouseMove = (e) => {
    if (!isPressed) return;
    const diff = Math.abs(startX - e.pageX);
    if (diff > 5) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = (e) => {
    if (!isPressed) return;
    setIsPressed(false);

    if (!isDragging) {
      setIsDragging(false);
      return;
    }
    setIsDragging(false);

    const diff = startX - e.pageX;

    if (diff > 30) {
      handleNext();
    } else if (diff < -30) {
      handlePrev();
    } else {
      snapToNearest();
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalStories);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalStories) % totalStories);
  };

  // Snap to nearest visible card based on scroll position
  const snapToNearest = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = Array.from(container.children);
    const scrollLeft = container.scrollLeft;
    let nearestIndex = 0;
    let minDiff = Infinity;
    children.forEach((child, idx) => {
      const diff = Math.abs(child.offsetLeft - scrollLeft);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = idx;
      }
    });
    setCurrentIndex(nearestIndex);
    const node = children[nearestIndex];
    if (node) node.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  // When currentIndex changes, ensure the card is visible
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const node = container.children[currentIndex];
    if (node) {
      node.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    }
  }, [currentIndex]);

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-forest/5 via-transparent to-sage/5">
      <div className="container mx-auto px-4">
        {/* Top wave to match background color */}
        <WaveDivider position="top" fillColor="#e3f2f1" />

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-teal/10 text-teal font-medium text-sm uppercase tracking-wider mb-4">
            Inspiración de Viajes
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-forest mb-6 font-display">
            Historias de Viajeros
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Desliza para explorar historias inspiradoras de nuestros viajeros alrededor del mundo
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Desktop Navigation Arrows */}
          <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between pointer-events-none z-20 px-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrev}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-forest hover:bg-teal hover:text-white transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-forest hover:bg-teal hover:text-white transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Stories Carousel */}
          <div
            ref={scrollContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex gap-3 md:gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none scrollbar-hide"
            style={{ scrollBehavior: "smooth" }}
          >
            <AnimatePresence mode="wait">
              {displayStories.map((story, index) => {
                const isActive = index === currentIndex;
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{
                      opacity: isActive ? 1 : 0.6,
                      scale: isActive ? 1 : 0.95,
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0 snap-start w-[90%] md:w-[33.333%] lg:w-[20%] h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer group"
                    onClick={() => {
                      const newIndex = displayStories.findIndex(
                        (s) => s.id === story.id
                      );
                      setCurrentIndex(newIndex);
                      setSelectedStory(story);
                    }}
                  >
                    {/* Story Image */}
                    <div className="relative w-full h-full overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-forest/20 to-transparent" />

                      {/* Tag */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-forest">
                        {story.tag}
                      </div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-1 line-clamp-2">
                          {story.title}
                        </h3>
                        <p className="text-sm md:text-base text-white/80 mb-3">
                          {story.subtitle}
                        </p>

                        {/* Progress Indicator for Active */}
                        {isActive && (
                          <motion.div
                            key={`progress-${currentIndex}`}
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 5, ease: "linear" }}
                            className="h-1 bg-white/50 rounded-full"
                          />
                        )}
                      </div>

                      {/* Active Indicator Ring */}
                      {isActive && (
                        <motion.div
                          layoutId="story-ring"
                          className="absolute inset-0 border-2 md:border-4 border-white pointer-events-none rounded-2xl"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Mobile Swipe Indicator */}
          <div className="md:hidden flex justify-center mt-4 gap-1.5">
            {displayStories.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  width: index === currentIndex ? 24 : 6,
                  backgroundColor:
                    index === currentIndex ? "#216869" : "#e3f2f1",
                }}
                className="h-1.5 rounded-full transition-all"
              />
            ))}
          </div>

          {/* Desktop Indicator Dots */}
          <div className="hidden md:flex justify-center mt-6 gap-2">
            {displayStories.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                animate={{
                  width: index === currentIndex ? 32 : 8,
                  backgroundColor:
                    index === currentIndex ? "#216869" : "#e3f2f1",
                }}
                className="h-2 rounded-full transition-all hover:bg-sage"
              />
            ))}
          </div>
        </div>

        {/* Modal for story details (opened on card click) */}
        <AnimatePresence>
          {selectedStory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight/80 backdrop-blur-sm"
              onClick={() => setSelectedStory(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              >
                <div className="relative h-72 md:h-96">
                  <img
                    src={selectedStory.image}
                    alt={selectedStory.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedStory(null)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    ✕
                  </button>
                  <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                    <div className="inline-block mb-3 px-3 py-1 bg-teal/10 text-teal rounded-full text-sm font-semibold">
                      {selectedStory.tag}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                      {selectedStory.title}
                    </h2>
                    <p className="text-white/90 md:text-lg">
                      {selectedStory.subtitle}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <p className="text-foreground mb-6">
                    {selectedStory.description
                      ? selectedStory.description
                      : `Información sobre ${selectedStory.title}. Más detalles se podrán editar desde el CRUD.`}
                  </p>

                  <div className="flex gap-4">
                    <button className="flex-1 bg-gradient-to-r from-teal to-sage text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-shadow">
                      Reservar
                    </button>
                    <a
                      href={`https://wa.me/?text=Hola, quisiera más información sobre ${selectedStory.title}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-[#25D366] text-white font-semibold flex items-center gap-2 hover:bg-[#128C7E] transition-colors"
                    >
                      Consultar
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom wave */}
        <WaveDivider position="bottom" fillColor="#e3f2f1" />
      </div>
    </section>
  );
};

export default StoriesCarousel;
