export const genUrl = (state: string) => {
  const url = 'https://accounts.spotify.com/authorize'
    .concat('?client_id=df27f8d7f750447aafefa4cd5399d605')
    .concat('&response_type=token')
    .concat('&redirect_uri=http://localhost:3000/Ui')
    .concat('&state=', state)
    .concat('&scope=user-modify-playback-state')
  return url
};

export const parseUrl = (url: any, state: string) => {
  const params = new URLSearchParams(url)
  if(params.get('state') === state) {
    return url.match(/\#(?:access_token)\=([\S\s]*?)\&/)[1];
  } else return null
} 