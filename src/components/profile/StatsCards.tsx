import { GraduationCap, Mail, UserCheck } from "lucide-react";

export default function StatsCards({ email, role, institution }: { email?: string; role?: string; institution?: string }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-semibold text-gray-900 truncate">{email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <p className="font-semibold text-gray-900 capitalize">{role}</p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-slide-up" style={{animationDelay: '0.3s'}}>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Institution</p>
            <p className="font-semibold text-gray-900 capitalize">{institution || 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


