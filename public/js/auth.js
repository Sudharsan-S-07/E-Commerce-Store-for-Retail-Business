function getUser() {
  try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

function renderHeaderNav() {
  const nav = document.getElementById('headerNav');
  if (!nav) return;
  const user = getUser();
  if (user) {
    nav.innerHTML = `
      <div class="header-nav-item" onclick="window.location.href='/orders.html'">
        <div class="nav-line1">Returns &</div>
        <div class="nav-line2">Orders</div>
      </div>
      <div class="header-nav-item" onclick="window.location.href='/profile.html'">
        <div class="nav-line1">Hello, ${user.name.split(' ')[0]}</div>
        <div class="nav-line2">Account</div>
      </div>
      <div class="header-nav-item" onclick="logout()">
        <div class="nav-line2">Logout</div>
      </div>
      <div class="header-nav-item cart-icon" onclick="window.location.href='/cart.html'">
        <span class="cart-count" id="cartCountBadge">0</span>
        <div class="nav-line2">🛒 Cart</div>
      </div>
    `;
  } else {
    nav.innerHTML = `
      <div class="header-nav-item" onclick="window.location.href='/login.html'">
        <div class="nav-line1">Hello, sign in</div>
        <div class="nav-line2">Account & Lists</div>
      </div>
      <div class="header-nav-item cart-icon" onclick="window.location.href='/cart.html'">
        <span class="cart-count" id="cartCountBadge">0</span>
        <div class="nav-line2">🛒 Cart</div>
      </div>
    `;
  }
}

function requireAuth() {
  if (!getUser()) window.location.href = '/login.html';
}

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== 'admin') window.location.href = '/login.html';
}
