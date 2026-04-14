export default function PaymentSuccessPage() {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Mokėjimas inicijuotas sėkmingai
          </h1>
          <p className="text-gray-600">
            Ačiū. Jūsų mokėjimas buvo apdorotas. Užsakymo būseną galutinai patvirtina sistema.
          </p>
        </div>
      </div>
    );
  }