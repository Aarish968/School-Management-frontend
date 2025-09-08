import { Mail, UserCheck } from "lucide-react";

export default function AccountInfo({ email, username }: { email?: string; username?: string }) {
  return (
    <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Mail className="w-5 h-5 mr-2 text-gray-600" />
        Account Information
      </h3>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="group">
          <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
          <div className="relative">
            <input
              type="email"
              value={email || ""}
              disabled
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="group">
          <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
          <div className="relative">
            <input
              type="text"
              value={username || ""}
              disabled
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


