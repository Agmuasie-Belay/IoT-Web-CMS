function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl">

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage the content of the IoT Website.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Content
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            1
          </p>

          <p className="mt-1 text-sm text-gray-500">
            CMS sections implemented
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Status
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            Active
          </p>

          <p className="mt-1 text-sm text-gray-500">
            CMS API connected
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Modules
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            1
          </p>

          <p className="mt-1 text-sm text-gray-500">
            About module
          </p>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;