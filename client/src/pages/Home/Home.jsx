import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-lg w-[420px] text-center">

        <h1 className="text-3xl font-bold text-slate-800">
          Authentication System
        </h1>

        <p className="text-gray-500 mt-3">
          MERN + JWT + Email OTP + Phone OTP
        </p>

        <div className="mt-10 flex flex-col gap-4">

          <Link
            to="/register"
            className="bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>

          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition"
          >
            Login
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Home;