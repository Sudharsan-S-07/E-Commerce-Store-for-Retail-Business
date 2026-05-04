requireAuth();

async function loadProfile() {
  try {
    const profile = await apiFetch('/customers/profile');
    document.getElementById('name').value = profile.name || '';
    document.getElementById('email').value = profile.email || '';
    document.getElementById('phone').value = profile.phone || '';
    document.getElementById('address').value = profile.address || '';
    document.getElementById('city').value = profile.city || '';
    document.getElementById('pincode').value = profile.pincode || '';
  } catch (err) {
    showToast('Failed to load profile', 'error');
  }
}

async function saveProfile(e) {
  e.preventDefault();
  const btn = document.getElementById('btnSave');
  btn.disabled = true;
  btn.textContent = 'Saving...';
  
  const payload = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    pincode: document.getElementById('pincode').value
  };
  
  try {
    await apiFetch('/customers/profile', { method: 'PUT', body: JSON.stringify(payload) });
    showToast('Profile updated successfully!');
    
    // update localstorage name if changed
    const user = getUser();
    if(user) {
      user.name = payload.name;
      localStorage.setItem('user', JSON.stringify(user));
      renderHeaderNav();
    }
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Save Changes';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  document.getElementById('profileForm').addEventListener('submit', saveProfile);
});
