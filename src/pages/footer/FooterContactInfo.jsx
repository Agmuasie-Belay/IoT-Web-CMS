import { useEffect, useState } from "react";
import { getFooterContactInfo, upsertFooterContactInfo } from "../../services/api/footerApi";

const EMPTY_FORM = {
  addressLine1: "",
  addressLine2: "",
  city: "",
  country: "",
  postalBox: "",
  email: "",
  phone: "",
};

function FooterContactInfo() {
  const [info, setInfo] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const result = await getFooterContactInfo();
      let data = result?.data ?? result;
      if (Array.isArray(data)) data = data[0] ?? null;

      if (data) {
        setInfo(data);
        setFormData({
          addressLine1: data.addressLine1 ?? "",
          addressLine2: data.addressLine2 ?? "",
          city: data.city ?? "",
          country: data.country ?? "",
          postalBox: data.postalBox ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
        });
      } else {
        setInfo(null);
        setFormData(EMPTY_FORM);
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.message || "Failed to load.");
      }
      setInfo(null);
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
      await upsertFooterContactInfo(formData);
      setMessage("Footer contact info saved.");
      await load();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="mx-auto max-w-5xl"><div className="rounded-xl border bg-white p-8"><p className="text-sm text-gray-500">Loading...</p></div></div>;

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Footer Contact Info</h1>
          <p className="mt-1 text-sm text-gray-500">Manage the postal address and contact details shown in the footer.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm text-white hover:bg-gray-800">
            {info ? "Edit" : "Create"}
          </button>
        )}
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>}

      {info && !isEditing && (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="divide-y">
            {[
              ["Address Line 1", info.addressLine1],
              ["Address Line 2", info.addressLine2],
              ["City", info.city],
              ["Country", info.country],
              ["Postal Box", info.postalBox],
              ["Email", info.email],
              ["Phone", info.phone],
            ].map(([label, value]) => (
              <div key={label} className="px-6 py-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
                <p className="mt-1 text-sm text-gray-800">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!info && !isEditing && (
        <div className="rounded-xl border border-dashed bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900">No Footer Contact Info yet</h2>
          <button onClick={() => setIsEditing(true)} className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white">
            Create Footer Contact Info
          </button>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white shadow-sm">
          <div className="border-b px-6 py-5">
            <h2 className="font-semibold">{info ? "Edit" : "Create"}</h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {["addressLine1", "addressLine2", "city", "country", "postalBox", "email", "phone"].map((name) => (
              <div key={name} className={name === "addressLine1" ? "sm:col-span-2" : ""}>
                <label className="mb-2 block text-sm font-medium">{name}</label>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={name !== "addressLine2"}
                  className="w-full rounded-lg border px-3 py-2.5 text-sm"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-4">
            <button type="button" onClick={() => { setIsEditing(false); load(); }} className="rounded-lg border bg-white px-4 py-2.5 text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FooterContactInfo;