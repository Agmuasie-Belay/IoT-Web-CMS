import { useEffect, useState } from "react";
import {
  getAdminDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../../services/api/contactApi";

const EMPTY_FORM = {
  name: "",
  slug: "",
  head: "",
  email: "",
  phone: "",
  location: "",
  description: "",
  displayOrder: 0,
  status: "published",
};

function Departments() {
  const [departments, setDepartments] = useState([]);
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
      const result = await getAdminDepartments();
      const data = result?.data ?? result;
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load departments.");
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

  const handleEdit = (dept) => {
    setFormData({
      name: dept.name ?? "",
      slug: dept.slug ?? "",
      head: dept.head ?? "",
      email: dept.email ?? "",
      phone: dept.phone ?? "",
      location: dept.location ?? "",
      description: dept.description ?? "",
      displayOrder: dept.displayOrder ?? 0,
      status: dept.status ?? "published",
    });
    setEditId(dept.id);
    setIsEditing(true);
    setError("");
    setMessage("");
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setEditId(null);
    setIsEditing(false);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");
      setMessage("");

      const payload = {
        ...formData,
        displayOrder: Number(formData.displayOrder) || 0,
      };

      if (editId) {
        await updateDepartment(editId, payload);
        setMessage("Department updated.");
      } else {
        await createDepartment(payload);
        setMessage("Department created.");
      }

      handleCancel();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save department.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await deleteDepartment(id);
      setMessage("Department deleted.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete department.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="text-sm text-gray-500">Loading departments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Departments
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the departments displayed on the contact page.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
          >
            Add Department
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

      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="font-semibold text-gray-900">
              {editId ? "Edit Department" : "New Department"}
            </h2>
          </div>
          <div className="grid gap-5 p-6 sm:grid-cols-2">
            {[
              ["name", "Name", true],
              ["slug", "Slug", true],
              ["head", "Head", true],
              ["email", "Email", true],
              ["phone", "Phone", true],
              ["location", "Location", true],
              ["displayOrder", "Display Order", false],
            ].map(([name, label, required]) => (
              <div key={name}>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  {label}
                </label>
                <input
                  type={name === "displayOrder" ? "number" : "text"}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required={required}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : editId ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Head
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {departments.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                  No departments yet.
                </td>
              </tr>
            )}
            {departments.map((dept) => (
              <tr key={dept.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {dept.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{dept.head}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                      dept.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {dept.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="ml-4 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Departments;