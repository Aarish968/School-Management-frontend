import { GraduationCap, UserPlus } from "lucide-react";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500">Sign in to your SchoolMS account</p>
          </div>

          <div className="px-8 pb-8 space-y-6">
            <LoginForm />

            <a
              href="/signup"
              className="block w-full text-center py-4 bg-white border border-gray-200 rounded-2xl"
            >
              <UserPlus className="inline-block mr-2" />
              Create New Account
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
