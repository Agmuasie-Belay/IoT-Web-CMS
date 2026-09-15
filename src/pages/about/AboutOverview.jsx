import { useEffect, useState } from "react";

import {
  getAboutOverview,
  createAboutOverview,
  updateAboutOverview,
  deleteAboutOverview,
} from "../../services/api/aboutApi";

const EMPTY_FORM = {
  eyebrow: "",
  title: "",
  description: "",
  excellenceText: "",
  status: "draft",
};

function AboutOverview() {
  const [overview, setOverview] = useState(null);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  /*
   * --------------------------------------------------
   * Load About Overview from database
   * --------------------------------------------------
   */
  const loadOverview = async () => {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const result = await getAboutOverview();

      /*
       * Supports either:
       *
       * { aboutOverview: {...} }
       * { data: {...} }
       * {...}
       *
       * and also an array response.
       */
      let data =
        result?.aboutOverview ??
        result?.data ??
        result;

      if (Array.isArray(data)) {
        data = data.length > 0 ? data[0] : null;
      }

      if (data) {
        setOverview(data);

        setFormData({
          eyebrow: data.eyebrow ?? "",
          title: data.title ?? "",
          description: data.description ?? "",
          excellenceText: data.excellenceText ?? "",
          status: data.status ?? "draft",
        });
      } else {
        setOverview(null);
        setFormData(EMPTY_FORM);
      }

      setIsEditing(false);
    } catch (err) {
      console.error("Failed to load About Overview:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load About Overview."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * --------------------------------------------------
   * Initial load
   * --------------------------------------------------
   */
  useEffect(() => {
    loadOverview();
  }, []);

  /*
   * --------------------------------------------------
   * Form change
   * --------------------------------------------------
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /*
   * --------------------------------------------------
   * Start editing existing record
   * --------------------------------------------------
   */
  const handleEdit = () => {
    if (!overview) return;

    setFormData({
      eyebrow: overview.eyebrow ?? "",
      title: overview.title ?? "",
      description: overview.description ?? "",
      excellenceText: overview.excellenceText ?? "",
      status: overview.status ?? "draft",
    });

    setError("");
    setMessage("");
    setIsEditing(true);
  };

  /*
   * --------------------------------------------------
   * Start creating new record
   * --------------------------------------------------
   */
  const handleCreate = () => {
    setFormData(EMPTY_FORM);

    setError("");
    setMessage("");
    setIsEditing(true);
  };

  /*
   * --------------------------------------------------
   * Cancel editing
   * --------------------------------------------------
   */
  const handleCancel = () => {
    setError("");
    setMessage("");

    /*
     * If a database record exists,
     * restore its values.
     */
    if (overview) {
      setFormData({
        eyebrow: overview.eyebrow ?? "",
        title: overview.title ?? "",
        description: overview.description ?? "",
        excellenceText: overview.excellenceText ?? "",
        status: overview.status ?? "draft",
      });
    } else {
      /*
       * No record exists, so return to empty state.
       */
      setFormData(EMPTY_FORM);
    }

    setIsEditing(false);
  };

  /*
   * --------------------------------------------------
   * Save
   *
   * Existing record → PUT
   * No record       → POST
   * --------------------------------------------------
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (overview?.id) {
        await updateAboutOverview(
          overview.id,
          formData
        );

        setMessage(
          "About Overview updated successfully."
        );
      } else {
        await createAboutOverview(formData);

        setMessage(
          "About Overview created successfully."
        );
      }

      /*
       * Always reload from database after mutation.
       *
       * This ensures the CMS displays the actual
       * persisted database state.
       */
      await loadOverview();
    } catch (err) {
      console.error("Failed to save About Overview:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save About Overview."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * --------------------------------------------------
   * Delete
   * --------------------------------------------------
   */
  const handleDelete = async () => {
    if (!overview?.id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete the About Overview? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");
      setMessage("");

      await deleteAboutOverview(overview.id);

      setMessage(
        "About Overview deleted successfully."
      );

      /*
       * Reload database state.
       *
       * The UI will now move to the
       * "no record exists" state.
       */
      await loadOverview();
    } catch (err) {
      console.error(
        "Failed to delete About Overview:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to delete About Overview."
      );
    } finally {
      setDeleting(false);
    }
  };

  /*
   * --------------------------------------------------
   * Loading state
   * --------------------------------------------------
   */
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl border border-gray-200 bg-white p-8">
          <p className="text-sm text-gray-500">
            Loading About Overview...
          </p>
        </div>
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * Main page
   * --------------------------------------------------
   */
  return (
    <div className="mx-auto max-w-5xl">
      {/* --------------------------------------------- */}
      {/* Page Header */}
      {/* --------------------------------------------- */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            About Overview
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage the main About section displayed on
            the public website.
          </p>
        </div>

        {/* Create button only when no record exists */}
        {!overview && !isEditing && (
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Create Overview
          </button>
        )}

        {/* Edit/Delete buttons when record exists */}
        {overview && !isEditing && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {/* --------------------------------------------- */}
      {/* Error Message */}
      {/* --------------------------------------------- */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* Success Message */}
      {/* --------------------------------------------- */}

      {message && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* NO RECORD + NOT EDITING */}
      {/* --------------------------------------------- */}

      {!overview && !isEditing && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto max-w-md">
            <h2 className="text-lg font-semibold text-gray-900">
              No About Overview found
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              There is currently no About Overview content
              stored in the database. Create one to publish
              the main About section of the website.
            </p>

            <button
              type="button"
              onClick={handleCreate}
              className="mt-6 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Create Overview
            </button>
          </div>
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* EXISTING RECORD + VIEW MODE */}
      {/* --------------------------------------------- */}

      {overview && !isEditing && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  About Overview
                </p>

                <h2 className="mt-1 text-xl font-semibold text-gray-900">
                  {overview.title}
                </h2>
              </div>

              {/* Status */}
              <span
                className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${
                  overview.status === "published"
                    ? "bg-green-100 text-green-700"
                    : overview.status === "archived"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {overview.status}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-100">
            {/* Eyebrow */}
            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Eyebrow
              </p>

              <p className="mt-2 text-sm text-gray-800">
                {overview.eyebrow || "—"}
              </p>
            </div>

            {/* Title */}
            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Title
              </p>

              <p className="mt-2 text-base font-medium text-gray-900">
                {overview.title || "—"}
              </p>
            </div>

            {/* Description */}
            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Description
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-700">
                {overview.description || "—"}
              </p>
            </div>

            {/* Excellence Text */}
            <div className="px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                Excellence Text
              </p>

              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-700">
                {overview.excellenceText || "—"}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:justify-between">
              <span>
                ID: {overview.id}
              </span>

              {overview.updatedAt && (
                <span>
                  Last updated:{" "}
                  {new Date(
                    overview.updatedAt
                  ).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------- */}
      {/* CREATE / EDIT FORM */}
      {/* --------------------------------------------- */}

      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
        >
          {/* Form Header */}
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="font-semibold text-gray-900">
              {overview
                ? "Edit About Overview"
                : "Create About Overview"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {overview
                ? "Update the existing About Overview content."
                : "Add the initial About Overview content to the database."}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-6 p-6">
            {/* Eyebrow */}
            <div>
              <label
                htmlFor="eyebrow"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Eyebrow
              </label>

              <input
                id="eyebrow"
                name="eyebrow"
                value={formData.eyebrow}
                onChange={handleChange}
                placeholder="e.g. About University of Gondar"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Title
              </label>

              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="About University of Gondar"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={7}
                required
                placeholder="Enter the main About description..."
                className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Excellence Text */}
            <div>
              <label
                htmlFor="excellenceText"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Excellence Text
              </label>

              <textarea
                id="excellenceText"
                name="excellenceText"
                value={formData.excellenceText}
                onChange={handleChange}
                rows={5}
                placeholder="Optional supporting text about institutional excellence..."
                className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>

                <option value="archived">
                  Archived
                </option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : overview
                ? "Save Changes"
                : "Create Overview"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AboutOverview;