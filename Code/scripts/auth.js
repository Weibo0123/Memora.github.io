import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Replace with your Supabase project values or set them on window before this script runs.
const SUPABASE_URL = window.SUPABASE_URL || 'https://nfxoeqquydyvitftcntp.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'sb_publishable_BE78sz1BcfCAJT0QnLbAeg_kc0TuYJj';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loginScreen = document.getElementById('login-screen');
const appRoot = document.getElementById('app');
const signUpBtn = document.getElementById('signUpBtn');
const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('authEmail');
const passInput = document.getElementById('authPassword');
const authMessage = document.getElementById('authMessage');

function showMessage(msg, isError = false) {
  authMessage.textContent = msg;
  authMessage.style.display = 'block';
  authMessage.style.background = isError ? '#fee' : '#e8f8f5';
  authMessage.style.color = isError ? '#c0392b' : '#2c3e50';
  setTimeout(() => authMessage.style.display = 'none', 4000);
}

async function handleSignUp() {
  const email = emailInput.value.trim();
  const password = passInput.value;
  if (!email || !password) { showMessage('Please provide email and password', true); return; }
  try {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return showMessage(error.message || 'Sign up failed', true);
    showMessage('Sign up sent — check your email for confirmation.');
  } catch (e) {
    showMessage(e.message || 'Sign up error', true);
  }
}

async function handleLogin() {
  const email = emailInput.value.trim();
  const password = passInput.value;
  if (!email || !password) { showMessage('Please provide email and password', true); return; }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return showMessage(error.message || 'Login failed', true);
    if (data?.session) {
      // authenticated
      showApp();
    } else {
      showMessage('Logged in (no session returned)', false);
      showApp();
    }
  } catch (e) {
    showMessage(e.message || 'Login error', true);
  }
}

function showApp() {
  if (loginScreen) loginScreen.style.display = 'none';
  if (appRoot) appRoot.style.display = '';
}

function hideApp() {
  if (loginScreen) loginScreen.style.display = '';
  if (appRoot) appRoot.style.display = 'none';
}

// monitor auth state changes and persist session across refresh
supabase.auth.getSession().then(({ data: { session } }) => {
  if (session) {
    showApp();
  } else {
    hideApp();
  }
});

supabase.auth.onAuthStateChange((event, session) => {
  if (session) showApp();
  else hideApp();
});

signUpBtn.addEventListener('click', handleSignUp);
loginBtn.addEventListener('click', handleLogin);

// Expose supabase client for debugging if needed
window.supabase = supabase;
