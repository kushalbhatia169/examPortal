import React from 'react';
import { componentsModules } from '../components/index';
import history from './history';
import { BrowserRouter, Switch, Route, HashRouter, Redirect } from 'react-router-dom';

const Router = () => {
  // const isLogin = false;
  return (<>
    <BrowserRouter history={history} forceRefresh={false}>
      <HashRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={() => {
              return (
                // isLogin ?
                //   <Redirect to="/dashboard" /> :
                <Redirect to="/home" />
              );
            }}
          />
          <Route exect path="/home" component={componentsModules['Home']} />
          <Route exect path="/login" component={componentsModules['Login']} />
          <Route exect path="/register" component={componentsModules['Register']} />
          <Route exect path="/forgetpassword" component={componentsModules['ForgetPassword']} />
          <Route exect path="/profile/:id" component={componentsModules['Profile']} />
          <Route exect path="/instruction/:id" component={componentsModules['Instruction']} />
          {/* <Route path='login' component={componentsModules[component]} />; */}
          <Route path="*">
            <NoMatch />
          </Route>
        </Switch>
      </HashRouter>
    </BrowserRouter></>
  );
};

const NoMatch = () => {
  return (
    <Redirect to="/home" />
  );
};
export default Router;