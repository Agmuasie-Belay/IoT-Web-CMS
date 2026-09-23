import { useEffect, useState } from "react";
import {
  getAdminFooterNavigation,
  createFooterNavigation,
  updateFooterNavigation,
  deleteFooterNavigation,
} from "../../services/api/footerApi";

const EMPTY_FORM = {
  groupName: "",
  label: "",
  path: "",
  displayOrder: 0,
  status: "published",
};

function FooterNavigation() {
  const [links, setLinks] = useState([]);
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
      const result = await getAdminFooterNavigation();
      const data = result?.data ?? result;
      setLinks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (link) => {
    setFormData({
      groupName: link.groupName ?? "",
      label: link.label ?? "",
      path: link.path ?? "",
      displayOrder: link.displayOrder ?? 0,
      status: link.status ?? "published",
    });
    setEditId(link.id);
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
        await updateFooterNavigation(editId, payload);
        setMessage("Updated.");
      } else {
        await createFooterNavigation(payload);
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
    if (!window.confirm("Delete this link?")) return;
    await deleteFooterNavigation(id);
    setMessage("Deleted.");
    await load();
  };

  if (loading) return <div className="mx-auto max-w-6xl"><div className="rounded-xl border bg-white p-8"><p className="text-sm text-gray-500">Loading...</p></div></div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Navigation</h1>
          <p className="mt-1 text-sm text-gray-500">Manage footer navigation links.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800">
            Add Link
          </button>
        )}
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      {isEditing && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="font-semibold">{editId ? "Edit Link" : "New Link"}</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {["groupName", "label", "path", "displayOrder"].map((name) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium">{name}</label>
                <input
                  type={name === "displayOrder" ? "number" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "displayOrder"}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
            ))}
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
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
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Group</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Label</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Path</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {links.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">No links yet.</td></tr>
            )}
            {links.map((l) => (
              <tr key={l.id}>
                <td className="px-6 py-4 text-sm">{l.groupName}</td>
                <td className="px-6 py-4 text-sm font-medium">{l.label}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{l.path}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleEdit(l)} className="text-sm text-gray-700 hover:text-gray-900">Edit</button>
                  <button onClick={() => handleDelete(l.id)} className="ml-4 text-sm text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default FooterNavigation;