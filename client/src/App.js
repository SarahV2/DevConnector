import React,{Fragment} from 'react'; //Fragment is like a ghost element
import './App.css';
import {BrowserRouter as Router, Route,Switch} from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'

const App=() =>(
<Router>
<Fragment>
  <Navbar/>
  <Route exact path='/' component={Landing}/>
</Fragment>     
</Router>
)

export default App;
