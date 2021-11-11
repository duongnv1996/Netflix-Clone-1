import React from 'react';

import Aux from '../../hoc/Aux';
import AddIcon from '../../static/images/add.svg';
import PlayIcon from '../../static/images/play-button.svg';

export default function MovieDetails(props) {
  console.log("MOVIE DETAIL : ",props.movie)
  return (
    
    <Aux>
      <div className="modal__container">
        <h1 className="modal__title">
          {props.movie.title }
        </h1>
        <h3 className="modal__info">
          { props.movie.realName}
        </h3>
        <p className="modal__info">
          <span className="modal__rating">
            {props.movie.rate}{'/10 '}
          </span>
          • {' '}
         {props.movie.year }{' '}
          •
          {' '}{props.movie.duration }
      
          {props.movie.country
            ? ' ' + props.movie.country
            : ' '}
            •
          {props.movie.category +' '
            ? ' ' + props.movie.category
            : ' '}
        </p>
        {props.movie.description ?
        <p className="modal__overview" >{props.movie.description.length > 600 ? props.movie.description.substring(0,600)+"..." : props.movie.description}</p>
        : null
      }
        <button className="modal__btn modal__btn--red" onClick={props.onClickPlay}>
          <PlayIcon className="modal__btn--icon" />
          Play
        </button>
        <button className="modal__btn">
          <AddIcon className="modal__btn--icon" />
          My List
        </button>
      </div>
    </Aux>
  );
}
