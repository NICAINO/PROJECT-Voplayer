import * as React from 'react';
import { useParams } from 'react-router';
import { parseUrl } from './modules/Authentication'

import './Styling.css';


export default function Ui() {
    const [token, setToken]: [string, any] = React.useState('');

    React.useEffect(() => {
        setToken(parseUrl(window.location.href, 'vo'))
        console.log(token)
    }, [token])

    return (
        <div className="App"/>
    )
}