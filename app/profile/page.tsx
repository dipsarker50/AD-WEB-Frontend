'use client'
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/lib/axios';
import { AgentInterface, PatchAgentInterface } from '@/interfaces/agent';
import { verifyAuthCSR } from '@/lib/authCSR';



export default function ProfilePage(){
  const router = useRouter();
  const [id, setId] = useState(0);
  const [profile, setProfile] = useState<AgentInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [agentId, setAgentId] = useState<string | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [formData, setFormData] = useState<PatchAgentInterface>({
    fullName: '',
    phone: '',
    address: '',
    experience: '',
    bio: '',
  
  });




  useEffect(() => {
       getAgentId().then((storedId) => {
        if (storedId) {
          setId(storedId);
          fetchProfile(storedId);
        }
      });
  }, []);

    const getAgentId = async () => {
      try {
        setAuthChecking(true);
        const response = await verifyAuthCSR();
        if (!response || !response.authenticated) {
          router.push('/signin');
          return ;
        }
        
        if (!response.agentId) {
          setTimeout(() => router.push('/signin'), 2000);
          return;
        }
        
        setAgentId(response.agentId);
        return response.agentId;

        
      } catch (error) {
        setError('Authentication failed');
        setTimeout(() => router.push('/signin'), 2000);
      } finally {
        setAuthChecking(false);
      }
    };

  const fetchProfile = async (agentId: number) => {
    try {
      const response = await axiosInstance.get(`/agent/getagentby?field=id&data=${agentId}`);
      const profileData = response.data[0];
              console.log('Fetching profile for agentId:', profileData);

      setProfile(profileData);
      
      // Initialize form with current data
      setFormData({
        fullName: profileData.fullName || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        experience: profileData.experience || '',
        bio: profileData.bio || '',
      });
    } catch (error: any) {
      setError('Failed to load profile');
      console.error('Profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
        console.log('Updating profile with data:', formData);
      await axiosInstance.patch(`/agent/updateagent?id=${id}`, formData);
      setSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile(id); 
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile data
    if (profile) {
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        experience: profile.experience || '',
        bio: profile.bio || '',
      });
    }
    setEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load profile</p>
          <button 
            onClick={() => fetchProfile(id)}
            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </p>
          </div>
        )}

        {/* Profile Content */}
        <div className="bg-white rounded-lg shadow-md">
          
          {/* Profile Header with Avatar */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 p-8 rounded-t-lg">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                <span className="text-4xl font-bold text-green-600">
                  {profile.fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <p className="text-green-100">{profile.email}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.isEmailVerified 
                      ? 'bg-green-500 text-white' 
                      : 'bg-yellow-500 text-white'
                  }`}>
                    {profile.isEmailVerified ? '✓ Verified' : '! Not Verified'}
                  </span>
                  <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                    {profile.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.fullName}</p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-gray-900 font-medium">{profile.email}</p>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {editing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.phone}</p>
                )}
              </div>

              {/* Age (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <p className="text-gray-900 font-medium">{profile.age} years</p>
              </div>

              {/* NID (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NID Number
                </label>
                <p className="text-gray-900 font-medium">{profile.nidNumber}</p>
                <p className="text-xs text-gray-500 mt-1">NID cannot be changed</p>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 years"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.experience || 'Not specified'}</p>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profile.address}</p>
                )}
              </div>

              {/* Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {editing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  />
                ) : (
                  <p className="text-gray-900">{profile.bio || 'No bio added yet'}</p>
                )}
              </div>
            </div>

            {/* Action Buttons (Edit Mode) */}
            {editing && (
              <div className="mt-8 flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
}
