import React, {
  useEffect,
  useState,
} from 'react'

import { assets } from '../assets/assets'
import './css/hero.css'


import top1 from '../assets/Hero/top1.jpg'
import top2 from '../assets/Hero/top2.jpg'
import top3 from '../assets/Hero/top3.jpg'
import top4 from '../assets/Hero/top4.jpg'
import top5 from '../assets/Hero/top5.jpg'
import top6 from '../assets/Hero/top6.jpg'
import top7 from '../assets/Hero/top7.jpg'
import top8 from '../assets/Hero/top8.jpg'
import shirt from '../assets/Hero/shirt.jpg'
import tshirt from '../assets/Hero/t-shirt.jpg'
import shoe2 from '../assets/Hero/shoe2.jpg'


const Hero = () => {

  /* =========================================
     HERO IMAGES
     ========================================= */

  const heroImages = [
    top1,
    top2,
    top3,
    top4,
    top5,
    top6,
    top7,
    top8,
    shirt,
    tshirt,
    shoe2,
  ]


  /* =========================================
     SLIDER STATE
     ========================================= */

  const [currentIndex, setCurrentIndex] =
    useState(0)


  const [isChanging, setIsChanging] =
    useState(false)


  /* =========================================
     AUTOMATIC SLIDER
     ========================================= */

  useEffect(() => {

    const interval = setInterval(() => {

      setIsChanging(true)

      setTimeout(() => {

        setCurrentIndex(
          (prevIndex) =>
            (prevIndex + 1) %
            heroImages.length
        )

        setIsChanging(false)

      }, 350)

    }, 3500)


    return () => {
      clearInterval(interval)
    }

  }, [])


  return (

    <section className="hero">


      {/* =====================================
          Hero Left Side
          ===================================== */}

      <div className="hero-content">

        <div className="hero-content-inner">


          {/* Bestseller Label */}

          <div className="hero-label">

            <span className="hero-label-line"></span>

            <p className="hero-label-text">
              OUR BESTSELLERS
            </p>

          </div>


          {/* Main Heading */}

          <h1 className="hero-title">
            Latest Arrivals
          </h1>


          {/* Description */}

          <p className="hero-description">

            Discover the latest styles,
            timeless essentials and
            statement pieces curated
            for your wardrobe.

          </p>


          {/* Shop Now */}

          <div className="hero-shop">

            <p className="hero-shop-text">
              SHOP NOW
            </p>

            <span className="hero-shop-line"></span>

          </div>


          {/* Counter */}

          <div className="hero-counter">

            <span className="hero-counter-number">

              {String(
                currentIndex + 1
              ).padStart(2, '0')}

            </span>


            <span className="hero-counter-line"></span>


            <span className="hero-counter-total">

              {String(
                heroImages.length
              ).padStart(3, '0')}

            </span>

          </div>


        </div>

      </div>


      {/* =====================================
          Hero Right Side
          ===================================== */}

      <div className="hero-image-wrapper">


        {/* Large Background Number */}

        <div className="hero-big-number">

          {String(
            currentIndex + 1
          ).padStart(3, '0')}

        </div>


        {/* Product Image */}

        <img
          key={currentIndex}
          className={`hero-image ${
            isChanging
              ? 'hero-image-changing'
              : ''
          }`}
          src={
            heroImages[currentIndex] ||
            assets.hero_img
          }
          alt="Latest Arrivals"
        />


        {/* Image Overlay */}

        <div className="hero-image-overlay"></div>


        {/* Bottom Dots */}

        <div className="hero-dots">

          {heroImages.map(
            (_, index) => (

              <span
                key={index}
                className={`hero-dot ${
                  currentIndex === index
                    ? 'active'
                    : ''
                }`}
              ></span>

            )
          )}

        </div>


        {/* Image Counter */}

        <div className="hero-image-number">

          <span>

            {String(
              currentIndex + 1
            ).padStart(3, '0')}

          </span>


          <span className="number-divider"></span>


          <span>

            {String(
              heroImages.length
            ).padStart(3, '0')}

          </span>

        </div>


      </div>


    </section>

  )
}

export default Hero