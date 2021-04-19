type SongType = {
    name: string,
    artist: string,
    album_cover: string,
    uri: string
};

export const playNow = async(queue: Array<SongType>, song: SongType) => {
    let newQueue: Array<string> = [song.uri];
    queue.forEach(song => {
        newQueue.push(song.uri)
    });

    console.log("NewQueue: ", newQueue)
    return newQueue
}