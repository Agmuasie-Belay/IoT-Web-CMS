import { useEffect, useState } from "react";
import {
  getAdminQuickCards,
  createQuickCard,
  updateQuickCard,
  deleteQuickCard,
} from "../../services/api/contactApi";

const EMPTY_FORM = {
  title: "",
  icon: "",
  email: "",
  phone: "",
  description: "",
  color: "blue",
  displayOrder: 0,
};

function QuickCards() {
  const [cards, setCards] = useState([]);
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
      const result = await getAdminQuickCards();
      const data = result?.data ?? result;
      setCards(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load quick cards.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (card) => {
    setFormData({
      title: card.title ?? "",
      icon: card.icon ?? "",
      email: card.email ?? "",
      phone: card.phone ?? "",
      description: card.description ?? "",
      color: card.color ?? "blue",
      displayOrder: card.displayOrder ?? 0,
    });
    setEditId(card.id);
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
        await updateQuickCard(editId, payload);
        setMessage("Quick card updated.");
      } else {
        await createQuickCard(payload);
        setMessage("Quick card created.");
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
    if (!window.confirm("Delete this card?")) return;
    await deleteQuickCard(id);
    setMessage("Deleted.");
    await load();
  };

  if (loading) return <div className="mx-auto max-w-6xl"><div className="rounded-xl border bg-white p-8"><p className="text-sm text-gray-500">Loading...</p></div></div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quick Contact Cards</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the quick contact cards.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800">
            Add Card
          </button>
        )}
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      {isEditing && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="font-semibold">{editId ? "Edit Card" : "New Card"}</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {["title", "icon", "email", "phone", "color"].map((name) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">{name}</label>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
              />
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-gray-900">{card.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{card.description}</p>
            <p className="mt-2 text-xs text-gray-500">{card.email}</p>
            <div className="mt-4 flex gap-3 border-t pt-3">
              <button onClick={() => handleEdit(card)} className="text-sm text-gray-700 hover:text-gray-900">Edit</button>
              <button onClick={() => handleDelete(card.id)} className="text-sm text-red-600 hover:text-red-800">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuickCards;