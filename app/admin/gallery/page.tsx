'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { galleryAPI, type GalleryItem } from '../../services/adminApiService';
import ImageUpload from '@/app/[locale]/globalComponents/ImageUpload';

type GalleryFormData = {
  title: string;
  location: string;
  category: string;
  photographer: string;
  date: string;
  imageUrl: string;
  likes: string;
  isActive: boolean;
};

const initialFormData: GalleryFormData = {
  title: '',
  location: '',
  category: 'beach',
  photographer: '',
  date: '',
  imageUrl: '',
  likes: '0',
  isActive: true,
};

const getImageUrl = (url: string) =>
  url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;

export default function AdminGalleryPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>(initialFormData);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      loadGalleryItems();
    }
  }, [isLoading, isAuthenticated]);

  const loadGalleryItems = async () => {
    try {
      setLoadingItems(true);
      setError('');
      const data = await galleryAPI.getAll();
      setItems(
        data.map((item) => ({
          ...item,
          image_url: getImageUrl(item.image_url),
        }))
      );
    } catch (error) {
      console.error('LOAD GALLERY ITEMS ERROR:', error);
      setError('Nepavyko gauti galerijos įrašų.');
    } finally {
      setLoadingItems(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedItem(null);
    setFormData(initialFormData);
    setError('');
    setShowModal(true);
  };

  const handleOpenEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setError('');
    setFormData({
      title: item.title ?? '',
      location: item.location ?? '',
      category: item.category ?? 'beach',
      photographer: item.photographer ?? '',
      date: item.date ? String(item.date).slice(0, 10) : '',
      imageUrl: item.image_url ?? '',
      likes: String(item.likes ?? 0),
      isActive: item.is_active ?? true,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData(initialFormData);
  };

  const handleSaveItem = async () => {
    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.category.trim() ||
      !formData.photographer.trim() ||
      !formData.date.trim() ||
      !formData.imageUrl.trim()
    ) {
      setError('Užpildyk visus privalomus laukus.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        category: formData.category,
        photographer: formData.photographer.trim(),
        date: formData.date,
        imageUrl: getImageUrl(formData.imageUrl.trim()),
        likes: Number(formData.likes || 0),
        is_active: formData.isActive,
      };

      if (selectedItem) {
        await galleryAPI.update(selectedItem.id, payload);
      } else {
        await galleryAPI.create(payload);
      }

      setShowModal(false);
      setSelectedItem(null);
      setFormData(initialFormData);
      await loadGalleryItems();
    } catch (error) {
      console.error('SAVE GALLERY ITEM ERROR:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Nepavyko išsaugoti galerijos įrašo.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      setActionLoadingId(id);
      setError('');
      await galleryAPI.delete(id);
      await loadGalleryItems();
    } catch (error) {
      console.error('DELETE GALLERY ITEM ERROR:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Nepavyko ištrinti galerijos įrašo.'
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <p className="text-gray-600">Kraunama...</p>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Galerijos valdymas</h1>
            <p className="mt-1 text-sm text-gray-500">
              Kurkite, redaguokite ir šalinkite galerijos įrašus
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => router.push('/admin')}
              className="rounded-2xl border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Grįžti
            </button>
            <button
              onClick={handleOpenCreate}
              className="rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Pridėti įrašą
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loadingItems ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Kraunami galerijos įrašai...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Galerijos įrašų nerasta.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900">{item.title}</h2>
                    <p className="mt-1 text-sm text-gray-500">{item.location}</p>
                    <p className="mt-1 text-sm text-gray-500">Fotografas: {item.photographer}</p>
                    <p className="mt-1 text-sm text-gray-500">Data: {item.date ? new Date(item.date).toLocaleDateString('lt-LT') : '-'}</p>
                  </div>

                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    {item.category}
                  </span>
                </div>

                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="mt-4 h-48 w-full rounded-2xl object-cover border border-gray-200"
                  />
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
                  <div>
                    Likes: <span className="font-semibold text-gray-900">{item.likes}</span>
                  </div>
                  <div>
                    Statusas: <span className="font-semibold text-gray-900">{item.is_active ? 'Aktyvus' : 'Išjungtas'}</span>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Redaguoti
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={actionLoadingId === item.id}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    {actionLoadingId === item.id ? 'Vykdoma...' : 'Ištrinti'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {selectedItem ? 'Redaguoti galerijos įrašą' : 'Pridėti galerijos įrašą'}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Pavadinimas</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Vieta</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Kategorija</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="beach">Beach</option>
                    <option value="city">City</option>
                    <option value="nature">Nature</option>
                    <option value="general">General</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Fotografas</label>
                  <input
                    type="text"
                    value={formData.photographer}
                    onChange={(e) =>
                      setFormData({ ...formData, photographer: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nuotrauka</label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) =>
                      setFormData({ ...formData, imageUrl: url })
                    }
                    uploadType="gallery"
                    placeholder="Įkelkite galerijos nuotrauką arba įveskite URL"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Likes</label>
                  <input
                    type="number"
                    value={formData.likes}
                    min="0"
                    onChange={(e) =>
                      setFormData({ ...formData, likes: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    id="gallery-active"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor="gallery-active" className="text-sm text-gray-700">
                    Aktyvus įrašas
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Atšaukti
                </button>
                <button
                  onClick={handleSaveItem}
                  disabled={saving}
                  className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700 disabled:opacity-60"
                >
                  {saving ? 'Saugoma...' : 'Išsaugoti'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
