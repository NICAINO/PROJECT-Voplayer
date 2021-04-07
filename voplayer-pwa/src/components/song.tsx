import './songStyle.css';

export default function Song(props: any) {
    return (
        <div className="SongBox" onClick={props.onClick}>
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
            <div className="Icon">
                <div className="Dot"/>
                <div className="Dot"/>
                <div className="Dot"/>
            </div>
        </div>
    )
}