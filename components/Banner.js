import {useState, useEffect} from 'react';
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import styles from '../styles/banner.module.css';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider({
      loop: true,
      renderMode: 'performance',
      defaultAnimation: { duration: 1000, easing: (t) => t },
      created() {
        setLoaded(true)
      },
      slideChanged(slider){
        setCurrentSlide(slider.track.details.rel);
      }
  },[
    (slider) => {
      let timeout;
      function clearNextTimeout() {
        clearTimeout(timeout)
      }
      function nextTimeout() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          slider.next()
        }, 2000);
      }
      slider.on("created", () => {
        nextTimeout();
      })
      slider.on("dragStarted", clearNextTimeout);
      slider.on("animationEnded", nextTimeout);
      slider.on("updated", nextTimeout);
    },
  ]);
    
  return (
    <section className={styles.banner_section}>
      <div ref={sliderRef} className="keen-slider">
        <div className={`${styles.banner} keen-slider__slide`}>
          <Image 
            src="/images/banner1.png" 
            fill alt="banner 1" 
            quality={60} 
            priority 
            sizes='100vw'/>
        </div>
        <div className={`${styles.banner} keen-slider__slide`}>
          <Image 
            src="/images/banner2.png" 
            fill 
            alt="banner 2" 
            quality={60} 
            priority 
            sizes='100vw'/>
        </div>
      </div>
      {loaded && instanceRef.current && (
      <div className={styles.dots}>
        {[
          ...Array(instanceRef.current.track.details.slides.length).keys(),
        ].map((idx) => {
          return (
            <button
              aria-label={'slide '+idx}
              key={idx}
              onClick={() => {
                instanceRef.current?.moveToIdx(idx)
              }}
              className={`${styles.dot} ${currentSlide === idx ? styles.dot_active : ""}`}
            ></button>
          )
        })}
      </div>
    )}
    </section>
  );
}

export default Banner;
