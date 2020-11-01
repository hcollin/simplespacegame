import React from 'react';
import './App.css';

import { joki } from 'jokits-react';
import createGameService from './services/GameService';
import createUserService from './services/UserService';
import createCommandService from './services/CommandService';
import { startFirebase } from './api/firebaseDb';
import MainPage from './views/MainPage';
import createFleetService from './services/FleetService';
import { createChatService } from './services/ChatService';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';


const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

// console.log(joki.config("logger", "ON"));

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

joki.service.add({
  serviceId: "ChatService",
  service: createChatService,
})

startFirebase();

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <MainPage />
    </ThemeProvider>
    </div>
  );
}

export default App;
