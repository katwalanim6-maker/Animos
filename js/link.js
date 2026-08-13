import { auth, db } from './firebase.js';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

const title = document.getElementById('title');
const url = document.getElementById('url');
const addBtn = document.getElementById('addBtn');
const list = document.getElementById('linksList');

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  loadLinks(user.uid);

  addBtn?.addEventListener('click', async () => {
    const linkTitle = title.value.trim();
    const rawUrl = url.value.trim();
    if (!linkTitle || !rawUrl) return alert('Please enter both a title and URL.');

    let parsed;
    try {
      parsed = new URL(rawUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Only HTTP(S) URLs are allowed.');
    } catch {
      return alert('Please enter a valid HTTP or HTTPS URL.');
    }

    addBtn.disabled = true;
    try {
      await addDoc(collection(db, 'links'), {
        uid: user.uid,
        title: linkTitle,
        url: parsed.href,
        createdAt: serverTimestamp()
      });
      title.value = '';
      url.value = '';
      await loadLinks(user.uid);
    } catch (error) {
      console.error(error);
      alert('Could not save the link. Check your Firestore rules.');
    } finally {
      addBtn.disabled = false;
    }
  });
});

async function loadLinks(uid) {
  if (!list) return;
  list.replaceChildren();
  try {
    const snap = await getDocs(query(collection(db, 'links'), where('uid', '==', uid)));
    if (snap.empty) {
      const empty = document.createElement('p');
      empty.textContent = 'No links yet.';
      list.appendChild(empty);
      return;
    }

    snap.forEach((item) => {
      const data = item.data();
      const wrapper = document.createElement('div');
      wrapper.className = 'link-item';
      const name = document.createElement('b');
      name.textContent = data.title || 'Untitled link';
      const anchor = document.createElement('a');
      anchor.href = data.url || '#';
      anchor.textContent = data.url || '';
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      wrapper.append(name, document.createElement('br'), anchor);
      list.appendChild(wrapper);
    });
  } catch (error) {
    console.error(error);
    const message = document.createElement('p');
    message.textContent = 'Unable to load links.';
    list.appendChild(message);
  }
}
