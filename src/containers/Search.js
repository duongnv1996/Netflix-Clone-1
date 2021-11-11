import React, { Component } from 'react';

import Modal from '../components/UI/Modal';
import MovieDetails from '../components/Movie/MovieDetails';
import Movie from '../components/Movie/Movie';
import axios from '../api/axios-phimhd';

export default class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      movies: [],
      toggleModal: false,
      /** Holds the movie information for a single movie. */
      movieOverview: {},
    }
  }

  componentDidMount = async () => {
    console.log("componentDidMount")
    const { movieRows } = this.props.history.location;
    if (movieRows)
      await this.setState({ movies: movieRows });
  }

  componentDidUpdate = async (prevProps) => {
    console.log("componentDidUpdate",prevProps.location)
    if (
      prevProps.location.movieRows.length !==
      this.props.location.movieRows.length
    ) {
      await this.setState({ movies: this.props.location.movieRows });
    }
  }

  closeModal = () => {
    this.setState({ toggleModal: false });
  }
  onClickPlay = () => {
    this.props.history.push({
      pathname: '/detail',
      movieDetail: this.state.movieOverview
    });
  }
  /* Get the appropriate details for a specific movie that was clicked */
  selectMovieHandler = (movie) => {
    this.setState({ toggleModal: true });

    let url = `/api/phimhd/getDetailInfoMovie?urlDetail=${movie.urlDetail}&serverQuery=${process.env.SERVER_QUERY}&forceRefresh=true`;
    const movieId = movie.id;
    /** Make the appropriate API call to get the details for a single movie or tv show. */
    // if (movie.media_type === "movie") {
    //   url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=9d2bff12ed955c7f1f74b83187f188ae`;

    // } else if (movie.media_type === "tv") {
    //   url = `https://api.themoviedb.org/3/tv/${tvId}?api_key=9d2bff12ed955c7f1f74b83187f188ae`;
    // }
    

    axios.get(url)
      .then(res => {
        const movieData = res.data.data;
        movieData.title = movie.title
        movieData.urlDetail = movie.urlDetail
        movieData.urlPhoto = movie.urlPhoto
        movieData.status = movie.status
        this.setState({ movieOverview: movieData });
      }).catch(error => {
        console.log(error);
      });
  }

  render() {
    const { movies } = this.state
    const { userInput } = this.props.location

    return (
      <>
        {
          movies.length > 0 ? (
            <div className="search-container">
              {
                movies.map((movie) => {
                  let movieRows = []
                  
                  /** Set the movie object to our Movie component */
                  const movieComponent = <Movie
                  movieDetails={() => this.selectMovieHandler(movie)}
                  key={movie.title}
                  movieImage={movie.urlPhoto}
                  movie={movie} />

                /** Push our movie component to our movieRows array */
                  movieRows.push(movieComponent);
                  return movieRows
                })
              }
            </div>
          ) : (
              <div className="no-results">
                <div className="no-results__text">
                  <p>Your search for "{userInput}" did not have any matches.</p>
                  <p>Suggestions:</p>
                  <ul>
                    <li>Try different keywords</li>
                    <li>Looking for a movie or TV show?</li>
                    <li>Try using a movie, TV show title, an actor or director</li>
                    <li>Try a genre, like comedy, romance, sports, or drama</li>
                  </ul>
                </div>
              </div>
            )
        }
        <Modal Modal show={this.state.toggleModal}
          modalClosed={this.closeModal}
          movie={this.state.movieOverview} >
          <MovieDetails movie={this.state.movieOverview} onClickPlay={this.onClickPlay} />
        </Modal>
      </>
    );
  }
}
