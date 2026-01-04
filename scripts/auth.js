// scripts/auth.js - simple prototype auth + page protection
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      if (!username || !password) return alert('Enter email & password');
      localStorage.setItem('mindcareUser', username);
      // redirect to first test page
      window.location.href = 'pages/memory.html';
    });
  }

  // simple page guard
  const protectedPages = [
    'memory.html','visual.html','orientation.html','attention.html',
    'language.html','executive.html','mood.html','patterns.html','report.html'
  ];
  const path = window.location.pathname.split('/').pop();
  if (protectedPages.includes(path) && !localStorage.getItem('mindcareUser')) {
    alert('Please sign in first.');
    window.location.href = '/login.html';
  }
});
