import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { 
  Upload, 
  Users, 
  BookOpen, 
  Send, 
  X, 
  FileText, 
  Check,
  Plus,
  Trash2,
  Loader,
  AlertCircle
} from 'lucide-react';
import { getStudents, getTeachers } from '../api/authService';
import type { StudentsResponse, TeachersResponse } from '../api/authService';
import { uploadAssignment } from '../api/assignmentApi';

// Type definitions
interface FileAttachment {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
}

interface FormData {
  title: string;
  description: string;
  type: string;
  selectedStudents: string[];
  assignedTeacher: string;
  dueDate: string;
  dueTime: string;
  attachments: FileAttachment[];
}

interface UIState {
  dragActive: boolean;
  showStudentModal: boolean;
  isSubmitting: boolean;
  submitSuccess: boolean;
  isLoadingStudents: boolean;
  isLoadingTeachers: boolean;
  submitError: string | null;
}

interface FilteredStudent {
  id: string;
  name: string;
  class: string;
  email: string;
  institution_type: string;
  originalId: number;
}

interface FilteredTeacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  institution_type: string;
  originalId: number;
}

const HomeworkUploadPage = () => {
  // State management
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    type: 'homework',
    selectedStudents: [],
    assignedTeacher: '',
    dueDate: '',
    dueTime: '',
    attachments: []
  });

  const [uiState, setUiState] = useState<UIState>({
    dragActive: false,
    showStudentModal: false,
    isSubmitting: false,
    submitSuccess: false,
    isLoadingStudents: false,
    isLoadingTeachers: false,
    submitError: null
  });

  // API data states
  const [apiData, setApiData] = useState<{
    students: StudentsResponse;
    teachers: TeachersResponse;
  }>({
    students: {
      school_students: [],
      college_students: []
    },
    teachers: {
      school_teachers: [],
      college_teachers: []
    }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data formatting functions
  const formatAssignmentData = useCallback((formData: FormData, selectedStudentsData: FilteredStudent[], assignedTeacherId: number) => {
    const apiFormData = new FormData();

    // Add basic fields
    apiFormData.append('title', formData.title);
    apiFormData.append('description', formData.description);
    apiFormData.append('type', formData.type);
    apiFormData.append('assigned_teacher_id', assignedTeacherId.toString());
    apiFormData.append('due_date', formData.dueDate);
    
    if (formData.dueTime) {
      apiFormData.append('due_time', formData.dueTime);
    }

    // Add students - FIXED: Extract actual numeric ID from the original data
    selectedStudentsData.forEach((student: FilteredStudent) => {
      // Get the original student data to extract the real ID
      const studentType = formData.type === 'homework' ? 'school_students' : 'college_students';
      const studentIndex = parseInt(student.id.split('_').pop() || '0');
      const originalStudent = apiData.students[studentType][studentIndex];
      
      // Use the actual ID from the original data, or fallback to index
      const actualStudentId = originalStudent?.id || studentIndex;
      apiFormData.append('students', actualStudentId.toString());
    });

    // Add attachments
    formData.attachments.forEach((attachment: FileAttachment) => {
      apiFormData.append('attachments', attachment.file, attachment.name);
    });

    return apiFormData;
  }, [apiData.students]);

  // API functions
  const fetchStudents = useCallback(async () => {
    setUiState(prev => ({ ...prev, isLoadingStudents: true }));
    try {
      const data = await getStudents();
      setApiData(prev => ({
        ...prev,
        students: data
      }));
    } catch (error) {
      console.error('Error fetching students:', error);
      // Fallback to sample data for demo
      setApiData(prev => ({
        ...prev,
        students: {
          school_students: [
            { id: 1, full_name: 'Alice Johnson', classes: 10, email: 'alice@school.com', institution_type: 'school' },
            { id: 2, full_name: 'Bob Smith', classes: 10, email: 'bob@school.com', institution_type: 'school' },
            { id: 3, full_name: 'Carol Davis', classes: 11, email: 'carol@school.com', institution_type: 'school' },
            { id: 4, full_name: 'David Wilson', classes: 9, email: 'david@school.com', institution_type: 'school' }
          ],
          college_students: [
            { id: 5, full_name: 'Emma Brown', department: 'Computer Science', email: 'emma@college.com', institution_type: 'college' },
            { id: 6, full_name: 'Frank Miller', department: 'Mechanical Engineering', email: 'frank@college.com', institution_type: 'college' },
            { id: 7, full_name: 'Grace Lee', department: 'Business Administration', email: 'grace@college.com', institution_type: 'college' },
            { id: 8, full_name: 'Henry Taylor', department: 'Biology', email: 'henry@college.com', institution_type: 'college' }
          ]
        }
      }));
    } finally {
      setUiState(prev => ({ ...prev, isLoadingStudents: false }));
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    setUiState(prev => ({ ...prev, isLoadingTeachers: true }));
    try {
      const data = await getTeachers();
      setApiData(prev => ({
        ...prev,
        teachers: data
      }));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Fallback to sample data for demo
      setApiData(prev => ({
        ...prev,
        teachers: {
          school_teachers: [
            { id: 1, full_name: 'Dr. Sarah Johnson', subject: 'Mathematics', email: 'sarah@school.com', institution_type: 'school' },
            { id: 2, full_name: 'Mr. Michael Brown', subject: 'English', email: 'michael@school.com', institution_type: 'school' },
            { id: 3, full_name: 'Ms. Lisa Wilson', subject: 'Physics', email: 'lisa@school.com', institution_type: 'school' }
          ],
          college_teachers: [
            { id: 4, full_name: 'Dr. James Davis', department: 'Computer Science', email: 'james@college.com', institution_type: 'college' },
            { id: 5, full_name: 'Dr. Amanda White', department: 'Mechanical Engineering', email: 'amanda@college.com', institution_type: 'college' },
            { id: 6, full_name: 'Prof. Robert Clark', department: 'Business Administration', email: 'robert@college.com', institution_type: 'college' }
          ]
        }
      }));
    } finally {
      setUiState(prev => ({ ...prev, isLoadingTeachers: false }));
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, [fetchStudents, fetchTeachers]);

  // Get filtered students and teachers based on type
  const filteredStudents = useMemo(() => {
    if (formData.type === 'homework') {
      return apiData.students.school_students.map((student, index) => ({
        id: `school_student_${index}`,
        name: student.full_name,
        class: `Class ${student.classes}`,
        email: student.email,
        institution_type: student.institution_type,
        originalId: student.id // Store the original ID
      }));
    } else {
      return apiData.students.college_students.map((student, index) => ({
        id: `college_student_${index}`,
        name: student.full_name,
        class: student.department,
        email: student.email,
        institution_type: student.institution_type,
        originalId: student.id // Store the original ID
      }));
    }
  }, [formData.type, apiData.students]);

  const filteredTeachers: FilteredTeacher[] = useMemo(() => {
    if (formData.type === 'homework') {
      return apiData.teachers.school_teachers.map((teacher, index) => ({
        id: `school_teacher_${index}`,
        name: teacher.full_name,
        subject: teacher.subject,
        email: teacher.email,
        institution_type: teacher.institution_type,
        originalId: teacher.id // Store the original ID
      }));
    } else {
      return apiData.teachers.college_teachers.map((teacher, index) => ({
        id: `college_teacher_${index}`,
        name: teacher.full_name,
        subject: teacher.department,
        email: teacher.email,
        institution_type: teacher.institution_type,
        originalId: teacher.id // Store the original ID
      }));
    }
  }, [formData.type, apiData.teachers]);

  // Event handlers with useCallback for optimization
  const handleInputChange = useCallback((field: keyof FormData, value: any) => {
    // If type changes, reset selected students and teacher
    if (field === 'type') {
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        selectedStudents: [],
        assignedTeacher: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const isDragEnter = e.type === 'dragenter' || e.type === 'dragover';
    setUiState(prev => ({ ...prev, dragActive: isDragEnter }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUiState(prev => ({ ...prev, dragActive: false }));
    
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    const newFiles: FileAttachment[] = Array.from(files).map((file: File) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter(file => file.id !== id)
    }));
  }, []);

  const toggleStudentSelection = useCallback((studentId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentId)
        ? prev.selectedStudents.filter(id => id !== studentId)
        : [...prev.selectedStudents, studentId]
    }));
  }, []);

  const selectAllStudents = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      selectedStudents: filteredStudents.map(s => s.id)
    }));
  }, [filteredStudents]);

  const clearAllStudents = useCallback(() => {
    setFormData(prev => ({ ...prev, selectedStudents: [] }));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Validation
    if (!formData.title.trim()) {
      alert('Please enter assignment title');
      return;
    }
    
    if (!formData.assignedTeacher) {
      alert('Please select a teacher');
      return;
    }
    
    if (!formData.dueDate) {
      alert('Please select due date');
      return;
    }

    if (formData.selectedStudents.length === 0) {
      alert('Please select at least one student');
      return;
    }

    setUiState(prev => ({ ...prev, isSubmitting: true, submitError: null }));
    
    try {
      // Get selected students data
      const selectedStudentsData = formData.selectedStudents.map(id => 
        filteredStudents.find(s => s.id === id)
      ).filter((student): student is FilteredStudent => Boolean(student));

      // FIXED: Extract teacher ID correctly
      const selectedTeacher = filteredTeachers.find(t => t.id === formData.assignedTeacher);
      const teacherId = selectedTeacher?.originalId || parseInt(formData.assignedTeacher.split('_').pop() || '0');

      console.log('Selected Teacher:', selectedTeacher);
      console.log('Teacher ID to send:', teacherId);
      console.log('Selected Students:', selectedStudentsData);

      // Format data for API
      const apiFormData = formatAssignmentData(
        formData, 
        selectedStudentsData, 
        teacherId
      );

      console.log('Sending API payload:');
      // Log FormData contents for debugging
      for (let [key, value] of apiFormData.entries()) {
        console.log(key, value);
      }
      
      // Call the upload API
      const response = await uploadAssignment(apiFormData);
      
      console.log('Assignment uploaded successfully:', response);
      
      setUiState(prev => ({ ...prev, submitSuccess: true }));
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          type: 'homework',
          selectedStudents: [],
          assignedTeacher: '',
          dueDate: '',
          dueTime: '',
          attachments: []
        });
        setUiState(prev => ({ 
          ...prev, 
          submitSuccess: false, 
          submitError: null 
        }));
      }, 3000);
      
    } catch (error: unknown) {
      console.error('Submission error:', error);
      setUiState(prev => ({ 
        ...prev, 
        submitError: (error as Error).message || 'Failed to upload assignment. Please try again.' 
      }));
    } finally {
      setUiState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [formData, filteredStudents, filteredTeachers, formatAssignmentData]);

  // Utility functions
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }, []);

  const getSelectedStudentsDisplay = useMemo(() => {
    return formData.selectedStudents.map(id => 
      filteredStudents.find(s => s.id === id)
    ).filter((student): student is FilteredStudent => Boolean(student));
  }, [formData.selectedStudents, filteredStudents]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-30 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-2xl shadow-blue-500/25">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Create Assignment
          </h1>
          <p className="text-xl text-gray-600 max-w-2x2 mx-auto leading-relaxed">
            Design and distribute homework or assignments to your students with ease
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assignment Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-slide-in-left">
              <div className="flex items-center mb-8">
                <div className="w-3 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800">Assignment Details</h2>
              </div>

              {/* Assignment Type Toggle */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Assignment Type</label>
                <div className="inline-flex bg-gray-100 rounded-2xl p-1 relative">
                  <div 
                    className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-xl shadow-lg transition-transform duration-300 ${
                      formData.type === 'assignment' ? 'translate-x-full' : 'translate-x-0'
                    }`}
                  ></div>
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'homework')}
                    className={`relative z-10 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                      formData.type === 'homework' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    📝 Homework (School)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInputChange('type', 'assignment')}
                    className={`relative z-10 px-8 py-3 rounded-xl font-medium transition-all duration-300 ${
                      formData.type === 'assignment' ? 'text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    📋 Assignment (College)
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Title */}
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400"
                    placeholder="Enter assignment title..."
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm placeholder-gray-400 resize-none"
                    placeholder="Describe the assignment objectives and requirements..."
                  />
                </div>

                {/* Teacher Selection */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Assigned Teacher <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.assignedTeacher}
                      onChange={(e) => handleInputChange('assignedTeacher', e.target.value)}
                      disabled={uiState.isLoadingTeachers}
                      className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">
                        {uiState.isLoadingTeachers ? 'Loading teachers...' : `Select a ${formData.type === 'homework' ? 'school' : 'college'} teacher...`}
                      </option>
                      {filteredTeachers.map(teacher => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.subject}
                        </option>
                      ))}
                    </select>
                    {uiState.isLoadingTeachers && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <Loader className="w-5 h-5 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Due Date */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Due Time */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Due Time</label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => handleInputChange('dueTime', e.target.value)}
                    className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center mb-8">
                <div className="w-3 h-8 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-4"></div>
                <h2 className="text-2xl font-bold text-gray-800">Attachments</h2>
              </div>
              
              {/* Drag & Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-500 ${
                  uiState.dragActive 
                    ? 'border-blue-500 bg-blue-50/50 scale-105 shadow-2xl' 
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                />
                
                <div className="space-y-6">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                    <Upload className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">Drop files here or</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Browse Files
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">Supports: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, Images (Max 10MB each)</p>
                </div>
              </div>

              {/* File List */}
              {formData.attachments.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h4 className="font-semibold text-gray-700 text-lg">Uploaded Files ({formData.attachments.length})</h4>
                  <div className="grid gap-4">
                    {formData.attachments.map((attachment, index) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-2xl border border-gray-200 animate-slide-in-up shadow-sm hover:shadow-md transition-all duration-300"
                        style={{animationDelay: `${index * 0.1}s`}}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{attachment.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(attachment.id)}
                          className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-110"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Students & Actions */}
          <div className="lg:col-span-1 space-y-8">
            {/* Students Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8 animate-slide-in-right">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-3 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full mr-4"></div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {formData.type === 'homework' ? 'School Students' : 'College Students'}
                  </h2>
                </div>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {formData.selectedStudents.length} selected
                </span>
              </div>

              <button
                type="button"
                onClick={() => setUiState(prev => ({ ...prev, showStudentModal: true }))}
                disabled={uiState.isLoadingStudents}
                className="w-full mb-6 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {uiState.isLoadingStudents ? (
                  <>
                    <Loader className="w-5 h-5 mr-3 animate-spin" />
                    Loading Students...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5 mr-3" />
                    Select Students
                  </>
                )}
              </button>

              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {getSelectedStudentsDisplay.length > 0 ? (
                  getSelectedStudentsDisplay.map((student, index) => (
                    <div
                      key={student.id}
                      className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 animate-slide-in-up"
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800 text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.class}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No students selected</p>
                    <p className="text-sm">Click "Select Students" to assign</p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="animate-slide-in-right" style={{animationDelay: '0.2s'}}>
              {/* Error Message */}
              {uiState.submitError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700 text-sm">{uiState.submitError}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={uiState.isSubmitting || uiState.submitSuccess}
                className={`w-full inline-flex items-center justify-center px-8 py-6 font-bold rounded-3xl transition-all duration-500 transform text-lg shadow-2xl ${
                  uiState.submitSuccess
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white scale-105'
                    : uiState.isSubmitting
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white scale-95 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-blue-500/25'
                }`}
              >
                {uiState.isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-4"></div>
                    Creating Assignment...
                  </>
                ) : uiState.submitSuccess ? (
                  <>
                    <Check className="w-6 h-6 mr-4" />
                    Assignment Created!
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-4" />
                    Create {formData.type === 'homework' ? 'Homework' : 'Assignment'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Selection Modal */}
      {uiState.showStudentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  Select {formData.type === 'homework' ? 'School Students' : 'College Students'}
                </h3>
                <p className="text-gray-600 mt-2">Choose students to assign this {formData.type}</p>
              </div>
              <button
                onClick={() => setUiState(prev => ({ ...prev, showStudentModal: false }))}
                className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {uiState.isLoadingStudents ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-xl font-semibold text-gray-700">Loading students...</p>
                  <p className="text-gray-500">Please wait while we fetch the student list</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-wrap gap-4 mb-8">
                  <button
                    type="button"
                    onClick={selectAllStudents}
                    className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all duration-300 font-semibold"
                  >
                    Select All ({filteredStudents.length})
                  </button>
                  <button
                    type="button"
                    onClick={clearAllStudents}
                    className="px-6 py-3 bg-gray-600 text-white rounded-2xl hover:bg-gray-700 transition-all duration-300 font-semibold"
                  >
                    Clear All
                  </button>
                  <div className="ml-auto flex items-center text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-xl">
                    <Users className="w-4 h-4 mr-2" />
                    Showing {formData.type === 'homework' ? 'School' : 'College'} Students
                  </div>
                </div>

                {filteredStudents.length === 0 ? (
                  <div className="text-center py-20">
                    <Users className="w-20 h-20 mx-auto mb-6 text-gray-300" />
                    <h4 className="text-2xl font-bold text-gray-600 mb-2">No Students Found</h4>
                    <p className="text-gray-500">
                      No {formData.type === 'homework' ? 'school' : 'college'} students are available at the moment.
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredStudents.map((student, index) => (
                      <div
                        key={student.id}
                        onClick={() => toggleStudentSelection(student.id)}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 animate-slide-in-up hover:shadow-lg ${
                          formData.selectedStudents.includes(student.id)
                            ? 'border-blue-500 bg-blue-50 transform scale-105 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        style={{animationDelay: `${index * 0.05}s`}}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg ${
                              formData.selectedStudents.includes(student.id)
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                : 'bg-gradient-to-r from-gray-400 to-gray-500'
                            }`}>
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{student.name}</p>
                              <p className="text-sm text-gray-500">{student.class}</p>
                              <p className="text-xs text-gray-400">{student.email}</p>
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-3 transition-all duration-300 ${
                            formData.selectedStudents.includes(student.id)
                              ? 'bg-blue-600 border-blue-600 scale-110'
                              : 'border-gray-300'
                          }`}>
                            {formData.selectedStudents.includes(student.id) && (
                              <Check className="w-4 h-4 text-white m-0.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setUiState(prev => ({ ...prev, showStudentModal: false }))}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                  >
                    Done ({formData.selectedStudents.length} selected)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.6s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-slide-in-up { animation: slide-in-up 0.5s ease-out; }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
        .animate-scale-in { animation: scale-in 0.4s ease-out; }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #6366f1);
          border-radius: 10px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #4f46e5);
        }
        
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};

export default HomeworkUploadPage;