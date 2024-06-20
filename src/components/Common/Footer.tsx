import "../../assets/styles/footer.css";
import quoteLogo from '../../assets/images/Logo icon.png';

const Footer = () => {
  return (
    <footer className='footer'>
      <div>
        <img src={quoteLogo} alt='qoute-logo' />
        <p>All Rights Reserved | skillupmentor.com</p>

      </div>
    </footer>
  )
}

export default Footer