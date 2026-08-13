import { db } from './firebase.js';
import { collection, getDocs, query, where, limit } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const params = new URLSearchParams(window.location.search);
const username = (params.get('u') || '').trim().replace(/^@+/, '').toLowerCase();
const displayName = document.getElementById('displayName');
const usernameEl = document.getElementById('username');
const bio = document.getElementById('bio');
const locationEl = document.getElementById('location');
const website = document.getElementById('website');

async function loadProfile() {
  if (!username) {
    displayName.textContent = 'Profile not found';
    return;
  }

  try {
    const snap = await getDocs(query(collection(db, 'users'), where('username', '==', username), limit(1)));
    if (snap.empty) {
      displayName.textContent = 'Profile not found';
      return;
    }

    const data = snap.docs[0].data();
    displayName.textContent = data.displayName || data.name || 'Unnamed user';
    usernameEl.textContent = data.username ? `@${data.username}` : '';
    bio.textContent = data.bio || '';
    locationEl.textContent = data.location || '';

    if (data.website) {
      try {
        const parsed = new URL(data.website);
        if (['http:', 'https:'].includes(parsed.protocol)) {
          website.href = parsed.href;
          website.textContent = parsed.href;
          website.rel = 'noopener noreferrer';
        }
      } catch { /* Ignore invalid profile URL. */ }
    }
  } catch (error) {
    console.error('Profile load failed:', error);
    displayName.textContent = 'Unable to load profile';
  }
}

loadProfile();
