import { useEffect, useState } from "react";
import { getSubmissions, updateSubmissionStatus } from "../../services/api/contactApi";

function Submissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const result = await getSubmissions();
      const data = result?.data ?? result;
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateSubmissionStatus(id, status);
      await load();
      if (selected?.id === id) setSelected({ ...selected, status });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update.");
    }
  };

  if (loading) return <div className="mx-auto max-w-6xl"><div className="rounded-xl border bg-white p-8"><p className="text-sm text-gray-500">Loading...</p></div></div>;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
        <p className="mt-1 text-sm text-gray-500">View messages submitted through the contact form.</p>
      </div>

      {error && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Subject</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {submissions.length === 0 && (
                <tr><td colSpan={3} className="px-4 py-12 text-center text-sm text-gray-500">No submissions yet.</td></tr>
              )}
              {submissions.map((s) => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`cursor-pointer hover:bg-gray-50 ${selected?.id === s.id ? "bg-gray-100" : ""}`}
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{s.subject}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs ${
                      s.status === "replied" ? "bg-green-100 text-green-700" :
                      s.status === "read" ? "bg-blue-100 text-blue-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          {!selected ? (
            <p className="text-sm text-gray-500">Select a submission to view details.</p>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selected.subject}</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div><span className="font-medium">From:</span> {selected.name}</div>
                <div><span className="font-medium">Email:</span> {selected.email}</div>
                {selected.phone && <div><span className="font-medium">Phone:</span> {selected.phone}</div>}
                <div><span className="font-medium">Category:</span> {selected.category}</div>
                <div className="rounded-lg bg-gray-50 p-4 whitespace-pre-line">{selected.message}</div>
              </div>
              <div className="mt-6 flex gap-2">
                {["pending", "read", "replied", "archived"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selected.id, status)}
                    disabled={selected.status === status}
                    className={`rounded-lg px-3 py-2 text-xs font-medium ${
                      selected.status === status
                        ? "bg-gray-900 text-white"
                        : "border bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Mark as {status}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Submissions;