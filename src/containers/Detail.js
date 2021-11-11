import React, { Component } from 'react';

import Modal from '../components/UI/Modal';
import MovieDetails from '../components/Movie/MovieDetails';
import Movie from '../components/Movie/Movie';
import axios from '../api/axios-phimhd';
import ReactDOM from 'react-dom';
import ReactJWPlayer from 'react-jw-player';
import ReactJWPlayerContainer from '../components/ReactJWPlayer';
import Player from './playerHLS.js'
import VideoPlayer from 'react-video-js-player';
export default class Detail extends Component {
  player = {}
  
  constructor(props) {
    super(props)
    // const playlist = [{
    //   file: 'https://bitvtom100.xyz/hls/11c0e28b8182d4284089a0dc7b4e3b0e/playlist.m3u8',
    //   image: 'https://miro.medium.com/max/2625/1*NFLGOjswzul9L5M9vpGnYg.jpeg',
    //   // tracks: [{
    //   //   file: 'https://link-to-subtitles.vtt',
    //   //   label: 'English',
    //   //   kind: 'captions',
    //   //   'default': true
    //   // }],
    // }
    //   // {
    //   //   file: 'https://link-to-my-other-video.mp4',
    //   //   image: 'https://link-to-my-other-poster.jpg',
    //   // }
    // ];

    this.state = {
      movie: {},
      toggleModal: false,
      /** Holds the movie information for a single movie. */
      playlist: null,
      height: props.height,
      dataEp: null,
      dataStream: null,
      server: null,
      video: {
        src: "https://dash.megacdn.xyz/raw/594fb1abbef75d365ca490521b5260b2/index.m3u8",
        poster: "https://mondaycareer.com/wp-content/uploads/2020/11/background-%C4%91%E1%BA%B9p-3-1.jpg"
      }
    }
  }
  onPlayerReady(player) {
    console.log("Player is ready: ", player);
    this.player = player;
  }

  onVideoPlay(duration) {
    console.log("Video played at: ", duration);
  }

  onVideoPause(duration) {
    console.log("Video paused at: ", duration);
  }

  onVideoTimeUpdate(duration) {
    console.log("Time updated: ", duration);
  }

  onVideoSeeking(duration) {
    console.log("Video seeking: ", duration);
  }

  onVideoSeeked(from, to) {
    console.log(`Video seeked from ${from} to ${to}`);
  }

  onVideoEnd() {
    console.log("Video ended");
  }

  getLinkStreamByEp = async (tokenIndexEpisode, idEpisode, idFilm) => {
    let urlGetStream = `/api/phimhd/getLinkStream?token=${tokenIndexEpisode}&idEpisode=${idEpisode}&idFilm=${idFilm}&serverQuery=${process.env.SERVER_QUERY}}`;
    let resStream = await axios.get(urlGetStream)
    let dataStream = resStream.data.data
    let urlPlaylist = null
    let server = null
    for (let index = 0; index < dataStream.length; index++) {
      const server = dataStream[index];
      if (server.urlPlaylistHls) {
        urlPlaylist = server.urlPlaylistHls
        server = server
        break
      }
    }
    let playlist = this.state.playlist
    if (urlPlaylist) {
      playlist = urlPlaylist
    }
    console.log("Server = ", server + " - " + playlist)
    await this.setState({
      ...this.state,
      playlist: playlist,
      dataStream: dataStream,
      server: server
    });
  }
  getListEpisode = async (urlEpisode) => {
    let urlListEp = `/api/phimhd/getListEpisode?urlOther=${urlEpisode}&serverQuery=${process.env.SERVER_QUERY}&forceRefresh=true`;
    console.log(urlListEp)
    let resEp = await axios.get(urlListEp)
    let dataEp = resEp.data.data
    await this.setState({
      ...this.state,
      dataEp: dataEp,
    });
    console.log(dataEp)
    return dataEp
  }

  onClickEpisode = async (episode) => {
    await this.setState({
      ...this.state,
      playlist: null
    });
    let dateEp = await this.getListEpisode(episode.urlEp)
    await this.getLinkStreamByEp(dateEp.tokenIndexEpisode, dateEp.idEpisode, dateEp.idFilm)
  }
  componentDidMount = async () => {
    console.log("componentDidMount")
    const { movieDetail } = this.props.history.location;
    if (movieDetail) {
      await this.setState({
        ...this.state,
        movie: movieDetail
      });
      let dateEp = await this.getListEpisode(movieDetail.other)
      await this.getLinkStreamByEp(dateEp.tokenIndexEpisode, dateEp.idEpisode, dateEp.idFilm)
    }

  }

  componentDidUpdate = async (prevProps) => {
    console.log("componentDidUpdate", this.state)
    if (
      prevProps.location.movieDetail
    ) {
      await this.setState({ movies: this.props.location.movieDetail });
    }
  }

  closeModal = () => {
    this.setState({ toggleModal: false });
  }

  /* Get the appropriate details for a specific movie that was clicked */
  selectMovieHandler = (movie) => {
    this.setState({ toggleModal: true });

    let url = `/api/phimhd/getDetailInfoMovie?urlDetail=${movie.urlDetail}&serverQuery=${process.env.SERVER_QUERY}&forceRefresh=true`;
    const movieId = movie.id;
    /** Make the appropriate API call to get the details for a single movie or tv show. */
    // if (movie.media_type === "movie") {
    //   url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.API_KEY}`;

    // } else if (movie.media_type === "tv") {
    //   url = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${process.env.API_KEY}`;
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
    const { movie } = this.state
    const { userInput } = this.props.location
    // console.log("HEIGHT ", this.state.server)
    //https://anime47.com/ads/player/v/8.8.2/jwplayer.js?v=9  
    return (
      <div >
        <div className="player" >
          <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
          <Player id="video"></Player>
         
        </div>
        <div>

        </div>
        <div className="no-results" >

          <div className="no-results__text">
            <h1>
              {movie.title}
            </h1>
            {this.state.dataEp ?
              <div>
                {
                  this.state.dataEp.listGroupEpisode.map((groupEp) => {
                    return <div>
                      <p className="groupEpisode">{groupEp.titleGroup}</p>
                      <div>
                        {
                          groupEp.episodeList.map((ep) => {
                            return <a className="episode" onClick={() => this.onClickEpisode(ep)}>{ep.name}</a>
                          })
                        }
                      </div>

                    </div>
                  })
                }
              </div>

              : null}


          </div>
        </div>
      </div>

    )
  }
}
