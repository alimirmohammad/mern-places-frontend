import React from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import NewPlace from './places/pages/NewPlace';
import UpdatePlace from './places/pages/UpdatePlace';
import UserPlaces from './places/pages/UserPlaces';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './user/pages/Users';

function App() {
  return (
    <Router>
      <MainNavigation />
      <main>
        <Switch>
          <Route path='/' exact>
            <Users />
          </Route>
          <Route path='/:userId/places' exact>
            <UserPlaces />
          </Route>
          <Route path='/places/new' exact>
            <NewPlace />
          </Route>
          <Route path='/places/:placeId' exact>
            <UpdatePlace />
          </Route>
          <Redirect to='/' />
        </Switch>
      </main>
    </Router>
  );
}

export default App;
