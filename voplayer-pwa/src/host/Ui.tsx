import * as React from 'react';
import { parseUrl } from '../modules/Authentication'
import { addToQueue, getSongInfo, play, pause, search, nextSong, previousSong } from '../modules/Playback'
import { io } from "socket.io-client";

import '../Styling.css';
import Song from '../components/song'

const ipAdress = 'localhost:3050'
const socket = io('http://' + ipAdress)
let searchToken: string = '';

type SongType = {
    name: string,
    artist: string,
    album_cover: string,
    uri: string
}

socket.on("searchAuth", (token: string) => {
  searchToken = token;
});

export default function Ui() {
    let updateSongTimer: any = React.useRef(null);
    const [token, setToken]: [string, Function] = React.useState('');
    const [searchInput, setSearchInput]: [string, Function] = React.useState('')
    const [searchData, setSearchData]: [Array<string>, Function] = React.useState([])
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
    
    React.useEffect(() => {
        if (parseUrl(window.location.href, localStorage.getItem('state')) !== null && token === '') {
            setToken(parseUrl(window.location.href, localStorage.getItem('state')));
            window.history.replaceState({}, document.title, "/Ui");
        }
 
        if (token !== '') {
            console.log('Afspelende nummer wordt voor het eerst opgehaald')
            getSongInfo(token)
            .then((res: any) => {
                if (res.data !== "") {
                    setCurrentSong({
                        name: res.data.item.name,
                        artist: res.data.item.artists[0].name,
                        album_cover: res.data.item.album.images[0].url,
                        current_ms: res.data.progress_ms,
                        total_ms: res.data.item.duration_ms,
                    })
                }
            })
            .catch(err => console.log('error', err))
        }
    }, [token]);

    React.useLayoutEffect(() => {
        clearTimeout(updateSongTimer.current)
        updateSongTimer.current = setTimeout(() => {
            console.log('Afspelende nummer wordt opgehaald')
            getSongInfo(token)
            .then((res: any) => {
                setCurrentSong({
                    name: res.data.item.name,
                    artist: res.data.item.artists[0].name,
                    album_cover: res.data.item.album.images[0].url,
                    current_ms: res.data.progress_ms,
                    total_ms: res.data.item.duration_ms,
                })
            })
            .catch(err => console.log('error', err))
        }, currentSong.total_ms - currentSong.current_ms + 250); 
    }, [token, currentSong])

    React.useLayoutEffect(() => {
        console.log('currentSong: ', currentSong)
    }, [currentSong])

    function setSearch(event: any) {
        setSearchInput(event.target.value)
        let timer;
        clearTimeout(timer)

        if (event.target.value === '') {
            setSearchData([])
        } else {
            timer = setTimeout(() => {
                search(searchToken, event.target.value).then(data => setSearchData(data.data.tracks.items)).catch(err => console.log('error', err))
            }, 250);
        }
    }

    function next() {
        console.log("Next song")
        nextSong(token)
        .then(() => setTimeout(() => {getSongInfo(token)
            .then((res: any) => setCurrentSong({
                name: res.data.item.name,
                artist: res.data.item.artists[0].name,
                album_cover: res.data.item.album.images[0].url,
                current_ms: res.data.progress_ms,
                total_ms: res.data.item.duration_ms,
            }))
        }, 250))
        .catch(err => console.log('error', err))
    }

    function prev() {
        console.log("Next song")
        previousSong(token)
        .then(() => setTimeout(() => {getSongInfo(token)
            .then((res: any) => setCurrentSong({
                name: res.data.item.name,
                artist: res.data.item.artists[0].name,
                album_cover: res.data.item.album.images[0].url,
                current_ms: res.data.progress_ms,
                total_ms: res.data.item.duration_ms,
            }))
        }, 250))
        .catch(err => console.log('error', err))
    }

    const listSearch = (data: any) => {
        const searchList = data.map((song: any, index: number) => {
            return <Song
                key={index}
                src={song.album.images[1].url}
                song={song.name}
                artist={song.artists[0].name}
                onClick={() => {
                    setSelectedSong({uri: song.uri});
                }}
            />
        });
        if (searchList.length !== 0) {
            return (
                <div className="SearchList">{searchList}</div>
            )
        } else return null
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
                        {/* ik snap ook wel dat de jsx hier beter kan is gewoon voor de functies in playback.tsx */}
                        <div className="Button" onClick={() => {next()}}>
                            Next
                        </div>
                        <div className="MediaButtons">
                            <div className="Button" onClick={() => {
                                console.log('Play')
                                play(token).then()
                                getSongInfo(token)
                                    .then((res: any) => {
                                        setCurrentSong({
                                            name: res.data.item.name,
                                            artist: res.data.item.artists[0].name,
                                            album_cover: res.data.item.album.images[0].url,
                                            current_ms: res.data.progress_ms,
                                            total_ms: res.data.item.duration_ms,
                                        })
                                    })
                                }}>
                                Play
                            </div>
                            <div className="Button" onClick={() => {console.log('Pause'); pause(token)}}>
                                pause
                            </div>
                            <div className="Button" onClick={() => {prev()}}>
                                Prev
                            </div>
                        </div>
                    </div>
                    <div className="Queue">
                        <div className="Button" onClick={() => {socket.emit('searchAuth', 'new')}}>
                            Refresh token
                        </div>
                        <div className="Button" onClick={() => addToQueue(token, selectedSong.uri).then(res => console.log(res))}>
                            Add song to queue
                        </div>
                        {listSearch(searchData)}
                    </div>
                </div>
            </div>
        </div>
    )
}