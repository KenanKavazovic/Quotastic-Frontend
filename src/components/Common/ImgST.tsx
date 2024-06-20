import React from 'react';
import styled from 'styled-components';

const Img: React.FC<{className?: string, url:string, width:string}> = ({className, url, width}) => {
  return (
      <img className={className} src={url} width={width}/>
  )
}

export const ImgST = styled(Img)`
    width: ${props => props.width};
    height: ${props => props.width};
    object-fit: cover;
    border-radius: 50px;
    filter: drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.15));
`;

export default ImgST