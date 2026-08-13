import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { collection, getDocs, query, orderBy, limit } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

const ADMIN_EMAILS = ['admin@animos.local'];

export function initAdmin({ onReady } = {}) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = '../login.html';
      return;
    }

    const allowed = ADMIN_EMAILS.includes((user.email || '').toLowerCase());
    if (!allowed) {
      document.body.innerHTML = '<main class="admin-denied"><h1>Access denied</h1><p>Your account is not configured as an administrator.</p><a href="../dashboard.html">Return to dashboard</a></main>';
      return;
    }

    if (typeof onReady === 'function') await onReady(user);
  });
}

export async function loadUsers(max = 100) {
  const users = collection(db, 'users');
  const snap = await getDocs(query(users, orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function loadLinks(max = 100) {
  const links = collection(db, 'links');
  const snap = await getDocs(query(links, limit(max)));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}
