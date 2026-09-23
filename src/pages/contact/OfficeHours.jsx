import { useEffect, useState } from "react";
import {
  getAdminOfficeHours,
  createOfficeHour,
  updateOfficeHour,
  deleteOfficeHour,
} from "../../services/api/contactApi";

const EMPTY_FORM = {
  day: "",
  openingTime: "08:00",
  closingTime: "17:00",
  isClosed: false,
  displayOrder: 0,
};

function OfficeHours() {
  const [hours, setHours] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const result = await getAdminOfficeHours();
      const data = result?.data ?? result;
      setHours(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleEdit = (h) => {
    setFormData({
      day: h.day ?? "",
      openingTime: h.openingTime ?? "",
      closingTime: h.closingTime ?? "",
      isClosed: h.isClosed ?? false,
      displayOrder: h.displayOrder ?? 0,
    });
    setEditId(h.id);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...formData, displayOrder: Number(formData.displayOrder) || 0 };
      if (editId) {
        await updateOfficeHour(editId, payload);
        setMessage("Updated.");
      } else {
        await createOfficeHour(payload);
        setMessage("Created.");
      }
      handleCancel();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this office hour?")) return;
    await deleteOfficeHour(id);
    setMessage("Deleted.");
    await load();
  };

  if (loading) return <div className="mx-auto max-w-6xl"><div className="rounded-xl border bg-white p-8"><p className="text-sm text-gray-500">Loading...</p></div></div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Office Hours</h1>
          <p className="mt-1 text-sm text-gray-500">Manage weekly opening hours.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800">
            Add Hour
          </button>
        )}
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      {isEditing && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="font-semibold">{editId ? "Edit Hour" : "New Hour"}</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Day</label>
              <input name="day" value={formData.day} onChange={handleChange} required className="w-full rounded-lg border px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Display Order</label>
              <input type="number" name="displayOrder" value={formData.displayOrder} onChange={handleChange} className="w-full rounded-lg border px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Opening Time</label>
              <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} className="w-full rounded-lg border px-3 py-2.5 text-sm" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">Closing Time</label>
              <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} className="w-full rounded-lg border px-3 py-2.5 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="isClosed" checked={formData.isClosed} onChange={handleChange} />
                Closed all day
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
            <button type="button" onClick={handleCancel} className="rounded-lg border bg-white px-4 py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Hours</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {hours.length === 0 && (
              <tr><td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-500">No office hours yet.</td></tr>
            )}
            {hours.map((h) => (
              <tr key={h.id}>
                <td className="px-6 py-4 text-sm font-medium">{h.day}</td>
                <td className="px-6 py-4 text-sm">
                  {h.isClosed ? "Closed" : `${h.openingTime || "—"} - ${h.closingTime || "—"}`}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(h)} className="text-sm text-gray-700 hover:text-gray-900">Edit</button>
                  <button onClick={() => handleDelete(h.id)} className="ml-4 text-sm text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OfficeHours;