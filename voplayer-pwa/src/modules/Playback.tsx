import axios from 'axios'

export const addToQueue = async(token: string, uri: string) => {
        const vo = axios({
            url: 'https://api.spotify.com/v1/me/player/queue'
                .concat('?uri=', uri), 
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
            .then(() => {console.log('Song added to queue')})
            .catch(err => {
                if (err.response.status === 401) {
                    console.log("Unauthorized request when adding song to queue: ", err)
                    // hier moet dus iets gebeuren dat ie een aanzoek doet om
                    // een nieuwe token te halen maar ik kan op dit moment alleen
                    // kkkkkkklelijke oplossingen bedenken.
                } else if (err.response.status === 400) {
                    console.log("Bad request sent when adding to queue (dus een bug): ", err)
                } else {
                    console.log("Something went really wrong while adding to queue: ", err)
                }
            })
};

export const getSongInfo = async(token: string) => {
    const Promise = axios({
        url: 'https://api.spotify.com/v1/me/player/currently-playing'
            .concat('?arket=NL'),
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return Promise
}

export const playSong = async(token: string, uriArray?: Array<string>) => {
    // Er kunnen nummer uris doorgegeven worden om af te spelen!!
    if (uriArray === undefined) {
        const Promise = axios({
            url: 'https://api.spotify.com/v1/me/player/play',
            method: 'put',
            // data: undefined,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        return Promise
    } else {
        const Promise = axios({
            url: 'https://api.spotify.com/v1/me/player/play',
            method: 'put',
            data: {
                uris: uriArray
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        return Promise
    }   
}

export const pauseSong = async(token: string) => {
    // Er kunnen nummer uris doorgegeven worden om af te spelen!!
    const Promise = axios({
        url: 'https://api.spotify.com/v1/me/player/pause',
        method: 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return Promise
}

export const nextSong = async(token: string) => {
    const Promise = axios({
        url: 'https://api.spotify.com/v1/me/player/next',
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return Promise
}

export const previousSong = async(token: string) => {
    const Promise = axios({
        url: 'https://api.spotify.com/v1/me/player/previous',
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    return Promise
}

export const search = async(searchToken: string | null, query: string) => {
    return new Promise((resolve, reject) => {
        var string = query.trim().replace(/\s+/g, '+')
        if (query !== '') {
            axios({
                url: 'https://api.spotify.com/v1/search'
                    .concat('?q=', string)
                    .concat('&type=track')
                    .concat('&market=NL')
                    .concat('&limit=5'),
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + searchToken
                }
            }).then(data => resolve(data))
        } else {
            resolve({data: {tracks: {items: []}}})
        }
    })
}