import type { Component } from 'solid-js';
import { MetaProvider } from '@solidjs/meta';
import { Route, Router } from '@solidjs/router';
import Pages from './pages';

const App: Component = () => {
  return (
    <MetaProvider>
    <Router>
      <Route>
        <Pages/>
      </Route>
    </Router>
    </MetaProvider>
  );
};

export default App;
