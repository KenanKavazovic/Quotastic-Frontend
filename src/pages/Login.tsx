import { useEffect, useState } from 'react';
import { InputStyled } from '../components/Common/InputForm';
import { ButtonST } from '../components/Common/ButtonST';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { LoginSchema } from '../validation/schemas/Login.schema';
import { PostRequest } from '../services/PostRequest.service';
import { Navigate } from 'react-router-dom';
import { setUser } from '../interfaces/reducer/User.reducer';
import { GetMe } from '../services/Me.service';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import '../assets/styles/login.css'

function Login(){
    const [message, setMessage] = useState(" ")
    const [redirect,setRedirect] = useState(false)
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors}} = useForm<{email: string, password: string}>({
        resolver: yupResolver(LoginSchema)
    })
    
  const submit = handleSubmit(async (data, event) => {
    event?.preventDefault()
    const response = await PostRequest("auth/login",data)
    await setMessage(response.response?.data?.message || "")
  })

  useEffect(() => {
    if(!message.length) {
      (async() => {
        const {data} = await GetMe()
        dispatch(setUser(data))
      })()
      setRedirect(true)
    }
  }, [message])
   
return (
    redirect ? <Navigate to = {"/"}/> :
      <div className='login_container'>
        <form onSubmit={submit}>
            <div className='login_header'>
              <p className='login_header_black_text'>Welcome</p>
              <p className='login_header_orange_text'>back!</p>
            </div>

            <div className='login_subheader'>
              <p className='login_info_text'>Thank you for coming back. Hope you have a good day and inspire others.</p>
            </div>
          
            <label className='login_label_email' >Email</label><br />
            <InputStyled type='email' register={register} name="email" width='420px' />
            <Message>{errors.email?.message}</Message>
           
            <label className='login_label_password' >Password</label><br />
            <InputStyled name="password" register={register} type='password'/>
            <Message>{errors.password?.message}</Message>
            
            <button className='login_submit_button' type='submit'>Login</button>
            <Message>{message }</Message>

            <div className='login_no_account'>
              <p>Don't have an account? <a className='login_link_signup' href="/signup">Sign up</a></p>
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

export default Login;


