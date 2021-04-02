import * as React from 'react'
import { genUrl } from './modules/Authentication';
import './Styling.css'

function Loading(props: any) {
  React.useEffect(() => {
    window.location.href = genUrl('vo')
  }, []);

  return (
    <div className="App">
    </div>
  )
};

export default Loading