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

    // Username validation: 1-20 chars, only a-zA-Z0-9_
    if (!username.trim()) {
      setUsernameError('Поле "Username" обязательно для заполнения');
      isValid = false;
    } else if (username.length < 1 || username.length > 20) {
      setUsernameError('Username должен содержать от 1 до 20 символов');
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameError('Username может содержать только буквы, цифры и символ подчеркивания');
      isValid = false;
    }

    // Password validation: 8-128 chars, at least one lowercase, one uppercase, one digit, one special char
    if (!password) {
      setPasswordError('Поле "Пароль" обязательно для заполнения');
      isValid = false;
    } else if (password.length < 8 || password.length > 128) {
      setPasswordError('Пароль должен содержать от 8 до 128 символов');
      isValid = false;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/.test(password)) {
      setPasswordError('Пароль должен содержать минимум одну заглавную букву, одну строчную, одну цифру и один специальный символ');
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
          setGeneralError('Неверные данные для входа');
        } else if (status === 401) {
          setGeneralError('Не авторизован');
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
          style={{ color: 'var(--ink)' }}
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
          <p
            className="text-xs mt-1 mb-4"
            style={{ color: 'var(--muted)' }}
          >
            Требования: 1-20 символов, только буквы, цифры и символ подчеркивания
          </p>

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
          <p
            className="text-xs mt-1 mb-4"
            style={{ color: 'var(--muted)' }}
          >
            Требования: 8-128 символов, минимум одна заглавная буква, одна строчная, одна цифра и один специальный символ
          </p>

          <Button isLoading={isLoading}>Войти</Button>

          <div className="text-center mt-4">
            <Link
              href="/register"
              className="text-sm font-medium hover:opacity-80"
              style={{ color: 'var(--primary)' }}
            >
              Зарегистрироваться
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
