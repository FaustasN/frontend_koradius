'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  travelPacketsAPI,
  type TravelPacket,
} from '../../services/adminApiService';
import ImageUpload from '@/app/[locale]/globalComponents/ImageUpload';

type PacketFormData = {
  title: string;
  location: string;
  duration: string;
  price: string;
  originalPrice: string;
  rating: string;
  reviews: string;
  imageUrl: string;
  category: string;
  badge: string;
  description: string;
  includes: string;
  availableSpots: string;
  departure: string;
};

const initialFormData: PacketFormData = {
  title: '',
  location: '',
  duration: '',
  price: '',
  originalPrice: '',
  rating: '0',
  reviews: '0',
  imageUrl: '',
  category: 'weekend',
  badge: '',
  description: '',
  includes: '',
  availableSpots: '0',
  departure: '',
};

const getImageUrl = (url: string) =>
  url?.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;

export default function AdminTravelPacketsPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [packets, setPackets] = useState<TravelPacket[]>([]);
  const [loadingPackets, setLoadingPackets] = useState(true);
  const [showPacketModal, setShowPacketModal] = useState(false);
  const [selectedPacket, setSelectedPacket] = useState<TravelPacket | null>(null);
  const [packetFormData, setPacketFormData] = useState<PacketFormData>(initialFormData);
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
      loadPackets();
    }
  }, [isLoading, isAuthenticated]);

  const loadPackets = async () => {
    try {
      setLoadingPackets(true);
      setError('');
      const data = await travelPacketsAPI.getAll();
      setPackets(
        data.map((packet) => ({
          ...packet,
          image_url: getImageUrl(packet.image_url),
        }))
      );
    } catch (error) {
      console.error('LOAD PACKETS ERROR:', error);
      setError('Nepavyko gauti kelionių paketų.');
    } finally {
      setLoadingPackets(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedPacket(null);
    setPacketFormData(initialFormData);
    setError('');
    setShowPacketModal(true);
  };

  const handleOpenEdit = (packet: TravelPacket) => {
    setSelectedPacket(packet);
    setError('');
    setPacketFormData({
      title: packet.title ?? '',
      location: packet.location ?? '',
      duration: packet.duration ?? '',
      price: String(packet.price ?? ''),
      originalPrice:
        packet.original_price !== undefined && packet.original_price !== null
          ? String(packet.original_price)
          : '',
      rating: String(packet.rating ?? 0),
      reviews: String(packet.reviews ?? 0),
      imageUrl: packet.image_url ?? '',
      category: packet.category ?? 'weekend',
      badge: packet.badge ?? '',
      description: packet.description ?? '',
      includes: Array.isArray(packet.includes) ? packet.includes.join(', ') : '',
      availableSpots: String(packet.available_spots ?? 0),
      departure: packet.departure ? String(packet.departure).slice(0, 10) : '',
    });
    setShowPacketModal(true);
  };

  const handleCloseModal = () => {
    setShowPacketModal(false);
    setSelectedPacket(null);
    setPacketFormData(initialFormData);
  };

  const handleSavePacket = async () => {
    if (
      !packetFormData.title.trim() ||
      !packetFormData.location.trim() ||
      !packetFormData.duration.trim() ||
      !packetFormData.price ||
      !packetFormData.imageUrl.trim() ||
      !packetFormData.description.trim()
    ) {
      setError('Užpildyk visus privalomus laukus.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const payload = {
  title: packetFormData.title.trim(),
  location: packetFormData.location.trim(),
  duration: packetFormData.duration.trim(),
  price: Number(packetFormData.price),
  rating: Number(packetFormData.rating || 0),
  reviews: Number(packetFormData.reviews || 0),
  image_url: getImageUrl(packetFormData.imageUrl.trim()),
  category: packetFormData.category,
  badge: packetFormData.badge.trim(),
  description: packetFormData.description.trim(),
  includes: packetFormData.includes
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean),
  available_spots: Number(packetFormData.availableSpots || 0),
  is_active: true,
  ...(packetFormData.originalPrice
    ? { original_price: Number(packetFormData.originalPrice) }
    : {}),
  ...(packetFormData.departure
    ? { departure: packetFormData.departure }
    : {}),
};

      console.log('SAVE PACKET PAYLOAD:', payload);

      if (selectedPacket) {
        await travelPacketsAPI.update(selectedPacket.id, payload);
      } else {
        await travelPacketsAPI.create(payload);
      }

      setShowPacketModal(false);
      setSelectedPacket(null);
      setPacketFormData(initialFormData);
      await loadPackets();
    } catch (error) {
      console.error('SAVE PACKET ERROR:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Nepavyko išsaugoti kelionių paketo.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePacket = async (id: number) => {
    try {
      setActionLoadingId(id);
      setError('');
      await travelPacketsAPI.delete(id);
      await loadPackets();
    } catch (error) {
      console.error('DELETE PACKET ERROR:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Nepavyko ištrinti kelionių paketo.'
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
            <h1 className="text-2xl font-semibold text-gray-900">
              Kelionių paketų valdymas
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Kurkite, redaguokite ir šalinkite kelionių paketus
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
              Pridėti paketą
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loadingPackets ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Kraunami kelionių paketai...
          </div>
        ) : packets.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
            Kelionių paketų nerasta.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {packets.map((packet) => (
              <div
                key={packet.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {packet.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {packet.location} • {packet.duration}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Kaina: €{packet.price}
                      {packet.original_price !== undefined &&
                      packet.original_price !== null
                        ? ` • Sena kaina: €${packet.original_price}`
                        : ''}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Vietos: {packet.available_spots}
                    </p>
                    {packet.departure && (
                      <p className="mt-1 text-sm text-gray-500">
                        Išvykimas: {new Date(packet.departure).toLocaleDateString('lt-LT')}
                      </p>
                    )}
                  </div>

                  {packet.badge && (
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                      {packet.badge}
                    </span>
                  )}
                </div>

                {packet.image_url && (
                  <img
                    src={packet.image_url}
                    alt={packet.title}
                    className="mt-4 h-48 w-full rounded-2xl object-cover border border-gray-200"
                  />
                )}

                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                  {packet.description}
                </p>

                {packet.includes?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {packet.includes.map((item, index) => (
                      <span
                        key={`${packet.id}-${index}`}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => handleOpenEdit(packet)}
                    className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Redaguoti
                  </button>

                  <button
                    onClick={() => handleDeletePacket(packet.id)}
                    disabled={actionLoadingId === packet.id}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                  >
                    {actionLoadingId === packet.id ? 'Vykdoma...' : 'Ištrinti'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPacketModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                {selectedPacket ? 'Redaguoti paketą' : 'Pridėti paketą'}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Pavadinimas
                  </label>
                  <input
                    type="text"
                    value={packetFormData.title}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, title: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Vieta
                  </label>
                  <input
                    type="text"
                    value={packetFormData.location}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, location: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Trukmė
                  </label>
                  <input
                    type="text"
                    value={packetFormData.duration}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, duration: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Kaina (€)
                  </label>
                  <input
                    type="number"
                    value={packetFormData.price}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, price: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Sena kaina (€)
                  </label>
                  <input
                    type="number"
                    value={packetFormData.originalPrice}
                    onChange={(e) =>
                      setPacketFormData({
                        ...packetFormData,
                        originalPrice: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Kategorija
                  </label>
                  <select
                    value={packetFormData.category}
                    onChange={(e) =>
                      setPacketFormData({
                        ...packetFormData,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="weekend">Weekend</option>
                    <option value="vacation">Leisure</option>
                    <option value="medical">Medical</option>
                    <option value="nature">Nature</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Ženklelis
                  </label>
                  <input
                    type="text"
                    value={packetFormData.badge}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, badge: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Laisvos vietos
                  </label>
                  <input
                    type="number"
                    value={packetFormData.availableSpots}
                    onChange={(e) =>
                      setPacketFormData({
                        ...packetFormData,
                        availableSpots: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Išvykimas
                  </label>
                  <input
                    type="date"
                    value={packetFormData.departure}
                    onChange={(e) =>
                      setPacketFormData({
                        ...packetFormData,
                        departure: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Reitingas
                  </label>
                  <input
                    type="number"
                    value={packetFormData.rating}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, rating: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Atsiliepimų kiekis
                  </label>
                  <input
                    type="number"
                    value={packetFormData.reviews}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, reviews: e.target.value })
                    }
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nuotrauka
                  </label>
                  <ImageUpload
                    value={packetFormData.imageUrl}
                    onChange={(url) =>
                      setPacketFormData({ ...packetFormData, imageUrl: url })
                    }
                    uploadType="travel-packets"
                    placeholder="Įkelkite kelionės nuotrauką arba įveskite URL"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Aprašymas
                  </label>
                  <textarea
                    value={packetFormData.description}
                    onChange={(e) =>
                      setPacketFormData({
                        ...packetFormData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Kas įskaičiuota
                  </label>
                  <input
                    type="text"
                    value={packetFormData.includes}
                    onChange={(e) =>
                      setPacketFormData({ ...packetFormData, includes: e.target.value })
                    }
                    placeholder="Skrydžiai, 3* viešbutis, Pusryčiai, Gidas"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-teal-500"
                  />
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
                  onClick={handleSavePacket}
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