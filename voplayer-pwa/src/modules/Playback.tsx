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
        return true
    } catch (error) {
        console.log('Error in AddToQueue: ', error)
        return false
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

export const search = async(searchToken: string, query: string) => {
    var string = query.trim().replace(/\s+/g, '+')
    const Promise = axios({
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
    })
    return Promise
}