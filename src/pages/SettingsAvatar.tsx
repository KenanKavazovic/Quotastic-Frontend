import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ButtonST } from '../components/Common/ButtonST';
import { NavLink, useParams } from 'react-router-dom';
import '../assets/styles/settings.css'
import { User } from '../interfaces/User.interface';
import avatar from '../assets/images/Avatar.png'
import { useSelector } from 'react-redux';
import ImgST from '../components/Common/ImgST';


const SettingsAvatar = () => {
  
  const user = useSelector((state: any) => state?.user.value)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null)
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        await axios.post('/users/uploadAvatar', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.reload();
      } catch (error) {
        console.error('Error uploading avatar:', error);
        window.location.reload();
      }
    }
  };

  async function GetAvatar(userId?: string) {
    if (user?.avatar) {
      try {
        const response = await axios.get(`/users/avatar/${user.id}`, {
          responseType: 'blob',
        });
        if (response.status === 200) {
          const imageUrl = URL.createObjectURL(response.data);
          return imageUrl;
        } else {
          console.error('Failed to fetch avatar image.');
          return null;
        }
      } catch (error) {
        console.error('Error:', error);
        return null;
      }
    }
    return null;
  }

  const FetchAvatar = async () => {
    const imageUrl = await GetAvatar(user.id);
    setUserAvatar(imageUrl);    
    setLoading(false);
  }
  
  const uploadFile = () => {
    document.getElementById('avatarUpload')?.click()
  }

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setPreview(null)
    }
      FetchAvatar();
  }, [selectedFile])

  return (
    <div className='settings_container'>
      <div className='settings_header'>
          <p className='settings_header_black_text'>Profile</p>
          <p className='settings_header_orange_text'>settings.</p>
      </div>

      <div className='settings_subheader'>
          <p className='settings_info_text'>Change your profile photo</p>
      </div>

      <div className='settings_picture_upload'>
      {loading ? (
          <div>Loading...</div>
        ) :(
        <>
        <ImgST width='64px' className='settings_profile_picture' url={preview ? preview : userAvatar ? userAvatar : avatar} ></ImgST>
        <ButtonST sp='mobile_wide' content='Upload new image' onClick={uploadFile} width='172px' bg='#DE8667'  fg='#FFFFFF'/>
        <input id="avatarUpload" hidden type="file" name='file' accept=".png,.jpg,.jpeg" onChange={handleFileChange}/>
        </>
        )}
      </div>

      <div className='settings_buttons'>
        <ButtonST content='Submit' onClick={handleUpload} width='137px' bg='#DE8667'  fg='#FFFFFF'/>
        <NavLink to={"/settings"}><ButtonST content='Cancel' bg='#FFFFFF'/></NavLink>
      </div>
    </div>
  )
}

export default SettingsAvatar;
