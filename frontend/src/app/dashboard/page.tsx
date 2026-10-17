export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-8 rounded-lg text-center bg-white shadow-lg">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Вы успешно авторизованы!
        </p>
      </div>
    </div>
  );
}
