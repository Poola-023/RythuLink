function FraudDetection() {

    const frauds = [

        {
            id: 1,
            user: "Fake Farmer",
            reason: "Spam Uploads"
        },

        {
            id: 2,
            user: "Scammer",
            reason: "Fake Orders"
        }
    ];

    return (

        <div className="min-h-screen bg-green-100 p-10">

            <h1 className="text-4xl font-bold text-red-600 mb-10">
                Fraud Detection 🚨
            </h1>

            <div className="space-y-6">

                {
                    frauds.map((fraud) => (

                        <div
                            key={fraud.id}
                            className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center"
                        >

                            <div>

                                <h2 className="text-2xl font-bold">
                                    {fraud.user}
                                </h2>

                                <p className="text-gray-600">
                                    {fraud.reason}
                                </p>

                            </div>

                            <button
                                className="bg-red-500 text-white px-5 py-2 rounded"
                            >
                                Block User
                            </button>

                        </div>
                    ))
                }

            </div>

        </div>
    );
}

export default FraudDetection;