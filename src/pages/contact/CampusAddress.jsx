import { useEffect, useState } from "react";
import { getCampusAddress, upsertCampusAddress } from "../../services/api/contactApi";

const EMPTY_FORM = {
  street: "",
  city: "",
  country: "",
  postalCode: "",
  latitude: "",
  longitude: "",
};

function CampusAddress() {
  const [address, setAddress] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const result = await getCampusAddress();
      let data = result?.data ?? result;
      if (Array.isArray(data)) data = data[0] ?? null;

      if (data) {
        setAddress(data);
        setFormData({
          street: data.street ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          postalCode: data.postalCode ?? "",
          latitude: data.latitude ?? "",
          longitude: data.longitude ?? "",
        });
      } else {
        setAddress(null);
        setFormData(EMPTY_FORM);
      }
    } catch (err) {
      // 404 means no record yet - not an error
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to load.");
      }
      setAddress(null);
      setFormData(EMPTY_FORM);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      await upsertCampusAddress({
        ...formData,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      });

      setMessage("Campus Address saved.");
      await load();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border bg-white p-8">
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campus Address</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the campus address and coordinates.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800"
          >
            {address ? "Edit" : "Create"}
          </button>
        )}
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      {!address && !isEditing && (
        <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No Campus Address set</h2>
          <p className="mt-2 text-sm text-gray-500">Create the campus address to display on the map.</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white hover:bg-gray-800"
          >
            Create Campus Address
          </button>
        </div>
      )}

      {address && !isEditing && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="divide-y">
            {[
              ["Street", address.street],
              ["City", address.city],
              ["Country", address.country],
              ["Postal Code", address.postalCode],
              ["Latitude", address.latitude],
              ["Longitude", address.longitude],
            ].map(([label, value]) => (
              <div key={label} className="px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
                <p className="mt-1 text-sm text-gray-800">{value ?? "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="font-semibold">{address ? "Edit Campus Address" : "Create Campus Address"}</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {["street", "city", "country", "postalCode", "latitude", "longitude"].map((name) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">{name}</label>
                <input
                  type={name === "latitude" || name === "longitude" ? "number" : "text"}
                  step="any"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={() => { setIsEditing(false); load(); }}
              className="rounded-lg border bg-white px-4 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CampusAddress;