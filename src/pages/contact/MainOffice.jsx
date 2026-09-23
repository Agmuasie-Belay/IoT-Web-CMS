import { useEffect, useState } from "react";
import { getMainOffice, upsertMainOffice } from "../../services/api/contactApi";

const EMPTY_FORM = {
  name: "",
  address: "",
  phone: "",
  email: "",
  workingHours: "",
  latitude: "",
  longitude: "",
};

function MainOffice() {
  const [office, setOffice] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOffice = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getMainOffice();
      let data = result?.data ?? result;

      if (Array.isArray(data)) data = data[0] ?? null;

      if (data) {
        setOffice(data);
        setFormData({
          name: data.name ?? "",
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          workingHours: data.workingHours ?? "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
        });
      } else {
        setOffice(null);
        setFormData(EMPTY_FORM);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load Main Office.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffice();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = () => {
    setError("");
    setMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setError("");
    setMessage("");
    if (office) {
      setFormData({
        name: office.name ?? "",
        address: office.address ?? "",
        phone: office.phone ?? "",
        email: office.email ?? "",
        workingHours: office.workingHours ?? "",
        latitude: office.latitude ?? "",
        longitude: office.longitude ?? "",
      });
    } else {
      setFormData(EMPTY_FORM);
    }
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...formData,
        latitude: formData.latitude === "" ? null : Number(formData.latitude),
        longitude: formData.longitude === "" ? null : Number(formData.longitude),
      };

      await upsertMainOffice(payload);
      setMessage("Main Office saved successfully.");
      await loadOffice();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save Main Office.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="text-sm text-gray-500">Loading Main Office...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Main Office
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the main office contact information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            {office ? "Edit" : "Create"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {!office && !isEditing && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No Main Office record found
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create the main office information to display on the public site.
          </p>
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create Main Office
          </button>
        </div>
      )}

      {office && !isEditing && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-xl font-semibold text-gray-900">
              {office.name}
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              ["Address", office.address],
              ["Phone", office.phone],
              ["Email", office.email],
              ["Working Hours", office.workingHours],
              ["Latitude", office.latitude ?? "—"],
              ["Longitude", office.longitude ?? "—"],
            ].map(([label, value]) => (
              <div key={label} className="px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  {label}
                </p>
                <p className="mt-1 text-sm text-gray-800">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="font-semibold text-gray-900">
              {office ? "Edit Main Office" : "Create Main Office"}
            </h2>
          </div>
          <div className="space-y-5 p-6">
            {[
              ["name", "Name", "text", true],
              ["email", "Email", "email", true],
              ["phone", "Phone", "text", true],
              ["workingHours", "Working Hours", "text", true],
              ["latitude", "Latitude", "number", false],
              ["longitude", "Longitude", "number", false],
            ].map(([name, label, type, required]) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>
            ))}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default MainOffice;