const fs = require('fs');
const path = require('path');

const cssToAdd = `
/* ======== PREMIUM FOOTER ======== */
.premium-footer {
  background-color: transparent;
  border-top: 1px solid var(--color-border);
  padding: 60px 40px 40px;
  max-width: 1400px;
  margin: 60px auto 0;
  font-family: var(--font-main);
}
.footer-top {
  display: grid;
  grid-template-columns: 1.5fr 1.5fr 1.5fr 3.5fr;
  gap: 40px;
  margin-bottom: 80px;
}
.footer-col h4 {
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 24px;
  color: var(--color-text-main);
  letter-spacing: 0.5px;
}
.footer-col a {
  display: block;
  font-size: 15px;
  color: var(--color-text-main);
  text-decoration: none;
  margin-bottom: 16px;
  transition: color 0.2s;
  font-weight: 500;
}
.footer-col a:hover {
  color: #64748B;
}
.footer-cards {
  display: flex;
  gap: 12px;
}
.footer-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  text-decoration: none;
}
.fc-img {
  height: 110px;
  background: black;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  text-align: center;
  line-height: 1.1;
  letter-spacing: -0.5px;
}
.fc-text {
  background: #f1f5f9;
  color: var(--color-text-main);
  font-size: 12px;
  font-weight: 800;
  padding: 16px 12px;
  text-align: left;
  letter-spacing: 0.5px;
}
.footer-middle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 40px;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 32px;
}
.payment-icons { display: flex; gap: 8px; }
.pay-icon {
  width: 44px; height: 28px; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; letter-spacing: -0.5px;
}
.social-icons { display: flex; gap: 12px; }
.social-icons a {
  width: 36px; height: 36px; border-radius: 50%; background: black; color: white; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 16px; font-weight: bold;
}
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--color-text-main);
  font-weight: 500;
}
.fb-right { display: flex; gap: 20px; align-items: center; }
.fb-right a { color: var(--color-text-main); text-decoration: none; font-weight: 500;}
.fb-right a:hover { color: #64748B; }
.region-selector { font-weight: 700; color: var(--color-text-main); display: flex; align-items: center; gap: 6px; cursor: pointer; border-left: 1px solid #ccc; padding-left:20px; margin-left: 4px; }

@media(max-width: 1024px) {
  .footer-top { grid-template-columns: repeat(2, 1fr); }
  .footer-bottom { flex-direction: column; gap: 24px; align-items: flex-start; }
}
@media(max-width: 600px) {
  .footer-top { grid-template-columns: 1fr; }
  .footer-cards { flex-direction: column; }
  .footer-middle { flex-direction: column; gap: 24px; align-items: flex-start; }
}
`;

const htmlFooter = `
<footer class="premium-footer">
  <div class="footer-top">
    <div class="footer-col">
      <h4>HELP</h4>
      <a href="#">FAQ</a>
      <a href="#">Delivery Information</a>
      <a href="#">Returns Policy</a>
      <a href="#">Make A Return</a>
      <a href="/orders.html">Orders</a>
      <a href="#">Submit a Fake</a>
    </div>
    <div class="footer-col">
      <h4>MY ACCOUNT</h4>
      <a href="/login.html">Login</a>
      <a href="/register.html">Register</a>
    </div>
    <div class="footer-col">
      <h4>PAGES</h4>
      <a href="#">RetailMart Central</a>
      <a href="#">RetailMart Loyalty</a>
      <a href="#">Careers</a>
      <a href="#">About Us</a>
      <a href="#">Student Discount</a>
      <a href="#">Training App</a>
      <a href="#">Factory List</a>
    </div>
    <div class="footer-col">
      <h4>MORE ABOUT RETAILMART</h4>
      <div class="footer-cards">
        <a href="#" class="footer-card">
          <div class="fc-img" style="font-size:22px;">RETAILMART<br><span style="font-size:12px;font-weight:600;letter-spacing:2px;">CENTRAL</span></div>
          <div class="fc-text">BLOG</div>
        </a>
        <a href="#" class="footer-card">
          <div class="fc-img" style="font-size:20px;flex-direction:column;justify-content:center;gap:4px;"><span style="font-size:11px;font-weight:600;letter-spacing:1px;opacity:0.9;">RETAILMART</span>STUDENTS</div>
          <div class="fc-text">15% STUDENT DISCOUNT</div>
        </a>
        <a href="#" class="footer-card">
          <div class="fc-img" style="font-size:36px;">✉️</div>
          <div class="fc-text">EMAIL SIGN UP</div>
        </a>
      </div>
    </div>
  </div>
  
  <div class="footer-middle">
    <div class="payment-icons">
      <span class="pay-icon" style="background:#142c8e; color:white;">VISA</span>
      <span class="pay-icon" style="background:#eb001b; color:white;">MC</span>
      <span class="pay-icon" style="background:#0079C1; color:white;">PayPal</span>
      <span class="pay-icon" style="background:#000; color:white;"> Pay</span>
    </div>
    <div class="social-icons">
      <a href="#">FB</a><a href="#">IG</a><a href="#">YT</a><a href="#">X</a><a href="#">TT</a>
    </div>
  </div>
  
  <div class="footer-bottom">
    <div class="fb-left">© 2026 | RetailMart Limited | All Rights Reserved. | We Do Retail.</div>
    <div class="fb-right">
      <a href="#">Terms and Conditions</a>
      <a href="#">Terms of Use</a>
      <a href="#">Privacy Notice</a>
      <a href="#">Cookie Policy</a>
      <a href="#">Modern Slavery</a>
      <span class="region-selector">🌐 ROW ⌄</span>
    </div>
  </div>
</footer>
`;

const publicDir = path.join(__dirname, 'public');

// Update CSS
const cssPath = path.join(publicDir, 'css', 'main.css');
let cssContent = fs.readFileSync(cssPath, 'utf8');
if (!cssContent.includes('.premium-footer')) {
  fs.writeFileSync(cssPath, cssContent + '\\n' + cssToAdd);
  console.log('Appended footer styles to main.css');
}

// Update HTML files
const htmlFiles = ['index.html', 'products.html', 'product-detail.html', 'cart.html', 'checkout.html', 'orders.html', 'profile.html'];

htmlFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Using a regex to find the old footer block and replace it
    // The old footer usually looks like:
    // <footer>
    //   <a href="/" class="footer-logo">Retail<span>Mart</span></a>
    //   <p style="margin-top: 16px;">© 2026 RetailMart. Crafted with precision.</p>
    // </footer>
    
    const footerRegex = /<footer[\s\S]*?<\/footer>/i;
    
    if (footerRegex.test(content)) {
      content = content.replace(footerRegex, htmlFooter.trim());
      fs.writeFileSync(filePath, content);
      console.log('Updated footer in', file);
    }
  }
});
