// ========== AUTHENTICATION COOKIE MANAGEMENT ==========
const fs = require('fs');
const path = require('path');

const AUTH_COOKIE_NAME = 'auth';
const AUTH_COOKIE_PATH = '/auth';
const COOKIE_FILE = path.join(__dirname, 'cookie.txt');

// Set authentication cookie (for file-based storage)
function setAuthCookie(token, expiresInDays = 7) {
  const date = new Date();
  date.setTime(date.getTime() + (expiresInDays * 24 * 60 * 60 * 1000));
  const cookieContent = `AUTH_TOKEN=${token}\nCREATED_AT=${new Date().toISOString()}\nEXPIRES=${date.toISOString()}\nPATH=${AUTH_COOKIE_PATH}\n`;
  fs.writeFileSync(COOKIE_FILE, cookieContent, 'utf8');
}

// Get authentication cookie
function getAuthCookie() {
  try {
    if (fs.existsSync(COOKIE_FILE)) {
      const content = fs.readFileSync(COOKIE_FILE, 'utf8');
      const lines = content.split('\n');
      for (let line of lines) {
        if (line.startsWith('AUTH_TOKEN=')) {
          return line.substring('AUTH_TOKEN='.length);
        }
      }
    }
  } catch (err) {
    console.error('Error reading cookie file:', err);
  }
  return null;
}

// Delete authentication cookie
function deleteAuthCookie() {
  try {
    if (fs.existsSync(COOKIE_FILE)) {
      fs.unlinkSync(COOKIE_FILE);
    }
  } catch (err) {
    console.error('Error deleting cookie file:', err);
  }
}

// Check if user is authenticated
function isAuthenticated() {
  return getAuthCookie() !== null;
}

// Initialize auth on page load
function initializeAuth() {
  if (isAuthenticated()) {
    console.log('User authenticated with token:', getAuthCookie());
  } else {
    const newToken = generateAuthToken();
    setAuthCookie(newToken);
    console.log('New auth token created:', newToken);
  }
}

// Generate a simple auth token (UUID-like)
function generateAuthToken() {
  return 'auth_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Create and save cookie.txt file
function saveCookieToFile() {
  const token = getAuthCookie();
  if (!token) {
    console.error('No auth cookie found');
    return;
  }
  console.log('Cookie saved to:', COOKIE_FILE);
}

// ========== END AUTHENTICATION COOKIE MANAGEMENT ==========

// Initialize auth when this script loads
function initializeAuthAndSave() {
  initializeAuth();
  saveCookieToFile();
}

initializeAuthAndSave();
