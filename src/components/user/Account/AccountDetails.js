import React, { useEffect, useState } from 'react';
import userService from '../../../api/services/UserService';

const AccountDetails = ({file}) => {
  const [accountData, setAccountData] = useState(null); // Start with null to indicate loading state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(
      localStorage.getItem('profilePictureCache') ||
      'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  );

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const userId = userService.getUserId();
        const role = userService.getUserRole();
        const response = await userService.getUserProfileById(userId, userId, role);

        if (response && response.data) {
          const profileData = {
            firstName: response.data.firstName || '',
            lastName: response.data.lastName || '',
            email: response.data.email || '',
            contactNumber: response.data.contactNumber || '',
            houseNumber: response.data.houseNumber || '',
            addressLine1: response.data.addressLine1 || '',
            addressLine2: response.data.addressLine2 || '',
            postalCode: response.data.postalCode || '',
          };

          setAccountData(profileData);

          if (response.data.profilePicture) {
            setProfilePicturePreview(response.data.profilePicture);
            localStorage.setItem('profilePictureCache', response.data.profilePicture);
          }

          localStorage.setItem('userProfileCache', JSON.stringify({ userProfile: profileData }));
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (err) {
        console.error('Error fetching account data:', err);
        setError('Failed to load account details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccountData();
  }, []);

  const handleUpdateProfile = async () => {
    setIsUpdating(true);
    try {
      const userId = userService.getUserId();
      const formData = new FormData();
      const role = userService.getUserRole();
      formData.append('userProfileDetails', JSON.stringify(accountData));
      if (file) {
        formData.append('profilePicture', file); // Append the file
      }
      else{
        throw new Error(file.type +'Invalid File Type');
      }
      const response = await userService.updateUserProfile(userId, userId, role , formData);

      if (response) {
        const updatedData = {
          firstName: response.firstName || '',
          lastName: response.lastName || '',
          email: response.email || '',
          contactNumber: response.contactNumber || '',
          houseNumber: response.houseNumber || '',
          addressLine1: response.addressLine1 || '',
          addressLine2: response.addressLine2 || '',
          postalCode: response.postalCode || '',
        };

        setAccountData(updatedData);

        if (response.profilePicture) {
          setProfilePicturePreview(response.profilePicture);
          localStorage.setItem('profilePictureCache', response.profilePicture);
        }

        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update the profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
<div className="flex justify-center items-center h-screen">
    <p className="text-2xl text-purple-500 font-medium">Loading your details...</p>
</div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!accountData) {
    return <div className="text-gray-500">No account data available.</div>;
  }

  return (
      <div>
        <h2 className="text-xl font-bold mb-2">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600">First Name</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.firstName}
                onChange={(e) => setAccountData({...accountData, firstName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-600">Last Name</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.lastName}
                onChange={(e) => setAccountData({...accountData, lastName: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-600">Email Address</label>
            <input
                type="email"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.email}
                onChange={(e) => setAccountData({...accountData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-600">Contact Number</label>
            <input
                type="tel"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.contactNumber}
                onChange={(e) => setAccountData({...accountData, contactNumber: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-600">House Number</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.houseNumber}
                onChange={(e) => setAccountData({...accountData, houseNumber: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-600">Address Line 1</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.addressLine1}
                onChange={(e) => setAccountData({...accountData, addressLine1: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-600">Address Line 2</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.addressLine2}
                onChange={(e) => setAccountData({...accountData, addressLine2: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-gray-600">Postal Code</label>
            <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                value={accountData.postalCode}
                onChange={(e) => setAccountData({...accountData, postalCode: e.target.value})}
            />

          </div>
        </div>
        <br/>
        <div className="flex justify-center mt-3">
    {/* Center the button */}
    <button
      className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-dark transition w-auto"
      onClick={handleUpdateProfile}
      disabled={isUpdating}
    >
      {isUpdating ? 'Updating...' : 'Update Profile'}
    </button>
  </div>

      </div>
  );
};

export default AccountDetails;
