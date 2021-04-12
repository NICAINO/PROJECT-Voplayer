import * as React from 'react';
import PlayButton from '../assets/PlayButton.svg'
import PauseButton from '../assets/PauseButton.svg'
import NextButton from '../assets/NextButton.svg'
import PrevButton from '../assets/PrevButton.svg'
import '../Styling.css';
import { search } from '../modules/Playback';
import Song from '../components/song'

type SongType = {
    name: string,
    artist: string,
    album_cover: string,
    uri: string
};

export default function ClientUi({socket}: any) {
    const [typing, setTyping]: [Boolean, Function] = React.useState(false)
    const [queue, setQueue]: [Array<SongType>, Function] = React.useState([]);
    const [currentSong, setCurrentSong]: [any, Function] = React.useState({});
    const [searchInput, setSearchInput]: [string, Function] = React.useState('');
    const [searchData, setSearchData]: [Array<string>, Function] = React.useState([]);
    const [searchToken, setSearchToken]: [string, Function] = React.useState('');

    const currentSongRef: any = React.useRef(currentSong);
    currentSongRef.current = currentSong;
    const searchTokenRef: any = React.useRef(searchToken);
    searchTokenRef.current = searchToken;
    const updateSearchTimer: any = React.useRef(null);

    React.useEffect(() => {
        //Get in clients group
        socket.emit('group', 'client', socket.id)

        //Initial info
        const initialActions = () => {
            console.log('Joined clients')
            socket.emit('searchAuth', 'refresh', socket.id)
            socket.emit('commands', 'currentSong')
            socket.emit('commands', 'updateQueue')
        }
        socket.on('Joined clients', initialActions);

        //Eventuele shit
        socket.on('queueUpdate', (arg: Array<SongType>) => {
            setQueue(arg)
            console.log('Queue is geupdate')
        });
        socket.on('currentUpdate', (arg: any) => {
            setCurrentSong(arg)
            console.log('Currentsong is geupdate')
        });
        socket.on('searchAuth', (arg: any) => {
            setSearchToken(arg)
            console.log('Er is een nieuw search token')
        });

        //Disconnect bij unmount
        return () => {
            socket.disconnect()
        };
    }, [socket])
    
    React.useEffect(() => {
        console.log("Huidige nummer: ", currentSongRef.current.name)
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

    const toSearchList = (data: any) => {
        const searchList = data.map((song: any, index: number) => {
            return <Song
                key={index}
                src={song.album.images[1].url}
                song={song.name}
                artist={song.artists[0].name}
                onClick={() => {
                    socket.emit('commands', 'addToQueue', {
                        name: song.name, 
                        artist: song.artists[0].name, 
                        album_cover: song.album.images[1].url, 
                        uri: song.uri
                    })
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
                        onBlur={(e) => {if(e.target.value === '') {setTyping(false)}}}
                    />
                </div>
                <div className="Wrapper">
                    <div className="Player">
                        <div>{currentSongRef.current.name} from {currentSongRef.current.artist}</div>
                        <div className="PlayerImage" style={{backgroundImage: returnURL(currentSongRef.current.album_cover)}}/>
                        <div className="MediaButtons">
                            <img className="MediaButton" src={PrevButton} alt="previous" onClick={() => socket.emit('commands', 'previous')}/>
                            <img className="MediaButton" src={PlayButton} alt="play" onClick={() => socket.emit('commands', 'play')}/>
                            <img className="MediaButton" src={PauseButton} alt="pause" onClick={() => socket.emit('commands', 'pause')}/>
                            <img className="MediaButton" src={NextButton} alt="next" onClick={() => socket.emit('commands', 'next')}/>                        
                        </div>
                    </div>
                    <div className="Queue">
                        {typing ?
                            toSearchList(searchData)
                            :
                            toQueue(queue)
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}