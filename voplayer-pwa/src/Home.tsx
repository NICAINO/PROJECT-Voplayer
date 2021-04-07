import './Styling.css';
import { genUrl } from './modules/Authentication'
import { Link } from 'react-router-dom';

async function authorize() {
  const state = JSON.stringify(Math.random())
  localStorage.setItem('state', state)
  return state
}

function Home() {
  return (
    <div className="App">
      <div className="Header">
        VOPLAYER
      </div>
      <div className="Button" onClick={() => authorize().then(state => window.location.href = genUrl(state))}>
          Zijt host (Dom)
      </div>
      <Link style={{textDecoration: 'none'}} to="/client/Ui">
        <div className="Button">
            Wees client (sub(NFMG))
        </div>
      </Link>
    </div>
  );
};

export default Home;
