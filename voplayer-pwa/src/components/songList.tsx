import Song from './song';
import './songStyle.css';

export default function SearchList(props: any, token: any) {
    const searchList = props.data.map((song: any, index: number) => {
        return <Song
            key={index}
            src={song.album.images[1].url}
            song={song.name}
            artist={song.artists[0].name}
        />
    });
    if (searchList.length !== 0) {
        return (
            <div className="SearchList">{searchList}</div>
        )
    } else return null
}