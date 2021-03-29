import axios from 'axios'

const parseAuthentication = (link: any, state: string) => {
  var urlParams = new URLSearchParams(link);
  var code = urlParams.get('code')
	var newState = urlParams.get('state')
  if (code === null) {
    return ''
  } else if (state === newState) {
      return code
  } else return ''
};

const handleLink = async(challenge: string, state: string) => {
  var url: string =  'https://accounts.spotify.com/authorize'
    .concat('?client_id=df27f8d7f750447aafefa4cd5399d605')
    .concat('&response_type=code')
    .concat('&redirect_uri=http://localhost:3000/Loading')
    .concat('&code_challenge_method=S256')
    .concat('&code_challenge=', challenge)
		.concat('&state=', state)
    .concat('&scope=user-modify-playback-state')
  console.log('URL: ', url)
  return url
};

const tokenExchange = async(verifier: any, code: string) => {
    var url: string = 'https://accounts.spotify.com/api/token'
		.concat('?client_id=df27f8d7f750447aafefa4cd5399d605')
		.concat('&grant_type=authorization_code')
		.concat('&code=', code)
		.concat('&redirect_uri=http://localhost:3000/Loading/callback')
		.concat('&code_verifier=', verifier)
	const response = await fetchJSON('https://accounts.spotify.com/api/token', {
    method: 'POST',
    body: new URLSearchParams({
      client_id: 'df27f8d7f750447aafefa4cd5399d605',
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/Loading',
      code_verifier: verifier,
    })
  })
  return response
};

async function fetchJSON(input: any, init: any) {
  const response = await fetch(input, init)
  const body = await response.json()
  return body
}

export { parseAuthentication, handleLink, tokenExchange }

