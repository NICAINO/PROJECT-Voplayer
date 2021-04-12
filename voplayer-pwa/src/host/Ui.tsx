import * as React from 'react';
import { parseUrl, generateState, genUrl } from '../modules/Authentication'
import { addToQueue, getSongInfo, playSong , pauseSong, search, nextSong, previousSong } from '../modules/Playback'
import PlayButton from '../assets/PlayButton.svg'
import PauseButton from '../assets/PauseButton.svg'
import NextButton from '../assets/NextButton.svg'
import PrevButton from '../assets/PrevButton.svg'
import Song from '../components/song'


import '../Styling.css';

type SongType = {
    name: string,
    artist: string,
    album_cover: string,
    uri: string
};

function reducer(state: any, action: {type: string, payload: SongType}) {
    switch (action.type) {
        case 'update':
            let newQueue = [...state.queue, action.payload]
            return {queue: newQueue}
    default:
        throw new Error();
    }
}

export default function Ui({socket}: any) {
    const [state, dispatch]: [{queue: Array<SongType>}, any] = React.useReducer(reducer, {queue: []})
    const [token, setToken]: [string, Function] = React.useState('');
    const [searchToken, setSearchToken]: [string, Function] = React.useState('')
    const [searchInput, setSearchInput]: [string, Function] = React.useState('')
    const [searchData, setSearchData]: [Array<string>, Function] = React.useState([])
    const [typing, setTyping]: [Boolean, Function] = React.useState(false)
    const [currentSong, setCurrentSong]: [any, Function] = React.useState({
        name: 'Nothing',
        artist: 'Nothing',
        album_cover: 'https://mulder-onions.com/wp-content/uploads/2017/02/White-square-300x300.jpg',
        current_ms: '0',
        total_ms: '100000',
    })
    const updateSongTimer: any = React.useRef(null);
    const updateSearchTimer: any = React.useRef(null);
    const currentSongRef: any = React.useRef(currentSong);
    currentSongRef.current = currentSong;
    const queueRef: any = React.useRef(state.queue);
    queueRef.current = state.queue;
    const searchTokenRef: any = React.useRef(searchToken);
    searchTokenRef.current = searchToken;
    const tokenRef: any = React.useRef(token);
    tokenRef.current = token;
    const searchDataRef: any = React.useRef(searchData);
    searchDataRef.current = searchData;

    React.useEffect(() => {
        //Wees dom
        socket.emit('group', 'host')

        //Inititial actions
        const initialActions = () => {
            if (currentSongRef.current.name !== 'Nothing') {
                // socket.emit('queue', 'update', queueRef.current);
                socket.emit('current', 'update', currentSongRef.current);
            }
            socket.emit('searchAuth', 'refresh', socket.id)
        }

        socket.on('Joined as host', initialActions);

        //Eventuele shit
        socket.on('commands', (arg: string, data: SongType) => {
            console.log('Een client heeft aandacht nodig')
            switch (arg) {
                case 'updateQueue':
                    console.log('Huidige queue verstuurd', queueRef.current)
                    socket.emit('queue', 'update', queueRef.current)
                    break;
                case 'currentSong':
                    console.log('Huidig nummer verstuurd', currentSongRef.current)
                    socket.emit('current', 'update', currentSongRef.current)
                    break;
                case 'addToQueue':
                    dispatch({type: 'update', payload: data})
                    addToQueue(tokenRef.current, data.uri)
                    break;
                case 'play':
                    play()
                    break
                case 'pause':
                    pause()
                    break
                case 'next':
                    next()
                    break
                case 'previous':
                    previous()
                    break
                default:
                    console.log('Ik weet niet hoe je dit gedaan hebt maar je hebt iets kanker fout gedaan bij de inkomende berichten')
            }
        })
        socket.on('searchAuth', (arg: any) => {
            setSearchToken(arg)
            console.log('Er is een nieuw search token')
        });

        //Disconnect bij unmount
        return () => {
            socket.disconnect()
        }
    }, [socket])

    React.useEffect(() => {
        if (queueRef.current !== []) {
            console.log('Updated queue through useEffect')
            socket.emit('queue', 'update', queueRef.current)
        }
    }, [socket, state.queue])

    React.useEffect(() => {
        if (currentSongRef.current.name !== 'Nothing') {
            console.log('Updated song through useEffect')
            socket.emit('current', 'update', currentSongRef.current)
        }
    }, [socket, currentSong])
    
    React.useEffect(() => {
        if (parseUrl(window.location.href, localStorage.getItem('state')) !== null && token === '') {
            setToken(parseUrl(window.location.href, localStorage.getItem('state')));
            window.history.replaceState({}, document.title, "/Ui");
        } else if (token === '') {
            generateState().then(state => window.location.href = genUrl(state))
        }

        if (token !== '') {
            console.log('Afspelende nummer wordt voor het eerst opgehaald')
            getSongInfo(tokenRef.current)
            .then(() => updateCurrentSong(token))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    React.useEffect(() => {
        clearTimeout(updateSongTimer.current)
        updateSongTimer.current = setTimeout(() => {
            console.log('Afspelende nummer wordt opgehaald')
            getSongInfo(token)
                .then(() => updateCurrentSong(token))
        }, currentSongRef.current.total_ms - currentSongRef.current.current_ms + 400); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSong])

    React.useEffect(() => {
        console.log('currentSong: ', currentSongRef.current)
    }, [currentSong])

    const setSearch = React.useCallback((event: any) => {
        setSearchInput(event.target.value)
        clearTimeout(updateSearchTimer.current);

        if (event.target.value === '') {
            setSearchData([])
        } else if (event.keyCode === 13) {
            search(searchTokenRef.current, event.target.value)
                .then((data: any) => setSearchData(data.data.tracks.items))
                .catch(err => console.log('error', err))
        } else {
            updateSearchTimer.current = setTimeout(() => {
                search(searchTokenRef.current, event.target.value)
                    .then((data: any) => setSearchData(data.data.tracks.items))
                    .catch(err => console.log('error', err))
            }, 250);
        }
    }, [])

    const updateCurrentSong = (Token: string) => {
        //Call dit liefst in .then(hier) denk ik
        setTimeout(() => {
            getSongInfo(Token)
            .then((res: any) => setCurrentSong({
                name: res.data.item.name,
                artist: res.data.item.artists[0].name,
                album_cover: res.data.item.album.images[0].url,
                current_ms: res.data.progress_ms,
                total_ms: res.data.item.duration_ms,
            })).catch((error) => console.log("Error bij updateCurrentSong: ", error))
        }, 250)
    }

    //Gestandaardiseerde functies voor socket commands
    const play = React.useCallback((uriArray ? : Array<string>) => {
        if (uriArray === undefined) {
            console.log("Playing")
            playSong(tokenRef.current)
                .then(() => updateCurrentSong(token))
                .catch(err => console.log("Error playing", err))
        } else {
            console.log("Playing Song")
            playSong(tokenRef.current, uriArray)
                .then(() => updateCurrentSong(token))
                .catch(err => console.log("Error playing songs: ", uriArray, err))
        }
    }, [updateCurrentSong])
    
    const toSearchList = (data: any) => {
        const searchList = data.map((song: any, index: number) => {
            return <Song
                key={index}
                src={song.album.images[1].url}
                song={song.name}
                artist={song.artists[0].name}
                onClick={() => {
                    dispatch({type: 'update', payload: {
                        name: song.name,
                        artist: song.artists[0].name,
                        album_cover: song.album.images[1].url,
                        uri: song.uri
                    }})
                    //addToQueue(tokenRef.current, song.uri)
                    // setQueue((data: Array<any>) => [...data, 'pog'])
                }}
            />
        });
        if (searchList.length !== 0) {
            return <div className="SearchList">{searchList}</div>
        } else return null
    }

    const toQueue = (data: any) => {
        const newQueue = data.map((song: any, index: number) => {
            return <Song
                key={index}
                src={song.album_cover}
                song={song.name}
                artist={song.artist}
            />
        });
        if (newQueue.length !== 0) {
            return <div className="SearchList">{newQueue}</div>
        } else return null
    }

    const pause = React.useCallback(() => {
        console.log('Pausing')
        pauseSong(tokenRef.current)
            .then(() => updateCurrentSong(token))
            .catch(err => console.log("Error pausing: ", err))
    }, [updateCurrentSong]);

    const next = React.useCallback(() => {
        console.log("Next song")
        nextSong(tokenRef.current)
            .then(() => updateCurrentSong(token))
            .catch(err => console.log('Error nexting: ', err))
    }, [updateCurrentSong]);

    const previous = React.useCallback(() => {
        console.log("Previous song")
        previousSong(tokenRef.current)
            .then(() => updateCurrentSong(token))
            .catch(err => console.log("Error previoussonging: ", err))
    }, [updateCurrentSong]);

    const returnURL = (url: string) => 'url(' + url + ')';

    return (
        <div className="Background" style={{backgroundImage: returnURL(currentSongRef.current.album_cover)}}>
            <div className="App">
                <div className="TopBar">
                    <input 
                        className="SearchBar" 
                        value={searchInput} 
                        placeholder="Search"
                        onChange={setSearch}
                        onFocus={() => setTyping(true)}
                        onBlur={(e) => {if (e.target.value === '') {setTyping(false)}}}
                    />
                </div>
                <div className="Wrapper">
                    <div className="Player">
                        <div>{currentSongRef.current.name} from {currentSongRef.current.artist}</div>
                        <div className="PlayerImage" style={{backgroundImage: returnURL(currentSongRef.current.album_cover)}}/>
                        
                        <div className="MediaButtons">
                            <img className="MediaButton" src={PrevButton} alt="previous" onClick={() => previous()}/>
                            <img className="MediaButton" src={PlayButton} alt="play" onClick={() => play()}/>
                            <img className="MediaButton" src={PauseButton} alt="pause" onClick={() => pause()}/>
                            <img className="MediaButton" src={NextButton} alt="next" onClick={() => next()}/>                        
                        </div>
                    </div>
                    <div className="Queue">
                        <div className="Button" onClick={() => {socket.emit('searchAuth', 'new')}}>
                            Refresh token
                        </div>
                        <div className="Button" onClick={() => play(["spotify:track:1X4ZkhlRRohkV33cITaJYs"])}>
                            Play Madison Beer Baby
                        </div>
                        <div className="Button" onClick={() => dispatch({type: 'update', payload: {
                            name: 'Nothing',
                            artist: 'Nothing',
                            album_cover: 'https://mulder-onions.com/wp-content/uploads/2017/02/White-square-300x300.jpg',
                            current_ms: '0',
                            total_ms: '100000',
                        }})}>
                            Test
                        </div>
                        {typing ?
                            toSearchList(searchData)
                            :
                            toQueue(state.queue)                  
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}