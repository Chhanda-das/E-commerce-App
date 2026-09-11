import React from 'react';
import { assets } from '../assets/assets';
import './css/OurPolicy.css';

const OurPolicy = () => {
  return (
    <section className="our-policy">

      {/* Section Heading */}
      <div className="policy-heading">

        <span className="policy-heading-line"></span>

        <p className="policy-eyebrow">
          THE FOREVER PROMISE
        </p>

        <span className="policy-heading-line"></span>

      </div>

      <h2 className="policy-title">
        Crafted Around <span>Your Experience</span>
      </h2>

      <p className="policy-subtitle">
        Thoughtful service, effortless returns and dedicated support —
        because every order deserves a little more care.
      </p>


      {/* Policy Cards */}
      <div className="policy-container">

        {/* Policy 01 */}
        <div className="policy-card">

          <div className="policy-number">
            01
          </div>

          <div className="policy-icon-wrapper">
            <img
              src={assets.exchange_icon}
              className="policy-icon"
              alt="Easy Exchange Policy"
            />
          </div>

          <div className="policy-content">

            <p className="policy-card-title">
              Easy Exchange
            </p>

            <p className="policy-card-description">
              We make exchanges simple, smooth and completely
              hassle-free.
            </p>

          </div>

          <div className="policy-card-line"></div>

        </div>


        {/* Policy 02 */}
        <div className="policy-card">

          <div className="policy-number">
            02
          </div>

          <div className="policy-icon-wrapper">
            <img
              src={assets.quality_icon}
              className="policy-icon"
              alt="7 Days Return Policy"
            />
          </div>

          <div className="policy-content">

            <p className="policy-card-title">
              7 Days Returns
            </p>

            <p className="policy-card-description">
              Shop with confidence with our convenient
              7-day return promise.
            </p>

          </div>

          <div className="policy-card-line"></div>

        </div>


        {/* Policy 03 */}
        <div className="policy-card">

          <div className="policy-number">
            03
          </div>

          <div className="policy-icon-wrapper">
            <img
              src={assets.support_img}
              className="policy-icon"
              alt="Best Customer Support"
            />
          </div>

          <div className="policy-content">

            <p className="policy-card-title">
              Personal Support
            </p>

            <p className="policy-card-description">
              Our dedicated support team is here whenever
              you need us.
            </p>

          </div>

          <div className="policy-card-line"></div>

        </div>

      </div>

    </section>
  );
};

export default OurPolicy;