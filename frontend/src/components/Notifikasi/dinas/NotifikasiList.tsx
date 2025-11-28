/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo, useEffect } from "react";
import {
  RefreshCcw,
  MailCheck,
  Trash2,
  MinusSquare,
  Square,
} from "lucide-react";
import NotifikasiItem from "./NotifikasiItem";
import axios from "axios";

export default function NotifikasiList({ data }: { data: any[] }) {
  // local copy supaya bisa diupdate (mark read / delete) tanpa API
  const [notifs, setNotifs] = useState<any[]>(() => data ?? []);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 SINKRONISASI DATA SETIAP KALI FILTER TAB BERUBAH
  useEffect(() => {
    setNotifs(data);
    setSelectedIds(new Set());
  }, [data]);

  // derived
  const allSelected = useMemo(
    () => notifs.length > 0 && selectedIds.size === notifs.length,
    [notifs, selectedIds]
  );

  const anySelected = selectedIds.size > 0;

  const apiMarkOneAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `https://asset-risk-management.vercel.app/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Gagal patch satu notif:", err);
    }
  };

  const apiMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        "https://asset-risk-management.vercel.app/api/notifications/read-all",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Gagal patch semua notif:", err);
    }
  };

  // handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });
  };

  const handleSelectAllToggle = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(notifs.map((n) => n.id)));
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setNotifs(data ?? []);
      setSelectedIds(new Set());
      setRefreshing(false);
    }, 600);
  };

  const markAllAsRead = async () => {
    await apiMarkAllAsRead();

    setNotifs((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setSelectedIds(new Set());
  };

  const markSelectedAsRead = () => {
    setNotifs((prev) =>
      prev.map((n) => (selectedIds.has(n.id) ? { ...n, is_read: true } : n))
    );
    setSelectedIds(new Set());
  };

  const deleteSelected = () => {
    setNotifs((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
  };

  const deleteOne = (id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };

  const markOneAsRead = async (id: string) => {
    await apiMarkOneAsRead(id);

    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    setSelectedIds((prev) => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
  };

  return (
    <div>
      {/* CONTROLS HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSelectAllToggle}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 transition"
          >
            {allSelected ? (
              <MinusSquare size={18} className="text-gray-600" />
            ) : (
              <Square size={18} className="text-gray-600" />
            )}
            <span className="text-sm text-gray-700">
              {allSelected ? "Hapus filter" : "Pilih semua"}
            </span>
          </button>

          <button
            onClick={markSelectedAsRead}
            disabled={!anySelected}
            className={`flex items-center gap-2 px-2 py-1 rounded transition ${
              anySelected
                ? "hover:bg-green-50"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <MailCheck size={16} className="text-green-600" />
            <span className="text-sm text-gray-700">Tandai terpilih</span>
          </button>

          <button
            onClick={deleteSelected}
            disabled={!anySelected}
            className={`flex items-center gap-2 px-2 py-1 rounded transition ${
              anySelected ? "hover:bg-red-50" : "opacity-40 cursor-not-allowed"
            }`}
          >
            <Trash2 size={16} className="text-red-500" />
            <span className="text-sm text-gray-700">Hapus terpilih</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="p-2 rounded hover:bg-gray-100 transition"
          >
            <RefreshCcw
              size={18}
              className={`text-gray-600 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>

          <button
            onClick={markAllAsRead}
            className="p-2 rounded hover:bg-green-50 transition"
          >
            <MailCheck size={18} className="text-green-600" />
          </button>
        </div>
      </div>

      {/* LIST */}
      {notifs.length === 0 ? (
        <p className="text-sm text-gray-500">Tidak ada notifikasi.</p>
      ) : (
        notifs.map((notif) => (
          <NotifikasiItem
            key={notif.id}
            notif={notif}
            selected={selectedIds.has(notif.id)}
            onToggleSelect={() => handleToggleSelect(notif.id)}
            onMarkRead={() => markOneAsRead(notif.id)}
            onDelete={() => deleteOne(notif.id)}
          />
        ))
      )}
      <div></div>
    </div>
  );
}
