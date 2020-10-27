import React from 'react';
import './App.css';
import GameView from './views/GameView';

import {joki} from 'jokits-react';
import createGameService from './services/GameService';
import createUserService from './services/UserService';
import createCommandService from './services/CommandService';
import { startFirebase } from './api/firebaseDb';
import MainPage from './views/MainPage';

joki.service.add({
  serviceId: "GameService",
  service: createGameService,
});

joki.service.add({
  serviceId: "UserService",
  service: createUserService,
});

joki.service.add({
  serviceId: "CommandService",
  service: createCommandService,
});

startFirebase();

function App() {
  return (
    <div className="App">
     <MainPage />
    </div>
  );
}

export default App;
