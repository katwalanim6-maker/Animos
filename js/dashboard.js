import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { doc, getDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const welcomeText = document.getElementById('welcomeText');
const username = document.getElementById('username');
const email = document.getElementById('email');
const logoutBtn = document.getElementById('logoutBtn');
const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const profilePic = document.getElementById('profilePic');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    const data = snap.exists() ? snap.data() : {};
    const name = data.displayName || data.name || 'there';
    welcomeText.textContent = `Welcome back, ${name} 👋`;
    username.textContent = data.displayName || data.name || 'User';
    email.textContent = data.email || user.email || '';
    if (data.photoURL) profilePic.src = data.photoURL;
  } catch (error) {
    console.error('Dashboard load failed:', error);
    welcomeText.textContent = 'Welcome back 👋';
  }

  uploadBtn?.addEventListener('click', () => fileInput?.click());

  fileInput?.addEventListener('change', async () => {
    const file = fileInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please choose an image file.');
    if (file.size > 5 * 1024 * 1024) return alert('Please choose an image smaller than 5 MB.');

    uploadBtn.disabled = true;
    uploadBtn.textContent = 'Uploading...';
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'animos-profile');
      const response = await fetch('https://api.cloudinary.com/v1_1/bdya7qoz/image/upload', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok || !result.secure_url) throw new Error(result.error?.message || 'Cloudinary upload failed.');
      await updateDoc(ref, { photoURL: result.secure_url });
      profilePic.src = result.secure_url;
      uploadBtn.textContent = 'Uploaded ✓';
    } catch (error) {
      console.error(error);
      uploadBtn.textContent = 'Upload failed';
      alert(error.message || 'Could not upload the image.');
    } finally {
      setTimeout(() => { uploadBtn.disabled = false; uploadBtn.textContent = 'Upload Profile Picture'; }, 1200);
      fileInput.value = '';
    }
  });
});

logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
    window.location.href = 'login.html';
  } catch (error) {
    console.error(error);
    alert('Logout failed. Please try again.');
  }
});
