import { NavLink, useLocation } from 'react-router-dom';
import { ButtonST } from './ButtonST';
import { useSelector, useDispatch } from 'react-redux';
import { unsetUser } from '../../interfaces/reducer/User.reducer';
import { PostRequest } from '../../services/PostRequest.service';
import { useEffect, useState } from 'react';
import avatar from '../../assets/images/Avatar.png';
import logo from '../../assets/images/logo.png';
import logoAlt from '../../assets/images/logo-alt.png';
import bi_plus from '../../assets/images/bi_plus.svg';
import CreateQuote from '../Quote/CreateQuote';
import styled from 'styled-components';
import ReactDOM from 'react-dom';
import ImgST from './ImgST';
import axios from 'axios';
import "../../assets/styles/navbar.css";

const Navbar = () => {
  const user = useSelector((state: any) => state?.user.value)
  const dispatch = useDispatch()
  const location = useLocation().pathname
  const [showCreateQuote, setShowCreateQuote] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const containerElement = document.getElementById("create-quote-container")
  const isProfilePage = location.startsWith('/profile/')

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
  }

  const Logout= async  () => {
    await PostRequest('auth/signout')
    await setUserAvatar(null)
    dispatch(unsetUser())
  }

  const handleCreateQuoteClick = () => {
    setShowCreateQuote(true)
  }

  const handleCloseCreateQuote = () => {
    setShowCreateQuote(false)
  }
  
  useEffect(() => {
    if (user && !userAvatar) {
      FetchAvatar();
    }
  }, [userAvatar, FetchAvatar]);

  const authBtns = () =>
    <AnchorContainer>
      <div><NavLink to={'/'}>
           { isProfilePage ? <ProfilePageLink>Home</ProfilePageLink> : <Links>Home</Links>}
           </NavLink>
      </div>

      <div><NavLink to={'settings'}>
      { isProfilePage ? <ProfilePageLink>Settings</ProfilePageLink> : <Links>Settings</Links>}
          </NavLink>
      </div>

      <div><NavLink onClick={() => { Logout()}}  to={'login'}>
      { isProfilePage ? <ProfilePageLink>Logout</ProfilePageLink> : <Links>Logout</Links>}
           </NavLink>
      </div>

      <div><NavLink reloadDocument to={`/profile/${user.id}`}>
           <Links style={{marginLeft: '32px'}}><ImgST url={userAvatar ? userAvatar : avatar} width="40px"></ImgST></Links>
           </NavLink>
      </div>

      <div><NavLink to={'#'} onClick={handleCreateQuoteClick}>
           <img src={bi_plus} alt="" style={{marginLeft: '16px'}} />
           </NavLink>
           {containerElement ? (ReactDOM.createPortal(<CreateQuote isOpen={showCreateQuote} onClose={handleCloseCreateQuote} />,containerElement
      )) : (<CreateQuote isOpen={false} onClose={handleCloseCreateQuote} />)}
      </div>
    </AnchorContainer>
    
  const renderButtons= () => {
    switch(location){
      case "/signup":
        return (
          <AnchorContainer>
            <div>
              <NavLink to={'login'}>
                <ButtonST content='Login' width='100px' height='30px' border='#DE8667 1px solid' fg='#DE8667' bg='#FFFFFF' />
              </NavLink>
            </div>
        </AnchorContainer>
        )

      case "/login":
        return (<AnchorContainer>
            <div>
              <NavLink to={'signup'}>
                <ButtonST content='Sign up' width='100px' height='30px' border='#EFB467' bg='#DE8667' fg='#FFFFFF' />
              </NavLink>
            </div>
          </AnchorContainer>
        )

      default:
        return (
          <AnchorContainer>
           <div>
            <NavLink to={'signup'}>
              <ButtonST content='Sign up' width='100px' height='30px' border='#EFB467' bg='#DE8667' fg='#FFFFFF' />
            </NavLink>
            <NavLink to={'login'}>
              <ButtonST content='Login' width='100px' height='30px' border='#DE8667 1px solid' fg='#DE8667' bg='#FFFFFF' />
            </NavLink>
           </div>
          </AnchorContainer>
        )  
      }
    }

  return (
    <nav className='navbar'>
      <div>
        {isProfilePage ? 
          <div className='logo'><NavLink to={'/'}><img src={logoAlt} alt='logoAlt' /></NavLink></div>
        : <div className='logo'><NavLink to={'/'}><img src={logo} alt='logo' /></NavLink></div>
        }
        {user ? authBtns() : renderButtons()}
      </div>
    </nav>
  )
}

const AnchorContainer = styled.div`
  & div{
    display: flex;
    flex-direction: row;
    gap: 20px;
  }
  width: auto !important;
`;
const Links = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-decoration: none;
    text-align: center;
    margin-left: 24px;
    color: #DE8667;
`;
const ProfilePageLink = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    text-decoration: none;
    text-align: center;
    margin-left: 24px;
    color: #FFFFFF;
`;

export default Navbar