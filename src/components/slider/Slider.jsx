import { useState, useEffect, useRef } from "react";
import "./slider.css"; // We'll write this later

const Slider = ({ slides }) => {
  // Track current slide index (starts at 1 because we prepended a clone)
  const [currentIndex, setCurrentIndex] = useState(1);
  // Control CSS transitions (disable during reset)
  const [isTransitioning, setIsTransitioning] = useState(true);
  // Reference to the slider track
  const sliderRef = useRef();

  // Clone slides: [lastSlide, ...originalSlides, firstSlide]
  const clonedSlides = [
    slides[slides.length - 1], // Last slide (clone)
    ...slides, // Original slides
    slides[0], // First slide (clone)
  ];

  // Go to next slide
  const goToNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true); // Enable transition
  };

  // Go to previous slide
  const goToPrev = () => {
    setCurrentIndex((prev) => prev - 1);
    setIsTransitioning(true);
  };

  // Handle slide reset (when reaching a clone)
  useEffect(() => {
    const slider = sliderRef.current;

    // If we reach the last clone (cloned first slide), reset silently
    if (currentIndex === clonedSlides.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false); // Disable transition
        setCurrentIndex(1); // Jump to real first slide
      }, 500); // Match this to CSS transition time
    }

    // If we reach the first clone (cloned last slide), reset silently
    if (currentIndex === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(clonedSlides.length - 2); // Jump to real last slide
      }, 500);
    }

    // Re-enable transitions after reset
    if (
      (currentIndex === 1 || currentIndex === clonedSlides.length - 2) &&
      !isTransitioning
    ) {
      setTimeout(() => setIsTransitioning(true), 10);
    }
  }, [currentIndex]);

  return (
    <div className="slider-container">
      <div
        ref={sliderRef}
        className="slider-track"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: isTransitioning ? "transform 0.5s ease" : "none",
        }}>
        {clonedSlides.map((slide, index) => (
          <div key={index} className="slide">
            {slide}
          </div>
        ))}
      </div>
      <button className="slider-btn prev" onClick={goToPrev}>
        &lt;
      </button>
      <button className="slider-btn next" onClick={goToNext}>
        &gt;
      </button>
    </div>
  );
};

export default Slider;
