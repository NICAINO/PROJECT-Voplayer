import * as React from 'react'
import { useLocation } from 'react-router-dom'
import { handleLink, parseAuthentication, tokenExchange } from './modules/Authentication';
import './Styling.css'

function Loading(props: any) {
	const search: string = useLocation().search;
	
  React.useEffect(() => {
		let code: string = ''
    if (parseAuthentication(search, 'MadisonBeerVo') === '') {
      handleLink(props.crypto.challenge, 'MadisonBeerVo').then((url) => window.location.href = url)
    };
		code = parseAuthentication(search, 'MadisonBeerVo')
		console.log('challenge: ', props.crypto.challenge,'  Verifier: ', props.crypto.verifier)
		
		tokenExchange(props.crypto.verifier, code).then((res) => console.log(res))
	},[search, props.crypto.challenge, props.crypto.verifier])
    return (
        <div className="App">
            <button>test</button>
        </div>
    )
};

export default Loading