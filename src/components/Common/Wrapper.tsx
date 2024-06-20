import React from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import Container from './Containter';

interface Props{
    children: React.ReactNode
}

const Wrapper = (props: Props) => {
  return (
    <>
    <Navbar/>
    <Container>{props.children}
    <div id="create-quote-container"></div>
    <div id="delete-quote-container"></div>
    <div id="edit-quote-container"></div>
    </Container>
    <Footer/>
    </>
  )
}

export default Wrapper