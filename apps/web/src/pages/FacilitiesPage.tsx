import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { 
  Building2, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Plus, 
  Calendar,
  Layers,
  Monitor,
  Video
} from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const [bookingDate, setBookingDate] = useState('2026-11-20');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('12:00');
  const [bookingSuccess, setBookingSuccess] = useState<any>(null);

  const { data: facilities = [], isLoading, refetch } = useQuery({
    queryKey: ['facilities'],
    queryFn: async () => {
      const res = await api.get('/management/facilities');
      return res.data;
    },
  });

  const bookMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post(`/management/facilities/${selectedFacility.id}/book`, data);
      return res.data;
    },
    onSuccess: (data) => {
      setIsBookingModalOpen(false);
      setBookingSuccess(data);
      refetch();
    },
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFacility) return;
    bookMutation.mutate({
      eventName,
      date: bookingDate,
      startTime,
      endTime,
    });
  };

  const availableCount = facilities.filter((f: any) => f.status === 'AVAILABLE').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-icms-navy via-slate-800 to-icms-academic-blue rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Smart Campus Asset Management
            </span>
            <span className="text-xs text-slate-300 font-medium">Fasilitas & Sarana Kampus</span>
          </div>
          <h1 className="text-2xl font-bold font-heading tracking-tight">
            Fasilitas, Laboratorium & Reservasi Ruangan
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Pusat peminjaman laboratorium komputer, ruang sidang, auditorium, dan sarana akademik kampus secara real-time.
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Fasilitas Kampus"
          value={facilities.length}
          subtitle="Lab, Ruang Sidang & Aula"
          icon={Building2}
          iconBg="bg-blue-50"
          iconColor="text-icms-academic-blue"
        />
        <StatCard
          title="Ruangan Siap Dipakai"
          value={availableCount}
          subtitle="Tersedia untuk Booking"
          icon={CheckCircle2}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatCard
          title="Fasilitas Multimedia"
          value="4K & IoT Ready"
          subtitle="Smart Board & High-Speed LAN"
          icon={Monitor}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <StatCard
          title="Pusat Lokasi"
          value="Kampus A & B"
          subtitle="Thamrin & Sudirman"
          icon={MapPin}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
      </div>

      {/* Booking Success Banner */}
      {bookingSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{bookingSuccess.message} (No. Booking: <strong>{bookingSuccess.bookingId}</strong>)</span>
          </div>
          <button onClick={() => setBookingSuccess(null)} className="font-bold text-emerald-700">✕</button>
        </div>
      )}

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facilities.map((fac: any) => {
          const isAvailable = fac.status === 'AVAILABLE';

          return (
            <div
              key={fac.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {fac.code}
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    isAvailable 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {isAvailable ? 'TERSEDIA' : 'SEDANG DIGUNAKAN'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {fac.type} • {fac.building} Lt. {fac.floor}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 leading-snug mt-0.5">
                    {fac.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kapasitas: <strong>{fac.capacity} Orang</strong></span>
                </div>

                {/* Equipment chips */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 block">Fasilitas Ruangan:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fac.equipment?.map((eq: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        • {eq}
                      </span>
                    ))}
                  </div>
                </div>

                {fac.currentBooking && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-0.5">
                    <span className="font-bold block">Kegiatan Saat Ini:</span>
                    <div>{fac.currentBooking.event} ({fac.currentBooking.organizer}) s/d {fac.currentBooking.until}</div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Izin Biro Sarpras UIM</span>
                <button
                  onClick={() => {
                    setSelectedFacility(fac);
                    setIsBookingModalOpen(true);
                  }}
                  disabled={!isAvailable}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white shadow-xs transition-colors"
                >
                  Ajukan Peminjaman
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOOKING MODAL */}
      {isBookingModalOpen && selectedFacility && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Reservasi Fasilitas Kampus</h3>
              <button 
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBooking} className="mt-4 space-y-4">
              <div>
                <span className="text-xs text-slate-500 block mb-1">Ruangan yang Dipinjam</span>
                <p className="text-sm font-bold text-slate-800">{selectedFacility.name} ({selectedFacility.code})</p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nama Kegiatan / Agenda Acara</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Workshop Cloud Computing HMTI..."
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tanggal Kegiatan</label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Waktu Mulai</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Waktu Selesai</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-icms-academic-blue"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={bookMutation.isPending}
                  className="px-5 py-2 text-xs font-bold bg-icms-academic-blue hover:bg-blue-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {bookMutation.isPending ? 'Menyimpan...' : 'Konfirmasi Reservasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

