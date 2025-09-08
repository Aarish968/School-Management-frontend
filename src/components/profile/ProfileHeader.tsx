import { Camera, Edit, User, UserCheck } from "lucide-react";
import type { User as UserType } from "../../api/authService";

export interface ProfileHeaderProps {
  user: (UserType & { username?: string }) | null;
  imagePreview: string;
  isEditMode: boolean;
  onToggleEdit: () => void;
}

export default function ProfileHeader({ user, imagePreview, isEditMode, onToggleEdit }: ProfileHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            {isEditMode && (
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{user?.full_name || (user as any)?.username}</h2>
            {(user as any)?.username && <p className="text-blue-100 mb-2">@{(user as any).username}</p>}
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              user?.role === "teacher"
                ? "bg-purple-500/20 text-purple-100 border border-purple-300/30"
                : "bg-green-500/20 text-green-100 border border-green-300/30"
            }`}>
              <UserCheck className="w-4 h-4 mr-1" />
              {user?.role === "teacher" ? "Teacher" : "Student"}
            </span>
          </div>
        </div>

        <button
          onClick={onToggleEdit}
          className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:-translate-y-0.5 ${
            isEditMode
              ? "bg-red-500/20 text-red-100 border border-red-300/30 hover:bg-red-500/30"
              : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
          }`}
        >
          <Edit className="w-4 h-4" />
          <span>{isEditMode ? "Cancel" : "Edit Profile"}</span>
        </button>
      </div>
    </div>
  );
}


