import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="premium-footer">
      <div className="container">
        <div className="row g-5">
          <div className="col-lg-4 col-md-6">
            <h4 className="text-white mb-4 fw-bold">
              <span className="me-2">🌍</span> TravelAdvisor
            </h4>
            <p className="mb-4">
              Discover your next great adventure. We provide the best recommendations, 
              curated just for you to ensure unforgettable experiences around the globe.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="footer-link"><i className="bi bi-facebook fs-4"></i></a>
              <a href="#" className="footer-link"><i className="bi bi-twitter fs-4"></i></a>
              <a href="#" className="footer-link"><i className="bi bi-instagram fs-4"></i></a>
            </div>
          </div>
          
          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-4 fw-bold">Explore</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/destinations" className="footer-link">Destinations</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Tours</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Experiences</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Travel Guides</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="text-white mb-4 fw-bold">Company</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#" className="footer-link">About Us</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Careers</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="#" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="col-lg-4 col-md-6">
            <h5 className="text-white mb-4 fw-bold">Newsletter</h5>
            <p className="mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <div className="input-group mb-3">
              <input type="email" className="form-control rounded-start-pill py-2 px-4" placeholder="Enter your email" aria-label="Recipient's email" />
              <button className="btn btn-premium rounded-end-pill px-4" type="button">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="row mt-5 pt-4 border-top border-secondary">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted">&copy; {new Date().getFullYear()} TravelAdvisor. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;