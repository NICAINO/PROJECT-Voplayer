import * as React from 'react';

import './songStyle.css';

export default function Song(props: any) {
    return (
        <div className="SongBox">
            <div className="Song">
                <img className="SongImg" src={props.src} alt="song"/>
                <div className="SongDescription">
                    <div className="SongTitle">
                        {props.song}
                    </div>
                    <div className="Artist">
                        {props.artist}
                    </div>
                </div>
            </div>
        </div>
    )
}