import axios from 'axios';
import { useState } from 'react';
import styled from 'styled-components';
import "../../assets/styles/popup.css";

interface DeleteQuoteProps {
  id: number
  isOpen: boolean
  onClose: () => void
}

const DeleteQuote: React.FC<DeleteQuoteProps> = ({ id, isOpen, onClose }) => {
  
    const [showDeleteQuoteConfirm, setShowDeleteQuoteConfirm] = useState(false)

    const handleDelete = async () => {
        await axios.delete(`quotes/${id}`)
        onClose()
        setShowDeleteQuoteConfirm(true)
    }

    const handleClosePopup = async () => {
        onClose()
    }

    const handleCloseConfirm = async () => {
        setShowDeleteQuoteConfirm(false)
        window.location.reload()
    }

    if (showDeleteQuoteConfirm) {
      return (
      <div className="popup_container">
        <div className="popup_content">
          <h2 className="popup_header_2">Your {<OrangeSpan>quote</OrangeSpan>} was deleted.</h2>
          <div style={{justifyContent: 'center'}} className="popup_button_container">
            <button className="popup_submit_button" onClick={handleCloseConfirm}>Close</button>
          </div>
        </div>
      </div>
      )
    }

    if (!isOpen) {
      return null
    }

  return (
    <div className="popup_container">
    <div className="popup_content">
      <h2 className="popup_header">Are you sure?</h2>
      <p className="popup_description">This quote will be deleted. There is no undo of this action.</p>
      <div className="popup_button_container">
        <button className="popup_submit_button" onClick={handleDelete}>Delete</button>
        <button className="popup_cancel_button" onClick={handleClosePopup}>Cancel</button>
      </div>
    </div>
  </div>
  )
}

const OrangeSpan = styled.span`
  color: #de8667;
`;

export default DeleteQuote;
