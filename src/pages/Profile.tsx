import axios from 'axios';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import ImgST from '../components/Common/ImgST';
import avatar from '../assets/images/Avatar.png'
import FetchQuotes, { ThreeColumnGrid } from '../components/Quote/FetchQuotes';
import { Content } from './LandingPage';
import { ButtonST } from '../components/Common/ButtonST';
import { useParams } from 'react-router-dom';
import { User } from '../interfaces/User.interface';
import { useSelector } from 'react-redux';

const Profile = () => {

    const user = useSelector((state: any) => state?.user.value)
    const user_id = useParams().user_id
    const [limit, updateLimit] = useState(9)
    const [quoteuser,setQuoteUser]=  useState<User | null>()
    const [loading, setLoading] = useState(true)
    const [upvotedquotes, setMostUpvotedQuotes] = useState([])
    const [votes, setUserVotes] = useState([])
    const [userquotes, setUserQuotes] = useState([])
    const [recentquotes, setMostRecentQuotes] = useState([])
    const [userkarma, setUserKarma] = useState([])
    const [userAvatar, setUserAvatar] = useState<string | null>(null);

  const GetMostRecentQuotes = async () => {
    try {
      const res = await axios.get(`quotes/mostrecent?limit=${limit}`);
      setMostRecentQuotes(res.data);
    }
    catch (err) {
      console.log(err);
    }
  }

  const GetMostUpvotedQuotes = async () => {
    try {
      const res = await axios.get(`quotes/mostupvoted?limit=${limit}`);
      setMostUpvotedQuotes(res.data);
    }
    catch (err) {
      console.log(err);
    }
  }
  
  const GetUser=async() => {
    const res = await axios.get(`users/${user_id}`);
     setQuoteUser(res.data);
  }
  
  const GetUserVotes=async() => {
    const res = await axios.get(`votes/user/${user_id}`);
     setUserVotes(res.data);
  }
  
  const GetUserQuotes=async() => {
    const res = await axios.get(`quotes/user/${user_id}`);
     setUserQuotes(res.data);
  }

  const GetUserKarma=async() => {
    const res = await axios.get(`quotes/user/karma/${user_id}`);
    setUserKarma(res.data);
  }

  async function GetAvatar(userId?: string) {
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

  useEffect(() => {
    GetMostRecentQuotes();
    GetMostUpvotedQuotes();
    GetUser();
    GetUserVotes();
    GetUserQuotes();
    GetUserKarma();
  }, [limit]);

  useEffect(() => {
    if (!userAvatar) {
      FetchAvatar();
    }
  }, [userAvatar, FetchAvatar]);

  return (
    <Content>
      <Orange />
      {loading ? ( <div>Loading...</div> ) :( <ImgDiv><ImgST width="64px" url={userAvatar ? userAvatar : avatar} /></ImgDiv> )}
      <Name>{quoteuser?.firstName} {quoteuser?.lastName}</Name>
      <ScoreGrid>
        <div>Quotes
          <p><OrangeText>{userquotes.length}</OrangeText></p>
        </div>
        <div>Quotastic Karma
          <p>{userkarma}</p>
        </div>
      </ScoreGrid>

      <ThreeColumnGrid>
        <CardGrid>
          <ListHeading><OrangeText>Most liked quotes</OrangeText></ListHeading>
          {upvotedquotes.map((q: any) => {
          if(q.author?.id === quoteuser?.id ) {
            const hasVotes = q.votes.length > 0;
            const currentUserVoted = hasVotes && q.votes.some((vote: any) => vote.user.id === user.id);
            
            if (currentUserVoted && q.votes.some((vote: any) => vote.value)) {
              return (
                <FetchQuotes key={q.id} vote='upvote' user_id={q.author.id} id={q.id} text={q.text} author={q.author.firstName + ' ' + q.author.lastName} karma={q.karma} />
              );
            } else if (currentUserVoted && q.votes.every((vote: any) => !vote.value)) {
              return (
                <FetchQuotes key={q.id} vote='downvote' user_id={q.author.id} id={q.id} text={q.text} author={q.author.firstName + ' ' + q.author.lastName} karma={q.karma} />
              );
            } else {
              return (
                <FetchQuotes key={q.id} user_id={q.author.id} id={q.id} text={q.text} author={q.author.firstName + ' ' + q.author.lastName} karma={q.karma} />
              );
            }
          }
          })}
        </CardGrid>

        <CardGrid>
          <ListHeading>Most recent</ListHeading>
          {recentquotes.map((q: any) => {
            if(q.author?.id === quoteuser?.id) {
              const hasVotes = q.votes.length > 0;
              const currentUserVoted = hasVotes && q.votes.some((vote: any) => vote.user.id === user.id);
              
              if (currentUserVoted && q.votes.some((vote: any) => vote.value)) {
                return (
                  <FetchQuotes key={q.id} vote='upvote' user_id={q.author.id} id={q.id} text={q.text} author={q.author.firstName + ' ' + q.author.lastName} karma={q.karma} />
                );
              } else if (currentUserVoted && q.votes.every((vote: any) => !vote.value)) {
                return (
                  <FetchQuotes key={q.id} vote='downvote' user_id={q.author.id} id={q.id} text={q.text} author={q.author.firstName + ' ' + q.author.lastName} karma={q.karma} />
                );
              } else {
                return (
                  <FetchQuotes key={q.id} user_id={q.author.id} id={q.id} text={q.text} author={q.author.firstName + ' ' + q.author.lastName} karma={q.karma} />
                );
              }
            }
          })}
        </CardGrid>

        <CardGrid>
          <ListHeading>Liked</ListHeading>
          {votes.map((v: any) => {
            if (v.value)
              return (
                <FetchQuotes user_id={v.quote?.author?.id} vote='upvote' id={v.quote?.id || 0} key={v.quote?.id || 0} author={`${v.quote?.author?.firstName + " " + v.quote?.author?.lastName}`} text={v.quote?.text || ""} karma={v.quote?.karma || 0} />
              )
          })}
        </CardGrid>

      </ThreeColumnGrid>
      <a onClick={()=> updateLimit(prevlimit => prevlimit+3)}> <ButtonST sp='mobile_center' content='Load More' width='137px' border='#DE8667 1px solid' fg='#DE8667' bg='#FFFFFF'></ButtonST></a>
    </Content>
  )
};

const ListHeading = styled.p`
    font-size: 24px;
    margin: 20px;
    @media (max-width: 662px) {
      color: #DE8667;
    }
`;
const OrangeText = styled.span`
    color: #DE8667;
`;
const Name = styled.p`
    color: #fff;
    font-style: normal;
    font-weight: 350;
    letter-spacing: 0.25px;
    line-height: 41px;
    font-size: 35px !important;
    margin: 0px;
    @media (max-width: 662px) {
      margin-left: 120px;
    }
`;
const ScoreGrid = styled.div`
    width: 315px;
    height: 83px;
    border-radius: 16px;
    background-color: #fff;
    box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.15);
    display: grid;
    grid-template-columns: 1fr 1fr;
    & div{
        padding-top:10px;
        font-style: normal;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;
        color: #322D38;
        gap: 8px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        & p {
            margin-top: -2px;
            font-size: 24px;
            font-weight: 300;
        }
    }
    @media (max-width: 662px) {
      margin-left: 120px;
    }
`;
const CardGrid = styled.div`
  display: grid;
  gap: 1rem;
`;
const Orange = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 414.5px;
    background-color: #DE8667;
    z-index: -1;
    @media (max-width: 662px) {
      width: 131.5%;
    }
`;
const ImgDiv = styled.div`
    margin-top: 100px;
    @media (max-width: 662px) {
      margin-left: 120px;
    }
`;
export default Profile