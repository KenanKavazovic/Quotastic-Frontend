import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { ButtonST } from '../components/Common/ButtonST'
import { InputStyled } from '../components/Common/InputForm'
import { setUser } from '../interfaces/reducer/User.reducer'
import { PatchRequest } from '../services/PatchRequest.service'
import { ProfileSchema } from '../validation/schemas/Profile.schema'
import styled from 'styled-components'
import { setAutoFreeze } from 'immer';
import '../assets/styles/settings.css'
import '../assets/styles/popup.css'

const Settings = () => {

    setAutoFreeze(false);
    const [showSettingsConfirm, setShowSettingsConfirm] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector((state: any) => state?.user.value)
    const {register, handleSubmit, formState: {errors}} = useForm <{email: string, firstName: string, lastName: string}>({
        resolver: yupResolver(ProfileSchema)})

    const UpdateUser = handleSubmit(
        async (data, event)=> {
            event?.preventDefault()
            await PatchRequest(`users/${user.id}`,{email: data.email, firstName: data.firstName, lastName: data.lastName})
            await dispatch(setUser(data))
            setShowSettingsConfirm(true)
        }
    )
    
    const handleCloseConfirm = async () => {
        setShowSettingsConfirm(false)
        window.location.reload()
    }
    
    if (showSettingsConfirm) {
        return (
          <div className="popup_container" style={{zIndex:9999}}>
          <div className="popup_content">
            <h2 className="popup_header">Profile {<OrangeSpan>settings.</OrangeSpan>}</h2>
            <p className="popup_description">Your settings are saved.</p>
            <div className="popup_button_container">
              <button className="popup_submit_button" onClick={handleCloseConfirm}>Close</button>
            </div>
          </div>
        </div>
        )
      }

    return (
        <div className='settings_container'>
            <form onSubmit={UpdateUser}>
                <div className='settings_header'>
                    <p className='settings_header_black_text'>Profile</p>
                    <p className='settings_header_orange_text'>settings.</p>
                </div>

                <div className='settings_subheader'>
                    <p className='settings_info_text'>Change your profile settings</p>
                </div>

                <p className='settings_label_email'>Mail </p>
                <InputStyled value={user?.email}  register={register} name="email" type='email' width='536px'></InputStyled>
                <Message>{errors.email?.message}</Message>

                <div className='settings_labels'>
                    <p className='settings_label_firstname'>First Name</p>
                    <p className='settings_label_lastname'>Last Name</p>
                </div>

                <div className='settings_line_input'>
                    <InputStyled sp='mobile_small' value={user?.firstName} register={register} name="firstName" type='text' width='256.5px' />
                    <InputStyled sp='mobile_small' value={user?.lastName}  register={register} name="lastName" type='text' width='256.5px' />
                </div>
                <Message>{errors.firstName?.message}</Message>
                <MessageLn>{errors.lastName?.message}</MessageLn>

                <div className='settings_line_buttons'>
                <NavLink to='/changepassword'>
                    <ButtonST sp='mobile_wide' width='240px' content='Change password'  bg='#EFB467' fg='#FFF'/>
                </NavLink>
                <NavLink to='/changeprofilepicture'>
                    <ButtonST sp='mobile_wide' content='Change profile picture' bg='#DE8667' fg='#FFF' width=' 240px' />
                </NavLink>
                </div>
                
                <div className='settings_buttons'>
                    <ButtonST content='Submit' width='127px'  bg='#DE8667'  fg='#FFFFFF'/>
                    <NavLink to={"/"}><ButtonST content='Cancel' bg='#FFFFFF'/></NavLink>
                </div>
            </form>
        </div>
    )
}

const Message = styled.p`
    margin-top: 4px;
    margin-left: 24px;
    font-style: italic;
    font-size: 12px;
    color: #ef1102;
    @media screen and (max-width: 661px) {
        margin-left: 70px;
    }
`;
const MessageLn = styled.p`
    margin-top: -30px;
    margin-left: 24px;
    float: right;
    font-style: italic;
    font-size: 12px;
    color: #ef1102;
    @media screen and (max-width: 661px) {
        margin-left: 70px;
    }
`;
const OrangeSpan = styled.span`
  color: #de8667;
`;

export default Settings