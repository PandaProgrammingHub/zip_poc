import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
      <h1 id="heading">Multiple Download POC</h1>
      <p>Zip creator </p>
    </header>
    <div id="backHome">
        <a href="/" className="button success">Back To Home</a> 
        <a href="/let_const" className="button info">Refresh</a> 
     </div>
    <div id="container">
       <strong>let and const declarations</strong> 
    </div>
    </div>
  );
}

export default App;
