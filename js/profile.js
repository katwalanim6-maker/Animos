import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const displayName = document.getElementById('displayName');
const username = document.getElementById('username');
const bio = document.getElementById('bio');
const locationField = document.getElementById('location');
const website = document.getElementById('website');
const saveBtn = document.getElementById('saveBtn');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      displayName.value = data.displayName || data.name || '';
      username.value = data.username || '';
      bio.value = data.bio || '';
      locationField.value = data.location || '';
      website.value = data.website || '';
    }
  } catch (error) {
    console.error(error);
    alert('Could not load your profile.');
  }

  saveBtn?.addEventListener('click', async () => {
    const cleanUsername = username.value.trim().replace(/^@+/, '').toLowerCase();
    if (cleanUsername && !/^[a-z0-9._-]{3,30}$/.test(cleanUsername)) {
      return alert('Username must be 3–30 characters and use letters, numbers, dots, underscores or hyphens.');
    }

    if (website.value.trim()) {
      try { new URL(website.value.trim()); } catch { return alert('Please enter a valid website URL.'); }
    }

    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    try {
      await setDoc(ref, {
        displayName: displayName.value.trim(),
        username: cleanUsername,
        bio: bio.value.trim(),
        location: locationField.value.trim(),
        website: website.value.trim(),
        email: user.email
      }, { merge: true });
      alert('Profile saved.');
    } catch (error) {
      console.error(error);
      alert('Profile could not be saved. Check your Firestore rules.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Profile';
    }
  });
});
