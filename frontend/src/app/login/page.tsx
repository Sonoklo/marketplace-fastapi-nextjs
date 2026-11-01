'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/auth';
import FormField from '@/components/FormField';
import Button from '@/components/Button';
import ErrorAlert from '@/components/ErrorAlert';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    }
  }, []);

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');

    if (!username.trim()) {
      setGeneralError('Username или пароль являються неверными');
      isValid = false;
    } else if (username.length < 1 || username.length > 20) {
      setGeneralError('Username или пароль являються неверными');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setGeneralError('Username или пароль являються неверными');
      isValid = false;
    }

    if (!password) {
      setGeneralError('Username или пароль являються неверными');
      isValid = false;
    } else if (password.length < 8 || password.length > 128) {
      setGeneralError('Username или пароль являються неверными');
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/.test(password)) {
      setGeneralError('Username или пароль являються неверными');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setGeneralError('');
    setIsLoading(true);

    try {
      const token = await authApi.login({ username, password });
      localStorage.setItem('access_token', token.access_token);
      router.push('/profile');
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setGeneralError('Неверный username или пароль');
        } else if (status === 401) {
          setGeneralError('Неверный username или пароль');
        } else if (status === 403) {
          setGeneralError('Доступ запрещён');
        } else if (status === 500) {
          setGeneralError('Ошибка сервера. Попробуйте позже');
        } else {
          setGeneralError('Произошла ошибка при авторизации');
        }
      } else {
        setGeneralError('Ошибка соединения с сервером');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--canvas)' }}
    >
      <div
        className="max-w-md w-full p-8 rounded-lg"
        style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
      >
        <h2
          className="text-2xl font-semibold mb-8"
          style={{ color: 'var(--text-primary)' }}
        >
          Вход в клиент панель
        </h2>

        <form onSubmit={handleSubmit}>
          {generalError && <ErrorAlert message={generalError} />}

          <FormField
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={setUsername}
            onClearError={() => setUsernameError('')}
            error={usernameError}
            placeholder="Введите логин"
          />

          <FormField
            id="password"
            label="Пароль"
            type="password"
            value={password}
            onChange={setPassword}
            onClearError={() => setPasswordError('')}
            error={passwordError}
            placeholder="Введите пароль"
          />

          <Button isLoading={isLoading}>Войти</Button>

          <div className="text-center mt-4">
            <Link
              href="/register"
              className="text-sm font-medium hover:opacity-80"
              style={{ color: 'var(--accent)' }}
            >
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
