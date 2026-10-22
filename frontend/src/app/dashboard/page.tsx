'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { authApi } from '@/lib/auth';
import { ProfileResponse } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await authApi.getProfile();
      setProfile(data);
    } catch (error: any) {
      console.error('Failed to load profile:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('access_token');
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--canvas)' }}
      >
        <p style={{ color: 'var(--text-primary)' }}>Загрузка...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--canvas)' }}
      >
        <p style={{ color: 'var(--text-primary)' }}>Ошибка загрузки профиля</p>
      </div>
    );
  }

  const totalItems = profile.items?.length || 0;
  const totalPurchases = profile.purchases?.length || 0;
  const totalSpent = profile.purchases?.reduce((sum, p) => sum + p.price, 0) || 0;

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--canvas)' }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-8 py-4"
        style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
      >
        <h1
          className="text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          Dashboard
        </h1>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/')} fullWidth={false}>
            Маркетплейс
          </Button>
          <Button onClick={() => router.push('/profile')} fullWidth={false}>
            Профиль
          </Button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-6xl mx-auto p-8">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          Добро пожаловать, {profile?.username}!
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
          >
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Выставленные товары
            </h3>
            <p
              className="text-3xl font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {totalItems}
            </p>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
          >
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Покупки
            </h3>
            <p
              className="text-3xl font-semibold"
              style={{ color: 'var(--success)' }}
            >
              {totalPurchases}
            </p>
          </div>

          <div
            className="p-6 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
          >
            <h3
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Всего потрачено
            </h3>
            <p
              className="text-3xl font-semibold"
              style={{ color: 'var(--info)' }}
            >
              {totalSpent}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
        >
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Быстрые действия
          </h3>
          <div className="flex gap-4 flex-wrap">
            <Button onClick={() => router.push('/')} fullWidth={false}>
              Просмотреть товары
            </Button>
            <Button
              onClick={() => router.push('/profile')}
              fullWidth={false}
              style={{ backgroundColor: 'var(--info)' }}
            >
              Управление профилем
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
