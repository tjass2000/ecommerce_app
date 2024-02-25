import "./App.css";

function App() {
  return (
    <div>
      <header className="navbar">
        <div className="logo">
          <h2>Alpine</h2>
        </div>
        <div className="pagesBox">
          <ul className="pages">
            <li>Menswear</li>
            <li>Womenswear</li>
            <li>Kidswear</li>
            <li>Sales Items</li>
          </ul>
        </div>
        <div className="siteFeaturesBox">
          <ul className="siteFeatures">
            <li>Search</li>
            <li>Wishlist</li>
            <li>Account</li>
            <li>Cart</li>
          </ul>
        </div>
      </header>
      <body>
        <section className="carouselSection">
          <header>
            <h2>Staff Picks</h2>
          </header>
          <body></body>
        </section>
        <section className="infoPointSection">
          <header>
            <h2>The North Face</h2>
          </header>
          <body></body>
        </section>
        <section className="multiCarouselSection">
          <header>
            <h2>Our Latest Must-Have Products</h2>
          </header>
          <body></body>
        </section>
        <section className="saleExtendedSection">
          <header>
            <h2>Sale Extended</h2>
          </header>
          <body></body>
        </section>
        <section className="customerReviewSection">
          <header>
            <h2>Customer Reviews</h2>
          </header>
          <body></body>
        </section>
      </body>
      <footer className="footer">
        <div className="shopFooter">
          <h3>Shop</h3>
          <div className="shop">
            <ul className="shopList">
              <li>Menswear</li>
              <li>Womenswear</li>
              <li>Kidswear</li>
              <li>New Arrivals</li>
            </ul>
          </div>
        </div>
        <div className="companyFooter">
          <h3>Company</h3>
          <div className="company">
            <ul className="companyList">
              <li>About Us</li>
              <li>Our Blog</li>
              <li>FAQs</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div className="navigationFooter">
          <h3>Navigation</h3>
          <div className="navigation">
            <ul className="navigationList">
              <li>Register</li>
              <li>Cart</li>
              <li>Checkout</li>
              <li>Account</li>
            </ul>
          </div>
        </div>
        <div className="newsletterFooter">
          <h3>Join Our Newsletter</h3>
          <div className="newsletter">
            <p>
              Sign up to our newsletter and we'll email you a code worth 15% off
              your first order. By subscribing to our mailing list you agree to
              our terms and conditions
            </p>
            <input placeholder="Enter your email"></input>
          </div>
        </div>
      </footer>
      <div className="copyrightDetails">
        <div>
          <h5>© 2021 Alpine All Rights Reserved.</h5>
        </div>
        <div className="visaCards">
          <h5>p</h5>
          <h5>m</h5>
          <h5>v</h5>
          <h5>a</h5>
        </div>
      </div>
    </div>
  );
}

export default App;
