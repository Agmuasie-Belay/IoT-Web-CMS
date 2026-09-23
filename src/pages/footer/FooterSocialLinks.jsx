import { useEffect, useState } from "react";
import {
  getAdminFooterSocialLinks,
  createFooterSocialLink,
  updateFooterSocialLink,
  deleteFooterSocialLink,
} from "../../services/api/footerApi";

const EMPTY_FORM = {
  platform: "",
  label: "",
  url: "",
  icon: "",
  colorClass: "",
  displayOrder: 0,
  status: "published",
};

function FooterSocialLinks() {
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
      const result = await getAdminFooterSocialLinks();
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
      platform: link.platform ?? "",
      label: link.label ?? "",
      url: link.url ?? "",
      icon: link.icon ?? "",
      colorClass: link.colorClass ?? "",
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
        await updateFooterSocialLink(editId, payload);
        setMessage("Updated.");
      } else {
        await createFooterSocialLink(payload);
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
    if (!window.confirm("Delete this social link?")) return;
    await deleteFooterSocialLink(id);
    setMessage("Deleted.");
    await load();
  };

  if (loading) return <div className="mx-auto max-w-6xl"><div className="rounded-xl border bg-white p-8"><p className="text-sm text-gray-500">Loading...</p></div></div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Social Links</h1>
          <p className="mt-1 text-sm text-gray-500">Manage social media links shown in the footer.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800">
            Add Social Link
          </button>
        )}
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      {isEditing && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="font-semibold">{editId ? "Edit Social Link" : "New Social Link"}</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {["platform", "label", "url", "icon", "colorClass", "displayOrder"].map((name) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium">{name}</label>
                <input
                  type={name === "displayOrder" ? "number" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "displayOrder" && name !== "colorClass"}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
            ))}
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
        {links.map((l) => (
          <div key={l.id} className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">{l.label}</p>
            <p className="mt-1 text-xs text-gray-500">{l.platform}</p>
            <a href={l.url} target="_blank" rel="noopener noreferrer" className="mt-2 block truncate text-xs text-blue-600 hover:underline">
              {l.url}
            </a>
            <div className="mt-4 flex gap-3 border-t pt-3">
              <button onClick={() => handleEdit(l)} className="text-sm text-gray-700">Edit</button>
              <button onClick={() => handleDelete(l.id)} className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FooterSocialLinks;