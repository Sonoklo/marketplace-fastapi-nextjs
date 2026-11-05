'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';
import FormField from '@/components/FormField';
import ErrorAlert from '@/components/ErrorAlert';
import { authApi } from '@/lib/auth';
import { itemsApi } from '@/lib/items';
import { ItemCreate, ItemUpdate, ProfileResponse, ItemResponse, AccountUpdate } from '@/lib/types';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemResponse | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);

  const [editUsername, setEditUsername] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRepeatPassword, setEditRepeatPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [repeatPasswordError, setRepeatPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);

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

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
  };

  const handleEditProfile = () => {
    if (!profile) return;
    setEditUsername(profile.username);
    setEditEmail(profile.email);
    setEditPassword('');
    setEditRepeatPassword('');
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setRepeatPasswordError('');
    setGeneralError('');
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const validateEditForm = () => {
    let isValid = true;
    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setRepeatPasswordError('');
    setGeneralError('');

    if (editUsername.trim()) {
      if (editUsername.length < 1 || editUsername.length > 20) {
        setUsernameError('Username должен содержать от 1 до 20 символов');
        isValid = false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(editUsername)) {
        setUsernameError('Username может содержать только буквы, цифры и символ подчеркивания');
        isValid = false;
      }
    }

    if (editEmail.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editEmail)) {
        setEmailError('Введите корректный email адрес');
        isValid = false;
      }
    }

    if (editPassword) {
      if (editPassword.length < 8 || editPassword.length > 128) {
        setPasswordError('Пароль должен содержать от 8 до 128 символов');
        isValid = false;
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).+$/.test(editPassword)) {
        setPasswordError('Пароль должен содержать минимум одну заглавную букву, одну строчную, одну цифру и один специальный символ');
        isValid = false;
      }
    }

    if (editRepeatPassword) {
      if (editRepeatPassword.length < 8 || editRepeatPassword.length > 128) {
        setRepeatPasswordError('Повтор пароля должен содержать от 8 до 128 символов');
        isValid = false;
      }
    }

    if (editPassword && editPassword !== editRepeatPassword) {
      setRepeatPasswordError('Пароли не совпадают');
      isValid = false;
    }

    if (editPassword && !editRepeatPassword.trim()) {
      setRepeatPasswordError('Поле "Повторите пароль" обязательно для заполнения, если меняете пароль');
      isValid = false;
    }

    if (!editPassword && editRepeatPassword) {
      setRepeatPasswordError('Повтор пароля должен быть пустым, если пароль не меняется');
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
    setIsProfileLoading(true);

    try {
      const updateData: AccountUpdate = {};

      if (editUsername.trim()) {
        updateData.username = editUsername;
      }

      if (editEmail.trim()) {
        updateData.email = editEmail;
      }

      if (editPassword.trim()) {
        updateData.password = editPassword;
        updateData.repeat_password = editRepeatPassword;
      }

      await authApi.updateProfile(updateData);
      await loadProfile();
      setIsEditModalOpen(false);
    } catch (error: any) {
      let errorMessage = 'Ошибка при сохранении профиля';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          } else if (Array.isArray(error.response.data.detail)) {
            errorMessage = error.response.data.detail.map((err: any) => err.msg || err).join(', ');
          }
        }
      }
      setGeneralError(errorMessage);
    } finally {
      setIsProfileLoading(false);
    }
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
    } else if (itemName.length < 1 || itemName.length > 255) {
      setItemNameError('Название должно содержать от 1 до 255 символов');
      isValid = false;
    }

    if (itemDescription && itemDescription.trim()) {
      if (itemDescription.length < 1 || itemDescription.length > 1000) {
        setItemDescriptionError('Описание должно содержать от 1 до 1000 символов');
        isValid = false;
      }
    }

    if (!itemPrice.trim()) {
      setItemPriceError('Поле "Цена" обязательно для заполнения');
      isValid = false;
    } else if (isNaN(Number(itemPrice))) {
      setItemPriceError('Цена должна быть числом');
      isValid = false;
    } else if (Number(itemPrice) <= 0) {
      setItemPriceError('Цена должна быть больше 0');
      isValid = false;
    }

    if (!itemCount.trim()) {
      setItemCountError('Поле "Количество" обязательно для заполнения');
      isValid = false;
    } else if (isNaN(Number(itemCount))) {
      setItemCountError('Количество должно быть числом');
      isValid = false;
    } else if (!Number.isInteger(Number(itemCount))) {
      setItemCountError('Количество должно быть целым числом');
      isValid = false;
    } else if (Number(itemCount) < 1) {
      setItemCountError('Количество должно быть не меньше 1');
      isValid = false;
    }

    if (!itemCategory.trim()) {
      setItemCategoryError('Поле "Категория" обязательно для заполнения');
      isValid = false;
    } else if (!/^[a-zA-Zа-яА-Я0-9\s,-]*$/.test(itemCategory)) {
      setItemCategoryError('Категории могут содержать только буквы, цифры, пробелы, запятые и дефисы');
      isValid = false;
    } else if (itemCategory.includes(',')) {
      const categories = itemCategory.split(',').map(c => c.trim()).filter(c => c);
      if (categories.length === 0) {
        setItemCategoryError('Запятая не может стоять сама по себе');
        isValid = false;
      }
    }

    return isValid;
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
        description: itemDescription || undefined,
        price: Number(itemPrice),
        count: Number(itemCount),
        categories: itemCategory,
      };
      await itemsApi.createItem(itemData);
      await loadProfile();
      setIsItemModalOpen(false);
    } catch (error: any) {
      setItemGeneralError(error.response?.data?.detail || 'Ошибка при создании товара');
    } finally {
      setIsItemLoading(false);
    }
  };

  const handleEditItem = (item: ItemResponse) => {
    setEditingItem(item);
    setItemName(item.name);
    setItemDescription(item.description || '');
    setItemPrice(item.price.toString());
    setItemCount(item.count.toString());
    setItemCategory(item.categories.map(c => c.name).join(', '));
    setItemNameError('');
    setItemDescriptionError('');
    setItemPriceError('');
    setItemCountError('');
    setItemCategoryError('');
    setItemGeneralError('');
    setIsItemModalOpen(true);
  };

  const handleDeleteItem = (itemId: number) => {
    setDeletingItemId(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingItemId(null);
  };

  const handleConfirmDelete = async () => {
    if (!deletingItemId) return;

    try {
      await itemsApi.deleteItem(deletingItemId);
      await loadProfile();
      setIsDeleteModalOpen(false);
      setDeletingItemId(null);
    } catch (error: any) {
      console.error('Failed to delete item:', error);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateItemForm()) {
      return;
    }

    if (!editingItem) return;

    setItemGeneralError('');
    setIsItemLoading(true);

    try {
      const itemData: ItemUpdate = {
        name: itemName,
        description: itemDescription || undefined,
        price: Number(itemPrice),
        count: Number(itemCount),
        category: itemCategory.split(',').map(c => c.trim()).filter(c => c),
      };
      await itemsApi.updateItem(editingItem.id, itemData);
      await loadProfile();
      setIsItemModalOpen(false);
      setEditingItem(null);
    } catch (error: any) {
      setItemGeneralError(error.response?.data?.detail || 'Ошибка при обновлении товара');
    } finally {
      setIsItemLoading(false);
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
          Профиль
        </h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/')} fullWidth={false}>На главную</Button>
          <Button onClick={handleLogout} fullWidth={false}>Выйти</Button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto p-8">
        {/* User Info */}
        <div
          className="p-6 rounded-lg mb-8"
          style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
        >
          <div className="mb-4">
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Username
            </p>
            <p
              className="text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              {profile?.username}
            </p>
          </div>
          <div className="mb-4">
            <p
              className="text-sm font-medium mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Email
            </p>
            <p
              className="text-lg"
              style={{ color: 'var(--text-primary)' }}
            >
              {profile?.email}
            </p>
          </div>
          <Button onClick={handleEditProfile}>Редактировать профиль</Button>
        </div>

        {/* User's Items */}
        <div
          className="p-6 rounded-lg mb-8"
          style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              Товары, которые вы выставили
            </h2>
            <Button onClick={handleCreateItem} fullWidth={false}>
              Создать товар
            </Button>
          </div>
          {profile?.items && profile.items.length > 0 ? (
            <div className="space-y-4">
              {profile.items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded border"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.name}
                  </h3>
                  <p
                    className="text-sm mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.description}
                  </p>
                  <div className="flex gap-4 text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                    <span>Цена: {item.price}</span>
                    <span>Количество: {item.count}</span>
                    <span>Категории: {item.categories.map(c => c.name).join(', ')}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEditItem(item)}
                      fullWidth={false}
                      style={{ backgroundColor: 'var(--info)' }}
                    >
                      Изменить
                    </Button>
                    <Button
                      onClick={() => handleDeleteItem(item.id)}
                      fullWidth={false}
                      style={{ backgroundColor: 'var(--error)' }}
                    >
                      Удалить
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
              У вас пока нет выставленных товаров
            </p>
          )}
        </div>

        {/* Purchased Items */}
        <div
          className="p-6 rounded-lg"
          style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
        >
          <h2
            className="text-lg font-semibold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Товары, которые вы купили
          </h2>
          {profile?.purchases && profile.purchases.length > 0 ? (
            <div className="space-y-4">
              {profile.purchases.map((purchase) => {
                const item = purchase.item || profile.items?.find(i => i.id === purchase.item_id);
                return (
                  <div
                    key={purchase.id}
                    className="p-4 rounded border"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="flex gap-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                      <span className="font-semibold">{item?.name || `Товар #${purchase.item_id}`}</span>
                      <span>Цена: {purchase.price}</span>
                      <span>Количество: {purchase.count}</span>
                      <span>Дата: {new Date(purchase.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p
              className="text-sm"
              style={{ color: 'var(--text-primary)' }}
            >
              Вы пока ничего не купили
            </p>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
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
                id="edit-email"
                label="Email"
                type="email"
                value={editEmail}
                onChange={setEditEmail}
                onClearError={() => setEmailError('')}
                error={emailError}
                placeholder="Введите новый email"
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

              <FormField
                id="edit-repeat-password"
                label="Повторите пароль"
                type="password"
                value={editRepeatPassword}
                onChange={setEditRepeatPassword}
                onClearError={() => setRepeatPasswordError('')}
                error={repeatPasswordError}
                placeholder="Повторите новый пароль"
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
                  isLoading={isProfileLoading}
                  fullWidth={false}
                >
                  Сохранить
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create/Edit Item Modal */}
      {isItemModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              {editingItem ? 'Редактировать товар' : 'Создать товар'}
            </h2>

            <form onSubmit={editingItem ? handleUpdateItem : handleSaveItem}>
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
                label="Категории (через запятую)"
                type="text"
                value={itemCategory}
                onChange={setItemCategory}
                onClearError={() => setItemCategoryError('')}
                error={itemCategoryError}
                placeholder="Введите категории через запятую"
              />

              <div className="flex gap-4 mt-6">
                <Button
                  type="button"
                  onClick={() => {
                    handleCloseItemModal();
                    setEditingItem(null);
                  }}
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
                  {editingItem ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <div
            className="max-w-md w-full p-8 rounded-lg"
            style={{ backgroundColor: 'var(--surface)', boxShadow: 'var(--shadow)' }}
          >
            <h2
              className="text-xl font-semibold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Подтверждение удаления
            </h2>
            <p
              className="mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Вы уверены, что хотите удалить этот товар?
            </p>
            <div className="flex gap-4">
              <Button
                onClick={handleCloseDeleteModal}
                fullWidth={false}
                style={{ backgroundColor: 'var(--disabled)' }}
              >
                Отмена
              </Button>
              <Button
                onClick={handleConfirmDelete}
                fullWidth={false}
                style={{ backgroundColor: 'var(--error)' }}
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
