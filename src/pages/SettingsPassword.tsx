import { yupResolver } from '@hookform/resolvers/yup'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { ButtonST } from '../components/Common/ButtonST'
import { InputStyled } from '../components/Common/InputForm'
import { PatchRequest } from '../services/PatchRequest.service'
import { PasswordSchema } from '../validation/schemas/PasswordSchema'
import { setUser } from '../interfaces/reducer/User.reducer'
import styled from 'styled-components'
import { setAutoFreeze } from 'immer';
import '../assets/styles/settings.css'
import '../assets/styles/popup.css'

const ChangePassword = () => {
    
  setAutoFreeze(false);
  const user = useSelector((state: any) => state?.user.value)
  const dispatch = useDispatch()
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [incorrectPasswordError, setIncorrectPasswordError] = useState(false);
  const [samePasswordError, setSamePasswordError] = useState(false);
  const {register, handleSubmit, formState: {errors}} = useForm<{current_password: string, password: string, confirm_password: string}>({
        resolver: yupResolver(PasswordSchema)
    })

  const ChangePassword = handleSubmit( async (data, event)=> {
      event?.preventDefault()
      try {
        await PatchRequest(`users/${user.id}`,{current_password: data.current_password, password:data.password, confirm_password: data.confirm_password})
        await dispatch(setUser(data))
        setShowPasswordConfirm(true)
      } catch (error: any) {
        const errorMessage = error.message
        errorMessageCheck(errorMessage)
      }
    }
  )

  const handleCloseConfirm = async () => {
      setShowPasswordConfirm(false)
      window.location.reload()
  }

  const errorMessageCheck = (errorMessage: string) => {
    if (errorMessage === 'The password you entered is incorrect.') {
      setIncorrectPasswordError(true)
      setSamePasswordError(false)
    } else if (errorMessage === 'New password cannot be the same as your old password.') {
      setIncorrectPasswordError(false)
      setSamePasswordError(true)
    } else {
      setIncorrectPasswordError(false)
      setSamePasswordError(false)
    }
  }

  if (showPasswordConfirm) {
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
      <form onSubmit={ChangePassword}>
        <div className='settings_header'>
          <p className='settings_header_black_text'>Profile</p>
          <p className='settings_header_orange_text'>settings.</p>
        </div>

        <div className='settings_subheader'>
          <p className='settings_info_text'>Change your password</p>
        </div>

        <p className='settings_label_password'>Current password </p>
        <InputStyled register={register} name="current_password" type='password' width='536px'></InputStyled>
        <Message>{errors.current_password?.message}</Message>
        {incorrectPasswordError && <Message>The password you entered is incorrect.</Message>}
        
        <p className='settings_label_password'>New password </p>
        <InputStyled register={register} name="password" type='password' width='536px'></InputStyled>
        <Message>{errors.password?.message}</Message>
        {samePasswordError && <Message>New password cannot be the same as your old password.</Message>}

        <p className='settings_label_password'>Confirm new password </p>
        <InputStyled register={register} name="confirm_password" type='password' width='536px'></InputStyled>
        <Message>{errors.confirm_password?.message}</Message>

        <div className='settings_buttons'>
          <ButtonST content='Submit' width='137px' bg='#DE8667'  fg='#FFFFFF'/>
          <NavLink to={"/settings"}><ButtonST content='Cancel' bg='#FFFFFF'/></NavLink>
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
const OrangeSpan = styled.span`
  color: #de8667;
`;

export default ChangePassword
