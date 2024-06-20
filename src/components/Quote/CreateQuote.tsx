import React, { useState } from "react";
import { PostRequest } from "../../services/PostRequest.service";
import "../../assets/styles/popup.css";
import styled from "styled-components";

interface CreateQuoteProps {
  isOpen: boolean
  onClose: () => void
}

const CreateQuote: React.FC<CreateQuoteProps> = ({ isOpen, onClose }) => {

  const [quote, setQuote] = useState("")

  const handleSubmit = async () => {
    await PostRequest("quotes/me/myquote", {text: quote})
    setQuote("");
    window.location.reload();
    onClose();
  }

  const handleCancel = () => {
    setQuote("");
    onClose();
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup_container">
      <div className="popup_quote_content">
        <h2 className="popup_header">Are you feeling {<OrangeSpan>inspired?</OrangeSpan>}</h2>
        <p className="popup_description">You can post quotes. You can delete them on your profile.</p>
        <textarea className="popup_input" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Enter your quote here..."></textarea>
        <div className="popup_button_container">
          <button className="popup_submit_button" onClick={handleSubmit}>Submit</button>
          <button className="popup_cancel_button" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

const OrangeSpan = styled.span`
  color: #de8667;
`;

export default CreateQuote;
