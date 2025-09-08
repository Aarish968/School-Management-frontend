import { UserCheck } from "lucide-react";
import SignupForm from "../components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 pb-12 flex items-center justify-center px-4">
      <div className="relative w-full max-w-lg">
        <div className="bg-white/80 rounded-3xl shadow-2xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl mb-4">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-500">Join SchoolMS today</p>
          </div>
          <div className="px-8 pb-8">
            <SignupForm />
          </div>
        </div>
      </div>
    </div>
  );
}