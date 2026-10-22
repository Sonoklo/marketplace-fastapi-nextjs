'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { itemsApi } from '@/lib/items';
import { ItemResponse, PurchaseResponse } from '@/lib/types';

export default function MainPage() {
  const router = useRouter();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastPurchase, setLastPurchase] = useState<PurchaseResponse | null>(null);
  const [buyError, setBuyError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await itemsApi.getAllItems();
      setItems(data);
      const initialQuantities: Record<number, number> = {};
      data.forEach(item => {
        initialQuantities[item.id] = 1;
      });
      setItemQuantities(initialQuantities);
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (itemId: number, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      setItemQuantities(prev => ({ ...prev, [itemId]: numValue }));
    }
  };

  const handleIncrement = (itemId: number, maxCount: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: Math.min(prev[itemId] + 1, maxCount)
    }));
  };

  const handleDecrement = (itemId: number) => {
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 1)
    }));
  };

  const handleBuy = async (itemId: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    const quantity = itemQuantities[itemId];
    if (!quantity || quantity < 1) return;

    setBuyError('');
    try {
      const purchase = await itemsApi.buyItem(itemId, quantity);
      setLastPurchase(purchase);
      setIsSuccessModalOpen(true);
      await loadItems();
    } catch (error: any) {
      setBuyError(error.response?.data?.detail || 'Ошибка при покупке товара');
    }
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setLastPurchase(null);
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background-color)' }}
      >
        <p style={{ color: 'var(--text)' }}>Загрузка...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background-color)' }}
    >
      {/* Header */}
      <div
        className="flex justify-between items-center px-8 py-4"
        style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--border)' }}
      >
        <h1
          className="text-xl font-semibold"
          style={{ color: 'var(--text)' }}
        >
          Маркетплейс
        </h1>
        <Button
          onClick={() => {
            const token = localStorage.getItem('access_token');
            if (token) {
              router.push('/profile');
            } else {
              router.push('/login');
            }
          }}
          fullWidth={false}
        >
          Профиль
        </Button>
      </div>

      {/* Items Grid */}
      <div className="max-w-7xl mx-auto p-8">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text)' }}
        >
          Доступные товары
        </h2>
        {buyError && (
          <div
            className="mb-4 px-4 py-3 rounded"
            style={{
              backgroundColor: 'var(--error-bg)',
              color: 'var(--error)',
              border: `1px solid var(--error)`,
            }}
          >
            {buyError}
          </div>
        )}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-lg"
                style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text)' }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: 'var(--text)' }}
                >
                  {item.description || 'Нет описания'}
                </p>
                <div className="flex gap-4 text-sm mb-4" style={{ color: 'var(--text)' }}>
                  <span>Цена: {item.price}</span>
                  <span>Доступно: {item.count}</span>
                </div>
                <div className="mb-4">
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'var(--text)' }}
                  >
                    Категории: {item.categories.map(c => c.name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={item.count}
                    value={itemQuantities[item.id] || 1}
                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    className="w-16 text-center border rounded py-1"
                    style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
                  />
                  <button
                    onClick={() => handleIncrement(item.id, item.count)}
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border)', color: 'var(--text)' }}
                  >
                    +
                  </button>
                </div>
                <Button
                  onClick={() => handleBuy(item.id)}
                  disabled={item.count < 1}
                >
                  Купить
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p
            className="text-sm"
            style={{ color: 'var(--text)' }}
          >
            Нет доступных товаров
          </p>
        )}
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && lastPurchase && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-lg"
            style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2
                className="text-xl font-semibold mb-4"
                style={{ color: 'var(--text)' }}
              >
                Покупка успешна!
              </h2>
              <div
                className="text-left p-4 rounded mb-6"
                style={{ backgroundColor: 'var(--success-bg)' }}
              >
                <p style={{ color: 'var(--text)' }}>
                  <strong>ID транзакции:</strong> {lastPurchase.id}
                </p>
                <p style={{ color: 'var(--text)' }}>
                  <strong>ID товара:</strong> {lastPurchase.item_id}
                </p>
                <p style={{ color: 'var(--text)' }}>
                  <strong>Количество:</strong> {lastPurchase.count}
                </p>
                <p style={{ color: 'var(--text)' }}>
                  <strong>Сумма:</strong> {lastPurchase.price}
                </p>
                <p style={{ color: 'var(--text)' }}>
                  <strong>Дата:</strong> {new Date(lastPurchase.created_at).toLocaleString()}
                </p>
              </div>
              <Button onClick={handleCloseSuccessModal}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
