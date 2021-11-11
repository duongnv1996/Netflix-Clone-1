import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import Search from './Search';
import Navbar from './Navbar';
import Detail from './Detail';

const AppRouter = () => (
  <BrowserRouter>
    <>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/detail" component={Detail} />
        <Route component={NotFound} />
      </Switch>
    </>
  </BrowserRouter>
);

export default AppRouter;
