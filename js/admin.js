import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import { collection, doc, getDoc, getDocs, limit, orderBy, query } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';

export function initAdmin({ onReady } = {}) {
  return onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = '../login.html';
      return;
    }

    const userSnap = await getDoc(doc(db, 'users', user.uid));
    const role = userSnap.exists() ? userSnap.data().role : null;

    if (role !== 'admin') {
      document.body.innerHTML = '<main class="admin-denied"><h1>Access denied</h1><p>Your account does not have administrator privileges.</p><a href="../dashboard.html">Return to dashboard</a></main>';
      return;
    }

    if (typeof onReady === 'function') await onReady(user);
  });
}

export async function loadUsers(max = 100) {
  const snap = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'), limit(max)));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export async function loadLinks(max = 100) {
  const snap = await getDocs(query(collection(db, 'links'), limit(max)));
  return snap.docs.map((item) => ({ id: item.id, ...item.data() }));
}
