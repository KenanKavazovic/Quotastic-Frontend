import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import FetchQuotes, { ThreeColumnGrid } from '../components/Quote/FetchQuotes'
import Group from '../assets/images/Group.png'
import axios from 'axios'
import { ButtonST } from '../components/Common/ButtonST'
import { useSelector } from 'react-redux'
import { NavLink, useLocation } from 'react-router-dom'
import { Quote } from '../interfaces/Quote.interface';
import "../assets/styles/landing-page.css";


const LandingPage = () => {

  const user = useSelector((state: any) => state?.user.value)
  const location = useLocation().pathname
  const [limit, updateLimit] = useState(9)
  const [recentlimit, updateRecentLimit] = useState(9)
  const [quotes, setQuotes] = useState([])
  const [recentquotes, setRecentQuotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [randomquote,setRandomQuote]=useState<Quote>({author:"",karma:0,text:"",id:0,user:null})

  useEffect(() => {
    GetQuotes();
    GetRecentQuotes();
    GetRandomQuote();
  }, [limit,recentlimit]);

  const GetQuotes = async () => {
    try {
      const res = await axios.get(`quotes/mostupvoted/?limit=${limit}`);
      setQuotes(res.data);
      setLoading(true);
    }
    catch (err) {
      console.log(err);
    }
  }

  const GetRecentQuotes = async () => {
    try {
      const res = await axios.get(`quotes/mostrecent?limit=${recentlimit}`);
      setRecentQuotes(res.data);
      setLoading(true);
    }
    catch (err) {
      console.log(err);
    }
  }

  const GetRandomQuote = async () => {
    try {
      const res = await axios.get('quotes/mostupvoted');

      setRandomQuote(res.data[Math.floor(Math.random() * res.data.length)]);
      setLoading(true);
    }
    catch (err) {
      console.log(err);
    }
  }

    const renderWelcome = () => {
        switch (location) {
            case "/":
                return (<>
                    <div className='welcome_container'>
                        <div className='welcome_content'>
                            <h1 className='welcome_text'>Welcome <br /> to <OrangeSpan>Quotastic</OrangeSpan></h1>
                            <p className='welcome_info'>Quotastic is a free online platform for you to explore the  quips, quotes, and proverbs. Sign up and express yourself.</p>
                            <NavLink to={'signup'}>
                                <ButtonST content='Sign up' width='100px' height='30px' border='#EFB467' bg='#DE8667' fg='#FFFFFF' />
                            </NavLink>
                        </div>
                        <div className='welcome_quotes'>
                            <img src={Group} alt="" className='group_image' />
                        </div>
                    </div>
                    <div className='welcome_motto'>
                            <p className='welcome_black_text'>Explore the world of </p>
                            <p className='welcome_orange_text'>fantastic quotes</p>
                    </div>
                    </>)
            default:
            return (<></>)
        }
    }

    const renderRandomQuote = () => {
        return (
            <div className='center'>
            <div className='orange_text_random_quote'>Quote of the day</div>
            <div className='black_text_random_quote'>Quote of the day is a randomly choosen quote.</div>
                <FetchQuotes key={randomquote?.id} user_id={randomquote.author.id} id={randomquote.id} text={randomquote?.text} author={randomquote?.author?.firstName+ ' '+ randomquote?.author?.lastName} karma={randomquote?.karma}  ></FetchQuotes>
           </div>
        )
    }

    const renderMostUpvotedQuoteGuest = () => {
      if (loading) {
        return quotes.map((quote: any) => (

        <FetchQuotes key={quote.id} user_id={quote.author.id} id={quote.id} text={quote.text} author={quote.author.firstName + ' ' + quote.author.lastName} karma={quote.karma}  ></FetchQuotes>
        ));
      }
    }

    const renderMostUpvotedQuoteUser = () => {
      if (loading && user) {
        return quotes.map((quote: any) => {
          const hasVotes = quote.votes.length > 0;
          const currentUserVoted = hasVotes && quote.votes.some((vote: any) => vote.user.id === user.id);
        
        if (currentUserVoted && quote.votes.some((vote: any) => vote.value)) {
          return (
            <FetchQuotes key={quote.id} vote='upvote' user_id={quote.author.id} id={quote.id} text={quote.text} author={quote.author.firstName + ' ' + quote.author.lastName} karma={quote.karma} />
          );
        } else if (currentUserVoted && quote.votes.every((vote: any) => !vote.value)) {
          return (
            <FetchQuotes key={quote.id} vote='downvote' user_id={quote.author.id} id={quote.id} text={quote.text} author={quote.author.firstName + ' ' + quote.author.lastName} karma={quote.karma} />
          );
        } else {
          return (
            <FetchQuotes key={quote.id} user_id={quote.author.id} id={quote.id} text={quote.text} author={quote.author.firstName + ' ' + quote.author.lastName} karma={quote.karma} />
          );
        }
      })}
    }

  return (
    !loading ? (<div></div>) :
    <Content>
    
    {user ? renderRandomQuote() : renderWelcome()}
      
    <div className='muvq_container'>
        <div className='header_muvq'>
            <p className='orange_text_muvq'>Most upvoted quotes</p>
        </div>
        <div className='subheader_muvq'>
          {user ? <p className='black_text_muvq'>Most upvoted quotes on the platform. Give an upvote to the ones you like to keep them saved in your profile.</p>
          :       <p className='black_text_muvq'>Most upvoted quotes on the platform. Sign up or login to like the quotes and keep them saved in your profile</p>}
        </div>
    </div>

      <ThreeColumnGrid>
      {user ? renderMostUpvotedQuoteUser() : renderMostUpvotedQuoteGuest()}
      </ThreeColumnGrid>

    {user ? <a onClick={()=>updateLimit(prevlimit=>prevlimit+3)} > <ButtonST sp='mobile_center' content='Load More' width='137px' border='#DE8667 1px solid' fg='#DE8667' bg='#FFFFFF' ></ButtonST></a>
    : <NavLink  to={'signup'} ><ButtonST sp='mobile_center' content='Sign up to see more' width='137px' border='#DE8667 1px solid' fg='#DE8667' bg='#FFFFFF' ></ButtonST></NavLink> }

    {loading && user ? <>
    <div className='muvq_container'>
      <div className='header_muvq'>
          <p className='orange_text_muvq'>Most recent quotes</p>
      </div>
      <div className='subheader_muvq'>
          <p className='black_text_muvq'>Recent quotes updates as soon as a user adds a new quote. Go ahead and show them that you've seen their new quote and upvote the ones you like.</p>
      </div>
    </div>

    <ThreeColumnGrid>
      {loading && recentquotes.map((recentquote: any) => {
           const hasVotes = recentquote.votes.length > 0;
           const currentUserVoted = hasVotes && recentquote.votes.some((vote: any) => vote.user.id === user.id);
           
           if (currentUserVoted && recentquote.votes.some((vote: any) => vote.value)) {
             return (
               <FetchQuotes key={recentquote.id} vote='upvote' user_id={recentquote.author.id} id={recentquote.id} text={recentquote.text} author={recentquote.author.firstName + ' ' + recentquote.author.lastName} karma={recentquote.karma} />
             );
           } else if (currentUserVoted && recentquote.votes.every((vote: any) => !vote.value)) {
             return (
               <FetchQuotes key={recentquote.id} vote='downvote' user_id={recentquote.author.id} id={recentquote.id} text={recentquote.text} author={recentquote.author.firstName + ' ' + recentquote.author.lastName} karma={recentquote.karma} />
             );
           } else {
             return (
               <FetchQuotes key={recentquote.id} user_id={recentquote.author.id} id={recentquote.id} text={recentquote.text} author={recentquote.author.firstName + ' ' + recentquote.author.lastName} karma={recentquote.karma} />
             );
           }
      })}
    </ThreeColumnGrid>

      {user ? <a onClick={()=>updateRecentLimit(prevlimit=>prevlimit+3)}> <ButtonST sp='mobile_center' content='Load More' width='137px'border='#DE8667 1px solid' fg='#DE8667' bg='#FFFFFF' ></ButtonST></a>
      : <NavLink  to={'signup'} ><ButtonST content='Sign Up' width='137px' border='#DE8667 1px solid' fg='#DE8667' bg='#FFFFFF' ></ButtonST></NavLink> }
      </> : <></>}
    </Content>
  )
}

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
`;
const OrangeSpan = styled.span`
  color: #de8667;
`;

export default LandingPage