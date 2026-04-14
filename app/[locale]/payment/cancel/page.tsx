export default function PaymentCancelPage() {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Mokėjimas nutrauktas
          </h1>
          <p className="text-gray-600">
            Mokėjimas nebuvo užbaigtas. Galite pabandyti dar kartą.
          </p>
        </div>
      </div>
    );
  }