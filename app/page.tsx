export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100 px-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-indigo-900">
          Welcome to Your Admin Panel
        </h1>
        <p className="text-lg text-indigo-700 max-w-xl mx-auto">
          Manage your content, users, and roles with ease. Get started by
          heading over to the dashboard editor.
        </p>
        <a
          href="/admin/dashboard"
          className="inline-block px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          Go to Dashboard
        </a>
      </div>
    </main>
  );
}
