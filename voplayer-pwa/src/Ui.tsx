import * as React from 'react';
import { parseUrl } from './modules/Authentication'
import { addToQueue, getSongInfo, search } from './modules/Playback'
import { io } from "socket.io-client";

import './Styling.css';
import Song from './components/song'

const ipAdress = 'localhost:3050'
const socket = io('http://' + ipAdress)
let searchToken: string = ''

socket.on("searchAuth", (token: string) => {
  searchToken = token;
});

export default function Ui() {
    let timer: any = React.useRef(null)
    const [token, setToken]: [string, Function] = React.useState('');
    const [searchInput, setSearchInput]: [string, Function] = React.useState('')
    const [searchData, setSearchData]: [Array<string>, Function] = React.useState([])
    const [currentSong, setCurrentSong]: [any, Function] = React.useState({
        name: 'BOYSHIT',
        artist: 'Madison Beer',
        album_cover: 'https://i.scdn.co/image/ab67616d0000b273b607cbee819047fc2e5c3ba4',
        current_ms: '0',
        total_ms: '100000',
    })
    const [selectedSong, setSelectedSong]: [any, Function] = React.useState({
        name: 'BOYSHIT',
        uri: 'spotify:track:3YmgsYX80v0EtBZekgcB6w',
        artist: 'Madison Beer',
    })

    React.useEffect(() => {
        if (parseUrl(window.location.href, localStorage.getItem('state')) !== null) {
            setToken(parseUrl(window.location.href, localStorage.getItem('state')));
            window.history.replaceState({}, document.title, "/Ui");
        }
    }, [token]);

    React.useEffect(() => {
        const interval = setInterval(() => {
            console.log('gebeurd')
            getSongInfo(token)
            .then((res: any) => {
                setCurrentSong({
                    name: res.data.item.name,
                    artist: res.data.item.artists[0].name,
                    album_cover: res.data.item.album.images[0].url,
                    current_ms: res.data.progress_ms,
                    total_ms: res.data.item.duration_ms,
                })
            });
        }, currentSong.total_ms - currentSong.current_ms + 200);
        return () => clearInterval(interval);
    }, [token, currentSong])

    React.useEffect(() => {
        if (searchInput !== '') {
            clearTimeout(timer.current)
            timer.current = setTimeout(()=>{search(searchToken, searchInput).then(data => setSearchData(data.data.tracks.items))}, 250)
        } else {
            setSearchData([])
        }
    }, [searchInput])
    
    React.useEffect(() => {
        console.log('Selected song:', selectedSong)
    }, [selectedSong])

    React.useEffect(() => {
        console.log('Current song:', currentSong)
    }, [currentSong])

    const listSearch = (data: any) => {
        const searchList = data.map((song: any, index: number) => {
            return <Song
                key={index}
                src={song.album.images[1].url}
                song={song.name}
                artist={song.artists[0].name}
                onClick={() => {
                    setSelectedSong({
                        name: song.name,
                        uri: song.uri,
                        artists: song.artists[0].name,
                        album: song.album.images[0].url
                    });
                    setSearchInput('')
                }}
            />
        });
        if (searchList.length !== 0) {
            return (
                <div className="SearchList">{searchList}</div>
            )
        } else return null
    };

    const returnURL = (url: string) => 'url(' + url + ')'

    return (
        <body style={{backgroundImage: returnURL(currentSong.album_cover)}}>
            <div className="App">
                <div className="TopBar">
                    <input 
                        className="SearchBar" 
                        value={searchInput} 
                        placeholder="Search"
                        onChange={(event) => {
                            setSearchInput(event.target.value);
                        }}
                    />
                </div>
                <div className="Wrapper">
                    <div className="Player">
                        <p>{currentSong.name} from {currentSong.artist}</p>
                        <div className="PlayerImage" style={{backgroundImage: returnURL(currentSong.album_cover)}}/>
                    </div>
                    <div className="Queue">
                        <div className="Button" onClick={() => {socket.emit('searchAuth', 'new')}}>
                            Refresh token
                        </div>
                        <div className="Button" onClick={() => {
                            getSongInfo(token)
                                .then((res: any) => {
                                    setCurrentSong({
                                        name: res.data.item.name,
                                        artist: res.data.item.artists[0].name,
                                        album_cover: res.data.item.album.images[0].url,
                                        current_ms: res.data.progress_ms,
                                        total_ms: res.data.item.duration_ms,
                                    })
                                    console.log(currentSong)
                                })
                            }}>
                            Test
                        </div>
                        <div className="Button" onClick={() => addToQueue(token, selectedSong.uri).then(res => console.log(res))}>
                            Add song to queue
                        </div>
                        {listSearch(searchData)}
                    </div>
                </div>
            </div>
        </body>
    )
}