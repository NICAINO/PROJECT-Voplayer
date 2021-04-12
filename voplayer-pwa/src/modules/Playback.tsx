import axios from 'axios'

export const addToQueue = async(token: string, uri: string) => {
    try {
        await axios({
            url: 'https://api.spotify.com/v1/me/player/queue'
                .concat('?uri=', uri), 
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        });
        console.log('Song added to queue')
    } catch (error) {
        console.log('Error in AddToQueue: ', error)
    }
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