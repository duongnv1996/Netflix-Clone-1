import React from 'react';

import Aux from '../../hoc/Aux';
import Backdrop from './Backdrop';

export default function Modal(props) {
  const backgroundStyle = {
    backgroundSize: 'cover',
    backgroundImage: `url(${props.movie.urlBackdrop })`
    ,
  };
  console.log("Modal DETAIL : ",props.movie.urlBackdrop )
  return (
    
    <Aux>
      <Backdrop show={props.show} toggleBackdrop={props.modalClosed} />
      <div
        style={backgroundStyle}
        className={props.show ? 'modal show' : 'modal hide'}
      >
        {props.children}
      </div>
    </Aux>
  );
}
