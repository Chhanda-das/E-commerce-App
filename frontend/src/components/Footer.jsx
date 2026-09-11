
import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css";

const Footer = () => {
    return (
        <footer className="forever-footer">

            <div className="footer-main">

                {/* BRAND */}

                <div className="footer-brand">

                    <Link to="/" className="footer-logo">
                        FOREVER<span>.</span>
                    </Link>

                    <div className="footer-brand-line"></div>

                    <p className="footer-description">
                        Timeless essentials, modern silhouettes, and
                        pieces designed to stay with you.
                    </p>

                    <div className="footer-signature">
                        <span></span>

                        <p>
                            STYLE&nbsp;&nbsp;•&nbsp;&nbsp;
                            QUALITY&nbsp;&nbsp;•&nbsp;&nbsp;
                            FOREVER
                        </p>
                    </div>

                </div>


                {/* EXPLORE */}

                <div className="footer-column">

                    <div className="footer-heading">

                        <span className="footer-number">
                            01
                        </span>

                        <h3>
                            EXPLORE
                        </h3>

                    </div>

                    <div className="footer-heading-line"></div>

                    <div className="footer-links">

                        <Link to="/">
                            Home
                        </Link>

                        <Link to="/collection">
                            Collection
                        </Link>

                        <Link to="/footwear">
                            Footwear
                        </Link>

                        <Link to="/about">
                            About Us
                        </Link>

                        <Link to="/contact">
                            Contact
                        </Link>

                    </div>

                </div>


                {/* GET IN TOUCH */}

                <div className="footer-column">

                    <div className="footer-heading">

                        <span className="footer-number">
                            02
                        </span>

                        <h3>
                            GET IN TOUCH
                        </h3>

                    </div>

                    <div className="footer-heading-line"></div>

                    <div className="footer-contact">

                        <div className="footer-contact-item">

                            <span className="footer-label">
                                PHONE
                            </span>

                            <a href="tel:+12124567890">
                                +1-212-456-7890
                            </a>

                        </div>


                        <div className="footer-contact-item">

                            <span className="footer-label">
                                EMAIL
                            </span>

                            <a href="mailto:contact@foreveryou.com">
                                contact@foreveryou.com
                            </a>

                        </div>


                        <div className="footer-social">

                            <a
                                href="#"
                                aria-label="Instagram"
                            >
                                IG
                            </a>

                            <a
                                href="#"
                                aria-label="Facebook"
                            >
                                FB
                            </a>

                            <a
                                href="#"
                                aria-label="Pinterest"
                            >
                                PIN
                            </a>

                        </div>

                    </div>

                </div>

            </div>


            {/* COPYRIGHT */}

            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} FOREVER.COM
                    &nbsp;—&nbsp;
                    ALL RIGHTS RESERVED.
                </p>

                <p className="footer-bottom-right">
                    DESIGNED FOR EVERYDAY LIVING
                </p>

            </div>

        </footer>
    );
};

export default Footer;

