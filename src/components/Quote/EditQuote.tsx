import React, { ChangeEvent, useState } from 'react';
import styled from 'styled-components';
import { PatchRequest } from '../../services/PatchRequest.service';
import "../../assets/styles/popup.css";

interface EditQuoteProps {
  id: number
  text: string
  isOpen: boolean
  onClose: () => void
}

const EditQuote: React.FC<EditQuoteProps> = ({ id, text, isOpen, onClose }) => {

    const [quoteText, setQuoteText] = useState(text)
    const [showEditQuoteConfirm, setShowEditQuoteConfirm] = useState(false)

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setQuoteText(event.target.value)
    }

    const handleSubmit = async () => {
        await PatchRequest(`quotes/me/myquote/${id}`, {text: quoteText})
        onClose()
        setShowEditQuoteConfirm(true)
    }
    
    const handleClosePopup = async () => {
      onClose()
    }
    
    const handleCloseConfirm = async () => {
      setShowEditQuoteConfirm(false)
      window.location.reload()
    }

    if (showEditQuoteConfirm) {
      return (
        <div className="popup_container">
        <div className="popup_content">
          <h2 className="popup_header_2">Your {<OrangeSpan>quote</OrangeSpan>} was edited.</h2>
          <div style={{justifyContent: 'center'}} className="popup_button_container">
            <button className="popup_submit_button" onClick={handleCloseConfirm}>Close</button>
          </div>
        </div>
      </div>
      )
    }

    if (!isOpen) {
      return null;
    }

      return (
        <div className="popup_container">
        <div  className="popup_quote_content_2">
          <h2 className="popup_header_3">Edit your {<OrangeSpan>quote</OrangeSpan>}</h2>
          <textarea className="popup_input" defaultValue={text} onChange={handleInputChange}></textarea>
          <div className="popup_button_container">
            <button className="popup_submit_button" onClick={handleSubmit}>Submit</button>
            <button className="popup_cancel_button" onClick={handleClosePopup}>Cancel</button>
          </div>
        </div>
      </div>
      )
    }

const OrangeSpan = styled.span`
  color: #de8667;
`;

export default EditQuote;
