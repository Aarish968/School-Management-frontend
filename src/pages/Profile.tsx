import React, { useEffect, useState } from "react";
import { User, Camera, Save, RefreshCw, Mail, UserCheck, MapPin, Calendar, Building, Image as ImageIcon, CheckCircle, AlertCircle, Sparkles, Edit, GraduationCap, BookOpen, Users } from "lucide-react";
import { getMe, updateProfile, type UpdateUser, type User as UserType } from "../api/authService";

// Extended user type to include new fields
interface ExtendedUserType extends UserType {
  institution_type?: 'school' | 'college';
  classes?: string;
  department?: string;
  subject?: string;
}

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<ExtendedUserType | null>(null);
  const [formData, setFormData] = useState<Partial<ExtendedUserType>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const me = await getMe();
        setUser(me);
        setFormData(me);
        setImagePreview(me.image || "");
      } catch (err) {
        setError("Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Clear dependent fields when institution type changes
      if (name === 'institution_type') {
        if (value === 'school') {
          // Clear college-specific fields
          if (user?.role === 'student') {
            delete updated.department;
          }
          if (user?.role === 'teacher') {
            delete updated.teacher_dept_id;
          }
        } else if (value === 'college') {
          // Clear school-specific fields
          delete updated.classes;
          delete updated.subject;
        }
      }
      
      return updated;
    });
    
    // Update image preview for URL input
    if (name === 'image') {
      setImagePreview(value);
      setImageFile(null); // Clear file if URL is being used
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setImageFile(file);
      setFormData(prev => ({ ...prev, image: undefined })); // Clear URL if file is being used
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare FormData for the API
      const updateData = new FormData();
      
      // Add only the fields that can be updated
      if (formData.full_name !== undefined && formData.full_name !== user.full_name) {
        updateData.append('full_name', formData.full_name);
      }
      if (formData.address !== undefined && formData.address !== user.address) {
        updateData.append('address', formData.address || '');
      }
      if (formData.age !== undefined && formData.age !== user.age) {
        updateData.append('age', formData.age.toString());
      }
      
      // New institution-related fields
      if (formData.institution_type !== undefined && formData.institution_type !== user.institution_type) {
        updateData.append('institution_type', formData.institution_type);
      }
      if (formData.classes !== undefined && formData.classes !== user.classes) {
        updateData.append('classes', formData.classes);
      }
      if (formData.department !== undefined && formData.department !== user.department) {
        updateData.append('department', formData.department);
      }
      if (formData.subject !== undefined && formData.subject !== user.subject) {
        updateData.append('subject', formData.subject);
      }
      
      // Teacher department ID (only for college teachers)
      if (user.role === 'teacher' && formData.institution_type === 'college' && 
          formData.teacher_dept_id !== undefined && formData.teacher_dept_id !== user.teacher_dept_id) {
        updateData.append('teacher_dept_id', formData.teacher_dept_id.toString());
      }
      
      // Handle image upload
      if (imageFile) {
        updateData.append('image', imageFile);
      } else if (formData.image && formData.image !== user.image) {
        // If using URL and it's different from current
        updateData.append('image', formData.image);
      }

      const updated = await updateProfile(updateData);
      setUser(updated);
      setFormData(updated);
      setImagePreview(updated.image || "");
      setSuccess("Profile updated successfully!");
      setIsEditMode(false); // Return to view mode
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData(user);
      setImagePreview(user.image || "");
      setImageFile(null);
      setError(null);
      setSuccess(null);
    }
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      // Entering edit mode - reset form data to current user data
      if (user) {
        setFormData(user);
        setImagePreview(user.image || "");
        setImageFile(null);
      }
    }
    setError(null);
    setSuccess(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <Sparkles className="w-6 h-6 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  const renderField = (label: string, value: string | number | undefined, name: string, type: string = "text", icon: React.ReactNode, placeholder?: string, isTextarea?: boolean) => {
    if (!isEditMode) {
      return (
        <div className="group">
          <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
          <div className="relative">
            <div className="w-full px-4 py-3 pl-11 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700">
              {value || 'Not set'}
            </div>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          </div>
        </div>
      );
    }

    if (isTextarea) {
      return (
        <div className="group">
          <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
            {label}
          </label>
          <div className="relative">
            <textarea
              name={name}
              value={formData[name as keyof ExtendedUserType] || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 group-hover:shadow-md resize-none"
              placeholder={placeholder}
            />
            <div className="absolute left-3 top-4 transition-colors duration-200 group-focus-within:text-blue-500 text-gray-400">
              {icon}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
          {label}
        </label>
        <div className="relative">
          <input
            type={type}
            name={name}
            value={formData[name as keyof ExtendedUserType] || ""}
            onChange={handleChange}
            min={type === "number" ? "1" : undefined}
            max={type === "number" && name === "age" ? "120" : undefined}
            className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 group-hover:shadow-md"
            placeholder={placeholder}
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 group-focus-within:text-blue-500 text-gray-400">
            {icon}
          </div>
        </div>
      </div>
    );
  };

  const renderSelectField = (label: string, value: string | undefined, name: string, options: {value: string, label: string}[], icon: React.ReactNode) => {
    if (!isEditMode) {
      return (
        <div className="group">
          <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
          <div className="relative">
            <div className="w-full px-4 py-3 pl-11 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-700">
              {options.find(opt => opt.value === value)?.label || 'Not set'}
            </div>
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="group">
        <label className="block text-sm font-medium text-gray-700 mb-2 transition-colors duration-200 group-focus-within:text-blue-600">
          {label}
        </label>
        <div className="relative">
          <select
            name={name}
            value={formData[name as keyof ExtendedUserType] || ""}
            onChange={handleChange}
            className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300 group-hover:shadow-md appearance-none bg-white"
          >
            <option value="">Select {label.toLowerCase()}...</option>
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 group-focus-within:text-blue-500 text-gray-400">
            {icon}
          </div>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  // Helper function to check if a field should be displayed
  const shouldShowField = (value: any) => {
    return value !== null && value !== undefined && value !== '';
  };

  const institutionOptions = [
    { value: 'school', label: 'School' },
    { value: 'college', label: 'College' }
  ];

  // For view mode (use user) or edit mode (use formData)
  const currentInstitutionType = isEditMode ? formData.institution_type : user?.institution_type;

  const shouldShowDepartmentId = user?.role === 'teacher' && currentInstitutionType === 'college';
  const shouldShowClass = currentInstitutionType === 'school';
  const shouldShowDepartment = currentInstitutionType === 'college';
  // const shouldShowSubject = user?.role === 'teacher';
  const shouldShowSubject = user?.role === 'teacher' && currentInstitutionType === 'school';


  // For edit mode, use formData to determine what to show
  const editModeInstitutionType = formData.institution_type;
  const shouldShowDepartmentIdEdit = user?.role === 'teacher' && editModeInstitutionType === 'college';
  const shouldShowClassEdit = editModeInstitutionType === 'school';
  const shouldShowDepartmentEdit = editModeInstitutionType === 'college';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Animated Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden animate-slide-up">
          {/* Profile Header */}
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
                  <h2 className="text-2xl font-bold mb-1">{user?.full_name || user?.username}</h2>
                  <p className="text-blue-100 mb-2">@{user?.username}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    user?.role === 'teacher' 
                      ? 'bg-purple-500/20 text-purple-100 border border-purple-300/30' 
                      : 'bg-green-500/20 text-green-100 border border-green-300/30'
                  }`}>
                    <UserCheck className="w-4 h-4 mr-1" />
                    {user?.role === 'teacher' ? 'Teacher' : 'Student'}
                  </span>
                </div>
              </div>

              {/* Edit/Cancel Button */}
              <button
                onClick={handleEditToggle}
                className={`px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-200 transform hover:-translate-y-0.5 ${
                  isEditMode 
                    ? 'bg-red-500/20 text-red-100 border border-red-300/30 hover:bg-red-500/30' 
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                <Edit className="w-4 h-4" />
                <span>{isEditMode ? 'Cancel' : 'Edit Profile'}</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          {(success || error) && (
            <div className={`mx-8 mt-6 p-4 rounded-xl border animate-bounce-in ${
              success 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center space-x-2">
                {success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-medium">{success || error}</span>
              </div>
            </div>
          )}

          {/* Form Content */}
          <div className="p-8">
            <div className="space-y-8">
              {/* Read-only Information */}
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
                        value={user?.email || ""}
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
                        value={user?.username || ""}
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

              {/* Personal Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Personal Information
                </h3>

                {/* Profile Image - Only show in edit mode */}
                {isEditMode && (
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-20 h-20 rounded-2xl object-cover border-4 border-blue-100 shadow-lg transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-blue-100 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                            <User className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Camera className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer font-medium"
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Upload Photo
                        </label>
                        
                        <input
                          type="url"
                          name="image"
                          value={formData.image || ""}
                          onChange={handleChange}
                          placeholder="Or paste image URL..."
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Fields Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  {renderField("Full Name", user?.full_name, "full_name", "text", <User className="w-5 h-5" />, "Enter your full name")}

                  {/* Age */}
                  {renderField("Age", user?.age, "age", "number", <Calendar className="w-5 h-5" />, "Your age")}
                </div>

                {/* Address */}
                {renderField("Address", user?.address, "address", "text", <MapPin className="w-5 h-5" />, "Enter your address...", true)}

                {/* Institution Information - Show only if at least one field has a value */}
                {(shouldShowField(user?.institution_type) || 
                  shouldShowField(user?.classes) || 
                  shouldShowField(user?.department) || 
                  shouldShowField(user?.subject) || 
                  shouldShowField(user?.teacher_dept_id) || 
                  isEditMode) && (
                  <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl p-6 border border-blue-100/50">
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center">
                      <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                      Institution Information
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Institution Type - Always show if it has a value or in edit mode */}
                      {(shouldShowField(user?.institution_type) || isEditMode) && 
                        renderSelectField("Institution Type", isEditMode ? formData.institution_type : user?.institution_type, "institution_type", institutionOptions, <Building className="w-5 h-5" />)
                      }

                      {/* Class - Show only for school and if it has a value or in edit mode */}
                      {((shouldShowClass && shouldShowField(user?.classes)) || (isEditMode && shouldShowClassEdit)) && 
                        renderField("Class", user?.classes, "classes", "number", <Users className="w-5 h-5" />, "Enter class number")
                      }

                      {/* Department - Show only for college and if it has a value or in edit mode */}
                      {((shouldShowDepartment && shouldShowField(user?.department)) || (isEditMode && shouldShowDepartmentEdit)) && 
                        renderField("Department", user?.department, "department", "text", <Building className="w-5 h-5" />, "Enter department name")
                      }

                      {/* Subject - Show only for teachers and if it has a value or in edit mode */}
                      {((shouldShowSubject && shouldShowField(user?.subject)) || (isEditMode && shouldShowSubject)) && 
                        renderField("Subject", user?.subject, "subject", "text", <BookOpen className="w-5 h-5" />, "Enter subject")
                      }

                      {/* Department ID - Show only for college teachers and if it has a value or in edit mode */}
                      {((shouldShowDepartmentId && shouldShowField(user?.teacher_dept_id)) || (isEditMode && shouldShowDepartmentIdEdit)) && 
                        renderField("Department ID", user?.teacher_dept_id, "teacher_dept_id", "number", <Building className="w-5 h-5" />, "Department ID")
                      }
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - Only show in edit mode */}
              {isEditMode && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Changes</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={updating}
                    className="flex-1 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {updating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Stats/Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/80 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900 truncate">{user?.email}</p>
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
                <p className="font-semibold text-gray-900 capitalize">{user?.role}</p>
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
                <p className="font-semibold text-gray-900 capitalize">{user?.institution_type || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.8); }
          50% { transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;