import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const EXPIRES_IN = 60 * 60 * 1000;
let initialToken, initialUserId;
let logoutTimer;
try {
  const initialData = JSON.parse(localStorage.getItem('userData'));
  const expirationDate = new Date(initialData.expiration);
  if (expirationDate > new Date()) {
    initialUserId = initialData.userId;
    initialToken = initialData.token;
    logoutTimer = expirationDate.getTime() - new Date().getTime();
  } else {
    localStorage.removeItem('userData');
  }
} catch (error) {
  localStorage.removeItem('userData');
}

export default function useAuth() {
  const [token, setToken] = useState(initialToken ?? '');
  const [userId, setUserId] = useState(initialUserId ?? '');
  const timerRef = useRef();

  const login = useCallback((uid, token) => {
    setToken(token);
    setUserId(uid);
    const expirationDate = new Date(new Date().getTime() + EXPIRES_IN);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token,
        expiration: expirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken('');
    setUserId('');
    localStorage.removeItem('userData');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    timerRef.current = setTimeout(logout, logoutTimer ?? EXPIRES_IN);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [logout, token]);

  return useMemo(
    () => ({ login, logout, token, userId }),
    [login, logout, token, userId]
  );
}
