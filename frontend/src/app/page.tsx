'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import { itemsApi } from '@/lib/items';
import { ItemResponse, PurchaseResponse, BookmarkResponse } from '@/lib/types';

export default function MainPage() {
  const router = useRouter();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemQuantities, setItemQuantities] = useState<Record<number, number>>({});
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastPurchase, setLastPurchase] = useState<PurchaseResponse | null>(null);
  const [buyError, setBuyError] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<number>>(new Set());
  const [bookmarkIds, setBookmarkIds] = useState<Record<number, number>>({});
  const [bookmarks, setBookmarks] = useState<BookmarkResponse[]>([]);
  const [isBookmarksPanelOpen, setIsBookmarksPanelOpen] = useState(false);

  useEffect(() => {
    loadItems();
    loadBookmarks();
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

  const loadBookmarks = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const bookmarks = await itemsApi.getBookmarks();
      const bookmarkedSet = new Set<number>();
      const bookmarkIdMap: Record<number, number> = {};
      bookmarks.forEach(b => {
        bookmarkedSet.add(b.item_id);
        bookmarkIdMap[b.item_id] = b.id;
      });
      setBookmarkedItems(bookmarkedSet);
      setBookmarkIds(bookmarkIdMap);
      setBookmarks(bookmarks);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
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

  const handleAddBookmark = async (itemId: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const bookmark = await itemsApi.addBookmark(itemId);
      setBookmarkedItems(prev => new Set(prev).add(itemId));
      setBookmarkIds(prev => ({ ...prev, [itemId]: bookmark.id }));
      await loadBookmarks();
    } catch (error: any) {
      console.error('Failed to add bookmark:', error);
    }
  };

  const handleRemoveBookmark = async (itemId: number) => {
    const bookmarkId = bookmarkIds[itemId];
    if (!bookmarkId) return;

    try {
      await itemsApi.deleteBookmark(bookmarkId);
      setBookmarkedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
      setBookmarkIds(prev => {
        const newMap = { ...prev };
        delete newMap[itemId];
        return newMap;
      });
      await loadBookmarks();
    } catch (error: any) {
      console.error('Failed to remove bookmark:', error);
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
        style={{ backgroundColor: 'var(--canvas)' }}
      >
        <p style={{ color: 'var(--text-primary)' }}>Загрузка...</p>
      </div>
    );
  }

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
          Маркетплейс
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsBookmarksPanelOpen(!isBookmarksPanelOpen)}
            className="p-2 rounded-full"
            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={bookmarks.length > 0 ? '#f44336' : 'none'}
              stroke={bookmarks.length > 0 ? '#f44336' : 'currentColor'}
              strokeWidth="2"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
              />
            </svg>
          </button>
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
      </div>

      {/* Bookmarks Panel */}
      {isBookmarksPanelOpen && (
        <div
          className="fixed top-16 right-8 w-96 max-h-96 overflow-y-auto p-4 rounded-lg shadow-lg z-50"
          style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Избранное
            </h3>
            <button
              onClick={() => setIsBookmarksPanelOpen(false)}
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}
            >
              ×
            </button>
          </div>
          {localStorage.getItem('access_token') ? (
            bookmarks.length > 0 ? (
              <div className="space-y-3">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="p-3 rounded border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <h4
                      className="font-semibold mb-1"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {bookmark.item?.name || `Товар #${bookmark.item_id}`}
                    </h4>
                    <p
                      className="text-sm mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {bookmark.item?.price} ₽
                    </p>
                    <Button
                      onClick={() => {
                        setIsBookmarksPanelOpen(false);
                      }}
                      fullWidth={false}
                      style={{ fontSize: '12px', padding: '4px 8px' }}
                    >
                      Закрыть
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p
                className="text-sm"
                style={{ color: 'var(--text-primary)' }}
              >
                Нет избранных товаров
              </p>
            )
          ) : (
            <div className="text-center">
              <p
                className="text-sm mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                Чтобы просматривать избранные товары, необходимо войти в аккаунт
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  onClick={() => {
                    setIsBookmarksPanelOpen(false);
                    router.push('/login');
                  }}
                  fullWidth={false}
                >
                  Войти
                </Button>
                <Button
                  onClick={() => {
                    setIsBookmarksPanelOpen(false);
                    router.push('/register');
                  }}
                  fullWidth={false}
                >
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Items Section */}
      <div className="max-w-7xl mx-auto p-8">
        <h2
          className="text-2xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
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
            {items.map((item, index) => (
              <div
                key={item.id}
                className="p-5 rounded-lg"
                style={{
                  backgroundColor: 'var(--surface)',
                  boxShadow: 'var(--shadow)',
                  borderRadius: index % 3 === 0 ? '12px' : index % 3 === 1 ? '8px' : '16px',
                }}
              >
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.name}
                </h3>
                <p
                  className="text-sm mb-4"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {item.description || 'Нет описания'}
                </p>
                <div className="flex gap-4 text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                  <span>Цена: {item.price}</span>
                  <span>Доступно: {item.count}</span>
                </div>
                <div className="mb-4">
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Категории: {item.categories.map(c => c.name).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}
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
                    style={{ backgroundColor: 'var(--inset)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                  />
                  <button
                    onClick={() => handleIncrement(item.id, item.count)}
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border)', color: 'var(--text-primary)' }}
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Button
                      onClick={() => handleBuy(item.id)}
                      disabled={item.count < 1}
                    >
                      Купить
                    </Button>
                  </div>
                  <Button
                    onClick={() => {
                      if (bookmarkedItems.has(item.id)) {
                        handleRemoveBookmark(item.id);
                      } else {
                        handleAddBookmark(item.id);
                      }
                    }}
                    fullWidth={false}
                    style={{ backgroundColor: bookmarkedItems.has(item.id) ? 'var(--warning)' : 'var(--info)' }}
                  >
                    {bookmarkedItems.has(item.id) ? 'Удалить из избранного' : 'В избранное'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p
            className="text-sm"
            style={{ color: 'var(--text-primary)' }}
          >
            Нет доступных товаров
          </p>
        )}
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && lastPurchase && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
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
                style={{ color: 'var(--text-primary)' }}
              >
                Покупка успешна!
              </h2>
              <div
                className="text-left p-4 rounded mb-6"
                style={{ backgroundColor: 'var(--success-bg)' }}
              >
                <p style={{ color: 'var(--text-primary)' }}>
                  <strong>ID транзакции:</strong> {lastPurchase.id}
                </p>
                <p style={{ color: 'var(--text-primary)' }}>
                  <strong>ID товара:</strong> {lastPurchase.item_id}
                </p>
                <p style={{ color: 'var(--text-primary)' }}>
                  <strong>Количество:</strong> {lastPurchase.count}
                </p>
                <p style={{ color: 'var(--text-primary)' }}>
                  <strong>Сумма:</strong> {lastPurchase.price}
                </p>
                <p style={{ color: 'var(--text-primary)' }}>
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
