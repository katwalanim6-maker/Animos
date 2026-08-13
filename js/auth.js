import { auth } from './firebase.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

export function watchAuth({ requireAuth = false, redirect = 'login.html', onUser } = {}) {
  return onAuthStateChanged(auth, async (user) => {
    if (requireAuth && !user) {
      window.location.href = redirect;
      return;
    }
    if (typeof onUser === 'function') await onUser(user);
  });
}

export async function logout(redirect = 'login.html') {
  await signOut(auth);
  window.location.href = redirect;
}

export function requireAuth(redirect = 'login.html', onUser) {
  return watchAuth({ requireAuth: true, redirect, onUser });
}
