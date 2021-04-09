import * as React from 'react';
import { parseUrl } from '../modules/Authentication'
import { addToQueue, getSongInfo, playSong , pauseSong, search, nextSong, previousSong } from '../modules/Playback'

import '../Styling.css';
//import Song from '../components/song';
import SongList from '../components/songList';

let searchToken: string = '';

type SongType = {
    name: string,
    artist: string,
    album_cover: string,
    uri: string
};

export default function Ui({socket}: any) {
    const [token, setToken]: [string, Function] = React.useState('');
    const [searchInput, setSearchInput]: [string, Function] = React.useState('')
    const [searchData, setSearchData]: [Array<string>, Function] = React.useState([])
    const [queue, setQueue]: [Array<SongType>, Function] = React.useState([])
    const [currentSong, setCurrentSong]: [any, Function] = React.useState({
        name: 'Nothing',
        artist: 'Nothing',
        album_cover: 'https://mulder-onions.com/wp-content/uploads/2017/02/White-square-300x300.jpg',
        current_ms: '0',
        total_ms: '100000',
    })
    const [selectedSong, setSelectedSong]: [SongType, Function] = React.useState({
        name: '',
        artist: '',
        album_cover: '',
        uri: '',
    })
    let updateSongTimer: any = React.useRef(null);

    React.useEffect(() => {
        console.log('Je bent er!', socket)
        socket.emit('group', 'host')
    }, [socket])
    


    React.useEffect(() => {
        console.log('Updated queue through useEffect')
        socket.emit('queue', 'update', queue)
    }, [queue, socket])

    React.useEffect(() => {
        console.log('Updated song through useEffect')
        socket.emit('current', 'update', currentSong)
    }, [currentSong, socket])
    
    React.useEffect(() => {
        if (parseUrl(window.location.href, localStorage.getItem('state')) !== null && token === '') {
            setToken(parseUrl(window.location.href, localStorage.getItem('state')));
            window.history.replaceState({}, document.title, "/Ui");
        }
        if (token !== '') {
            console.log('Afspelende nummer wordt voor het eerst opgehaald')
            getSongInfo(token)
            .then(updateCurrentSong)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    React.useLayoutEffect(() => {
        clearTimeout(updateSongTimer.current)
        updateSongTimer.current = setTimeout(() => {
            console.log('Afspelende nummer wordt opgehaald')
            getSongInfo(token)
            .then(updateCurrentSong)
        }, currentSong.total_ms - currentSong.current_ms + 250); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, currentSong])

    React.useEffect(() => {
        console.log('currentSong: ', currentSong)
    }, [currentSong])

    function setSearch(event: any) {
        setSearchInput(event.target.value)
        let timer;
        clearTimeout(timer)

        if (event.target.value === '') {
            setSearchData([])
        } else if (event.keyCode === 13) {
            search(searchToken, event.target.value).then(data => setSearchData(data.data.tracks.items)).catch(err => console.log('error', err))
        } else {
            timer = setTimeout(() => {
                search(searchToken, event.target.value).then(data => setSearchData(data.data.tracks.items)).catch(err => console.log('error', err))
            }, 250);
        }
    }

    const updateCurrentSong = async() => {
        //Call dit liefst in .then(hier) denk ik
        setTimeout(() => {
            getSongInfo(token)
            .then((res: any) => setCurrentSong({
                name: res.data.item.name,
                artist: res.data.item.artists[0].name,
                album_cover: res.data.item.album.images[0].url,
                current_ms: res.data.progress_ms,
                total_ms: res.data.item.duration_ms,
            })).catch((error) => console.log("Error bij updateCurrentSOng: ", error))
        }, 250)
        return
    }

    //Gestandaardiseerde functies voor socket commands
    const play = async(uriArray?: Array<string>) => {
        if (uriArray === undefined) {
            console.log("Playing")
            playSong(token)
                .then(updateCurrentSong)
                .catch(err => console.log("Error playing", err))
        } else {
            console.log("Playing Song")
            playSong(token, uriArray)
                .then(updateCurrentSong)
                .catch(err => console.log("Error playing songs: ",uriArray, err))
        }
    };

    const pause = async() => {
        console.log('Pausing')
        pauseSong(token)
            .then(updateCurrentSong)
            .catch(err => console.log("Error pausing: ", err))
    };

    const next = async() => {
        console.log("Next song")
        nextSong(token)
            .then(updateCurrentSong)
            .catch(err => console.log('Error nexting: ', err))
    };

    const previous = async() => {
        console.log("Previous song")
        previousSong(token)
            .then(updateCurrentSong)
            .catch(err => console.log("Error previoussonging: ", err))
    };

    const toQueue = async() => {
        addToQueue(token, selectedSong.uri)
            .then(res => console.log(res))
            .catch(err => console.log("Error adding to queue: ", err))
    };

    const returnURL = (url: string) => 'url(' + url + ')';
    const capitalize = (song: string) => song.charAt(0).toUpperCase() + song.slice(1);

    return (
        <div className="Background" style={{backgroundImage: returnURL(currentSong.album_cover)}}>
            <div className="App">
                <div className="TopBar">
                    <input 
                        className="SearchBar" 
                        value={searchInput} 
                        placeholder="Search"
                        onChange={setSearch}
                    />
                </div>
                <div className="Wrapper">
                    <div className="Player">
                        <p>{capitalize(currentSong.name)} from {currentSong.artist}</p>
                        <div className="PlayerImage" style={{backgroundImage: returnURL(currentSong.album_cover)}}/>
                        <div className="Button" onClick={() => next()}>
                            Next
                        </div>
                        <div className="MediaButtons">
                            <div className="Button" onClick={() => play()}>Play</div>
                            <div className="Button" onClick={() => pause()}>Pause</div>
                            <div className="Button" onClick={() => previous()}>Previous</div>
                        </div>
                    </div>
                    <div className="Queue">
                        <div className="Button" onClick={() => {socket.emit('searchAuth', 'new')}}>
                            Refresh token
                        </div>
                        <div className="Button" onClick={() => toQueue()}>
                            Add song to queue
                        </div>
                        <div className="Button" onClick={() => play(["spotify:track:1X4ZkhlRRohkV33cITaJYs"])}>
                            Play Madison Beer Baby
                        </div>
                        <SongList data={searchData}/>
                    </div>
                </div>
            </div>
        </div>
    )
}