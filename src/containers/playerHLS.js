import React, { Component } from "react";
import Hls from "hls.js";

class Player extends Component {
    state = {};

    componentDidMount() {
        if (Hls.isSupported() && this.player) {
            const video = this.player;
            var config = {
                xhrSetup: function (xhr, url) {
                    xhr.withCredentials = true; // do send cookies
                },
            };
            const hls = new Hls(config);
            // hls.config = {
            //     // autoStartLoad: false,
            //     enableWebVTT: true,
            //     enableCEA708Captions: true,
            //     captionsTextTrack1Label: 'English',
            //     captionsTextTrack1LanguageCode: 'en',
            //     captionsTextTrack2Label: 'Spanish',
            //     captionsTextTrack2LanguageCode: 'es',
            //     xhrSetup: function (xhr) {
            //         xhr.withCredentials = true; // do send cookie
            //         xhr.setRequestHeader("X-Cookie", cookies[0]);
            //         xhr.setRequestHeader("X-Cookie", cookies[1]);
            //         xhr.setRequestHeader("X-Cookie", cookies[2]);
            //     },
            // };
            hls.loadSource(
                "https://dash.megacdn.xyz/raw/594fb1abbef75d365ca490521b5260b2/index.m3u8"
            );
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        }
    }

    render() {
        return (


            <video
                preload="none"
                className="videoCanvas"
                ref={player => (this.player = player)}
                autoPlay={true}
            />


        );
    }
}
export default Player;