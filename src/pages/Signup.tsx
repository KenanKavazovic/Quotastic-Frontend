import React, { useEffect, useState } from 'react';
import { InputStyled } from '../components/Common/InputForm';
import '../assets/styles/signup.css'
import avatar from '../assets/images/Avatar.png'
import { ButtonST } from '../components/Common/ButtonST';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup'
import { RegisterSchema } from '../validation/schemas/Register.schema';
import styled from 'styled-components';
import { PostRequest } from '../services/PostRequest.service';
import { Navigate } from 'react-router-dom';

function Signup() {
    const [message, setMessage] = useState(" ")
    const [redirect,setRedirect] = useState(false)
    const {register,handleSubmit,formState: {errors}} = useForm <{email: string, password: string, confirm_password: string,firstName: string, lastName: string}>({
        resolver: yupResolver(RegisterSchema)
    })
    
    const Submit= handleSubmit(
        async (data,event)=> {
            event?.preventDefault()
            const response=await PostRequest("auth/signup",data)
            await setMessage(response.response?.data?.message || "")
        }
    )

    useEffect(()=>{
        if (!message.length) setRedirect(true)
    },[message])

    return (
        redirect ? <Navigate to = {"/"}/> :
        <div className='signup_container'>
            <form onSubmit={ Submit }>
                <div className='signup_header'>
                    <p className='signup_header_black_text'>What is your</p>
                    <p className='signup_header_orange_text'>name?</p>
                </div>

                <div className='signup_subheader'>
                    <p className='signup_info_text'>Your name will appear on quotes and your public profile.</p>
                </div>

                <div className='avatar_container'>
                     <img  src={avatar} alt="" />
                </div>
                
                <label className='signup_label_email' >Email</label><br />
                <InputStyled register={register} name="email" type='email' width='367px' />
                <Message>{errors.email?.message}</Message>

                <div className='signup_labels'>
                    <p className='signup_label_firstname'  >First Name</p> 
                    <p className='signup_label_lastname' >Last Name</p> 
                </div>

                <div className='line_input'>
                    <InputStyled sp='mobile_small' register={register} name="firstName" type='text' width='150px' />
                    
                    <InputStyled sp='mobile_small' register={register} name="lastName" type='text' width=' 150px' />
                </div>
                <Message>{errors.firstName?.message}</Message>
                <MessageLn>{errors.lastName?.message}</MessageLn>

                <label className='signup_label_password' >Password</label><br />
                <InputStyled register={register} name="password" type='password' width='367px' />
                <Message>{errors.password?.message}</Message>

                <label className='signup_label_confirm_password' >Confirm Password</label><br />
                <InputStyled register={register} name="confirm_password" type='password' width='367px' />
                <Message>{errors.confirm_password && "Passwords should match"}</Message>

                <button className='signup_submit_button' type='submit'>Sign up</button>
                <Message>{message }</Message>

                <div className='signup_existing_account'>
                    <p>Already have an account? <a className='login_link_signup' href="/login">Sign in</a></p>
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

export default Signup;