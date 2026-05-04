async function loadProducts() {
  const urlParams = new URLSearchParams(window.location.search);
  const search = urlParams.get('search') || '';
  const category = urlParams.get('category') || '';
  const sort = document.getElementById('sortSelect')?.value || '';
  
  try {
    let url = `/products?search=${search}&category=${category}&sort=${sort}`;
    const products = await apiFetch(url);
    const container = document.getElementById('productsList');
    if (container) {
      if (products.length === 0) container.innerHTML = '<p>No products found.</p>';
      else container.innerHTML = products.map(renderProductCard).join('');
    }
  } catch (err) {
    console.error(err);
  }
}

async function loadCategoriesForNav() {
  try {
    const cats = await apiFetch('/categories');
    const container = document.getElementById('categorySidebar');
    if (container) {
      const urlParams = new URLSearchParams(window.location.search);
      const currentCat = urlParams.get('category');
      
      let html = `<a href="products.html" style="display:block;margin-bottom:8px;text-decoration:none;color:${!currentCat?'var(--amazon-orange)':'inherit'}">All Products</a>`;
      cats.forEach(c => {
        const isCurrent = currentCat === c.slug;
        html += `<a href="products.html?category=${c.slug}" style="display:block;margin-bottom:8px;text-decoration:none;color:${isCurrent?'var(--amazon-orange)':'inherit'}">${c.name}</a>`;
      });
      container.innerHTML = html;
    }
  } catch (err) {}
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadCategoriesForNav();
  
  const sortSelect = document.getElementById('sortSelect');
  if(sortSelect) {
    sortSelect.addEventListener('change', loadProducts);
  }
});
