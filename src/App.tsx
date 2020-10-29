import React from 'react';
import './App.css';

import {joki} from 'jokits-react';
import createGameService from './services/GameService';
import createUserService from './services/UserService';
import createCommandService from './services/CommandService';
import { startFirebase } from './api/firebaseDb';
import MainPage from './views/MainPage';
import createFleetService from './services/FleetService';

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

joki.service.add({
  serviceId: "FleetService",
  service: createFleetService,
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
