'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import FormField from '@/components/FormField';
import ErrorAlert from '@/components/ErrorAlert';
import { ItemCreate } from '@/lib/types';
import { authApi } from '@/lib/auth';

export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);

  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCount, setItemCount] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemNameError, setItemNameError] = useState('');
  const [itemDescriptionError, setItemDescriptionError] = useState('');
  const [itemPriceError, setItemPriceError] = useState('');
  const [itemCountError, setItemCountError] = useState('');
  const [itemCategoryError, setItemCategoryError] = useState('');
  const [itemGeneralError, setItemGeneralError] = useState('');
  const [isItemLoading, setIsItemLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await authApi.getProfile();
        setUsername(profile.username);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token');
          router.push('/login');
        } else {
          setGeneralError('Ошибка при загрузке профиля');
        }
      } finally {
        setIsProfileLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleEditProfile = () => {
    setEditUsername(username);
    setEditPassword('');
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateItem = () => {
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemCount('');
    setItemCategory('');
    setItemNameError('');
    setItemDescriptionError('');
    setItemPriceError('');
    setItemCountError('');
    setItemCategoryError('');
    setItemGeneralError('');
    setIsItemModalOpen(true);
  };

  const handleCloseItemModal = () => {
    setIsItemModalOpen(false);
  };

  const validateEditForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');

    if (!editUsername.trim()) {
      setUsernameError('Поле "Username" обязательно для заполнения');
      isValid = false;
    }

    if (!editPassword) {
      setPasswordError('Поле "Пароль" обязательно для заполнения');
      isValid = false;
    }

    return isValid;
  };

  const validateItemForm = () => {
    let isValid = true;
    setItemNameError('');
    setItemDescriptionError('');
    setItemPriceError('');
    setItemCountError('');
    setItemCategoryError('');
    setItemGeneralError('');

    if (!itemName.trim()) {
      setItemNameError('Поле "Название" обязательно для заполнения');
      isValid = false;
    }

    if (!itemDescription.trim()) {
      setItemDescriptionError('Поле "Описание" обязательно для заполнения');
      isValid = false;
    }

    if (!itemPrice.trim()) {
      setItemPriceError('Поле "Цена" обязательно для заполнения');
      isValid = false;
    } else if (isNaN(Number(itemPrice)) || Number(itemPrice) <= 0) {
      setItemPriceError('Цена должна быть положительным числом');
      isValid = false;
    }

    if (!itemCount.trim()) {
      setItemCountError('Поле "Количество" обязательно для заполнения');
      isValid = false;
    } else if (isNaN(Number(itemCount)) || Number(itemCount) <= 0) {
      setItemCountError('Количество должно быть положительным числом');
      isValid = false;
    }

    if (!itemCategory.trim()) {
      setItemCategoryError('Поле "Категория" обязательно для заполнения');
      isValid = false;
    }

    return isValid;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEditForm()) {
      return;
    }

    setGeneralError('');
    setIsLoading(true);

    try {
      // TODO: отправить запрос на endpoint для обновления профиля
      console.log('Сохранение профиля:', { username: editUsername, password: editPassword });
      setUsername(editUsername);
      setIsModalOpen(false);
    } catch (error: any) {
      setGeneralError('Ошибка при сохранении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateItemForm()) {
      return;
    }

    setItemGeneralError('');
    setIsItemLoading(true);

    try {
      const itemData: ItemCreate = {
        name: itemName,
        description: itemDescription,
        price: Number(itemPrice),
        count: Number(itemCount),
        category: itemCategory,
      };
      await authApi.createItem(itemData);
      setIsItemModalOpen(false);
      setItemName('');
      setItemDescription('');
      setItemPrice('');
      setItemCount('');
      setItemCategory('');
    } catch (error: any) {
      if (error.response?.status === 401) {
        setItemGeneralError('Не авторизован');
      } else if (error.response?.status === 400) {
        setItemGeneralError('Неверные данные товара');
      } else if (error.response?.status === 500) {
        setItemGeneralError('Ошибка сервера. Попробуйте позже');
      } else {
        setItemGeneralError('Ошибка при создании товара');
      }
    } finally {
      setIsItemLoading(false);
    }
  };

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
          Профиль
        </h1>
        <Button onClick={handleLogout} fullWidth={false}>Выйти</Button>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-8">
        {isProfileLoading ? (
          <div
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
          >
            <p style={{ color: 'var(--text)' }}>Загрузка профиля...</p>
          </div>
        ) : (
          <>
            {/* User Info */}
            <div
              className="p-6 rounded-lg mb-8"
              style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
            >
              <div className="mb-4">
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: 'var(--text)' }}
                >
                  Username
                </p>
                <p
                  className="text-lg"
                  style={{ color: 'var(--text)' }}
                >
                  {username}
                </p>
              </div>
              <Button onClick={handleEditProfile}>Редактировать профиль</Button>
            </div>

        {/* User's Items */}
        <div
          className="p-6 rounded-lg mb-8"
          style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--text)' }}
            >
              Товары, которые вы выставили
            </h2>
            <Button onClick={handleCreateItem} fullWidth={false}>
              Создать товар
            </Button>
          </div>
          <p
            className="text-sm"
            style={{ color: 'var(--text)' }}
          >
            У вас пока нет выставленных товаров
          </p>
        </div>

        {/* Purchased Items */}
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text)' }}
          >
            Товары, которые вы купили
          </h2>
          <p
            className="text-sm"
            style={{ color: 'var(--text)' }}
          >
            Вы пока ничего не купили
          </p>
        </div>
          </>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-lg"
            style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: 'var(--text)' }}
            >
              Редактировать профиль
            </h2>

            <form onSubmit={handleSaveProfile}>
              {generalError && <ErrorAlert message={generalError} />}

              <FormField
                id="edit-username"
                label="Username"
                type="text"
                value={editUsername}
                onChange={setEditUsername}
                onClearError={() => setUsernameError('')}
                error={usernameError}
                placeholder="Введите новый логин"
              />

              <FormField
                id="edit-password"
                label="Пароль"
                type="password"
                value={editPassword}
                onChange={setEditPassword}
                onClearError={() => setPasswordError('')}
                error={passwordError}
                placeholder="Введите новый пароль"
              />

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  fullWidth={false}
                  style={{ backgroundColor: 'var(--disabled)' }}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                  fullWidth={false}
                >
                  Сохранить
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Item Modal */}
      {isItemModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-lg"
            style={{ backgroundColor: '#ffffff', boxShadow: 'var(--shadow)' }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: 'var(--text)' }}
            >
              Создать товар
            </h2>

            <form onSubmit={handleSaveItem}>
              {itemGeneralError && <ErrorAlert message={itemGeneralError} />}

              <FormField
                id="item-name"
                label="Название"
                type="text"
                value={itemName}
                onChange={setItemName}
                onClearError={() => setItemNameError('')}
                error={itemNameError}
                placeholder="Введите название товара"
              />

              <FormField
                id="item-description"
                label="Описание"
                type="text"
                value={itemDescription}
                onChange={setItemDescription}
                onClearError={() => setItemDescriptionError('')}
                error={itemDescriptionError}
                placeholder="Введите описание товара"
              />

              <FormField
                id="item-price"
                label="Цена"
                type="text"
                value={itemPrice}
                onChange={setItemPrice}
                onClearError={() => setItemPriceError('')}
                error={itemPriceError}
                placeholder="Введите цену"
              />

              <FormField
                id="item-count"
                label="Количество"
                type="text"
                value={itemCount}
                onChange={setItemCount}
                onClearError={() => setItemCountError('')}
                error={itemCountError}
                placeholder="Введите количество"
              />

              <FormField
                id="item-category"
                label="Категория"
                type="text"
                value={itemCategory}
                onChange={setItemCategory}
                onClearError={() => setItemCategoryError('')}
                error={itemCategoryError}
                placeholder="Введите категорию"
              />

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  onClick={handleCloseItemModal}
                  fullWidth={false}
                  style={{ backgroundColor: 'var(--disabled)' }}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  isLoading={isItemLoading}
                  fullWidth={false}
                >
                  Создать
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
