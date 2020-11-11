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
import { SERVICEID } from './services/services';


const theme = createMuiTheme({
  palette: {
    type: "dark"
  }
});

// console.log(joki.config("logger", "ON"));



joki.service.add({
  serviceId: SERVICEID.GameService,
  service: createGameService,
});

joki.service.add({
  serviceId: SERVICEID.UserService,
  service: createUserService,
});

joki.service.add({
  serviceId: SERVICEID.CommandService,
  service: createCommandService,
});

joki.service.add({
  serviceId: SERVICEID.FleetService,
  service: createFleetService,
});

joki.service.add({
  serviceId: SERVICEID.ChatService,
  service: createChatService,
});

joki.config("env", process.env.NODE_ENV)

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
