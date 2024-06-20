import { User } from "../../interfaces/User.interface";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import orangeupvote from '../../assets/images/upvoteorange.png'
import orangedownvote from '../../assets/images/downvoteorange.png'
import editquote from '../../assets/images/edit-quote.png'
import deletequote from '../../assets/images/delete-quote.png'
import avatar from '../../assets/images/Avatar.png'
import ImgST from "../Common/ImgST";
import axios from "axios";
import React, { useEffect, useState } from "react";
import EditQuote from "./EditQuote";
import DeleteQuote from "./DeleteQuote";
import ReactDOM from "react-dom";
import "../../assets/styles/popup.css"

interface Props{
    text: string,
    author: string,
    karma: number,
    vote?: string,
    key?: number,
    user_id?: number,
    id: number,
    img?: string,
    auth?: boolean,
}

const FetchQuotes: React.FC<Props> = ({user_id, id, text, karma, author, vote}) => { 
    const [showEditQuote, setShowEditQuote] = useState(false);
    const [showDeleteQuote, setShowDeleteQuote] = useState(false);
    const [showUpvoteQuoteWarning, setShowUpvoteQuoteWarning] = useState(false);
    const [showDownvoteQuoteWarning, setShowDownvoteQuoteWarning] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [quoteuser,setQuoteUser]=  useState<User | null>()
    const [loading, setLoading] = useState(true)
    const user = useSelector((state: any) => state?.user.value)
    const containerElementDelete = document.getElementById("delete-quote-container");
    const containerElementEdit = document.getElementById("edit-quote-container");
    
      const GetUser = async() => {
        const res = await axios.get(`users/${user_id}`);
        setQuoteUser(res.data);
      }

      async function GetAvatar(userId?: number) {
        if (quoteuser?.avatar) {
          try {
            const response = await axios.get(`/users/avatar/${user_id}`, {
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
        const imageUrl = await GetAvatar(user_id);
        setUserAvatar(imageUrl);
        setLoading(false);
      }
      
      const Likequote = async (id:number) => {
        if(user_id === user.id){
          setShowUpvoteQuoteWarning(true)
        } else return axios.post(`votes/${id}/upvote`); 
      }

      const Dislikequote = async (id:number) => {
        if(user_id===user.id){
          setShowDownvoteQuoteWarning(true)
        } else return axios.post(`votes/${id}/downvote`);
      }
    
      const handleDeleteQuoteClick = () => {
        setShowDeleteQuote(true);
      };

      const handleCloseDeleteQuote = () => {
        setShowDeleteQuote(false);
      };

      const handleEditQuoteClick = () => {
        setShowEditQuote(true);
      };

      const handleCloseEditQuote = () => {
        setShowEditQuote(false);
      };

      const handleCloseUpvoteQuoteWarning = () => {
        setShowUpvoteQuoteWarning(false);
      };

      const handleCloseDownvoteQuoteWarning = () => {
        setShowDownvoteQuoteWarning(false);
      };

      useEffect(() => {
        if (user_id) {
          GetUser();
        }
      }, [user_id]);

      useEffect(() => {
        if (!userAvatar) {
          FetchAvatar();
        }
      }, [userAvatar, FetchAvatar]);
      
  return (
    <Card>
        <div>
            <Vote color={vote} className='vote' onClick={()=>Likequote(id)} src={orangeupvote} alt="upvote" />
            <p>{karma} </p>
            <Vote color={vote} className='vote' onClick={()=>Dislikequote(id)} src={orangedownvote} alt="downvote" />
        </div>
        <div>
            <div>
                <QuoteContent>{text}</QuoteContent>
                <p>{loading ? ( <>Loading...</> ) :( <> <ImgST width="40px" url={userAvatar ? userAvatar : avatar}/> <NavLink style={{color: 'black', display: 'inline'}} reloadDocument to={`/profile/${user_id}`}>{author}</NavLink> </> )}</p>
            </div>
        </div>

        { showUpvoteQuoteWarning ? 
          <div className="popup_container" style={{zIndex:9999}}>
            <div className="popup_content">
              <h2 className="popup_description">You can't upvote your own qoute.</h2>
              <div className="popup_button_container">
                <button className="popup_submit_button" onClick={handleCloseUpvoteQuoteWarning}>Close</button>
              </div>
            </div>
          </div>
        : <></>}

        { showDownvoteQuoteWarning ?
          <div className="popup_container" style={{zIndex:9999}}>
            <div className="popup_content">
              <h2 className="popup_description">You can't downvote your own qoute.</h2>
              <div className="popup_button_container">
                <button className="popup_submit_button" onClick={handleCloseDownvoteQuoteWarning}>Close</button>
              </div>
            </div>
          </div>
        : <></>}

        { user?.id === user_id ?
        <div>
            <NavLink to={'#'}><Vote color="edit" className='editquoteicon' onClick={handleEditQuoteClick} src={editquote} alt="edit" /></NavLink>
            <NavLink to={'#'}><Vote color="delete" className='deletequoteicon' onClick={handleDeleteQuoteClick} src={deletequote} alt="delete" /></NavLink>    

            {containerElementDelete ? (ReactDOM.createPortal(<DeleteQuote id={id} isOpen={showDeleteQuote} onClose={handleCloseDeleteQuote} />,containerElementDelete
      )) : ( <DeleteQuote id={id} isOpen={showDeleteQuote} onClose={handleCloseDeleteQuote} />)}

              {containerElementEdit ? (ReactDOM.createPortal(<EditQuote id={id} text={text} isOpen={showEditQuote} onClose={handleCloseEditQuote} />,containerElementEdit
      )) : ( <EditQuote id={id} text={text} isOpen={showEditQuote} onClose={handleCloseEditQuote} />)}

        </div> : <></>
        }
    </Card>
  )
}

const QuoteContent= styled.p`
font-style: normal;
font-weight: 400;
font-size: 16px;
line-height: 19px;
color: #000000;
`;
export const ThreeColumnGrid = styled.div`
  margin-top: 2.25rem;
  display: grid;
  align-items: start;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1.25rem;
  @media screen and (max-width: 661px) {
    grid-template-columns: 1fr;
    max-width: 83vw;
    margin-top: 0px;
  }
  @media screen and (min-width: 662px) and (max-width: 1120px) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr;
  }
`;
const Card = styled.div`
    display: flex;    
    flex-direction: row;
    align-self: stretch;
    gap: 21px;
    min-width: 420px;
    min-height: 123px;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    padding: 16px 32px 16px 16px;
    & div{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        & div {
            display: flex;
            align-items: baseline;
            gap: 5px;
            & :nth-child(2) {
                font-size: 12px;
            }
            & img, p{
                max-width: 323px;
                overflow-wrap: break-word;
                margin-right: 8px;
                vertical-align: middle;
            }
        }
    }
`;
const Vote = styled.img`
    filter: ${props => props.color === props.alt ? "brightness(100%)" : "brightness(0%)"};
    &:hover{
        filter: ${props => props.color === props.alt ? "brightness(0%)" : "brightness(100%)"};
    }
`;

export default FetchQuotes;
