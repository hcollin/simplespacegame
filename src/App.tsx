import React from 'react';
import './App.css';
import GameView from './views/GameView';

import {joki} from 'jokits-react';
import createGameService from './services/GameService';

joki.service.add({
  serviceId: "GameService",
  service: createGameService,
});

function App() {
  return (
    <div className="App">
     <GameView />
    </div>
  );
}

export default App;
