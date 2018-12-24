import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { Provider }    from 'react-redux';
import { createStore } from 'redux'
import HomeIndex from './components/home/Index.jsx'
import HomeConfirm from './components/home/Confirm.jsx'
import AvatarShow from './components/avatar/Show.jsx'
import PictureShow from './components/picture/Show.jsx'
import reducer from './reducer'

export default function routes(target) {
  const store = createStore(reducer);

  render((
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={HomeIndex} />
          <Route path='/home/confirm' component={HomeConfirm} />
          <Route path='/avatar/:uid' component={AvatarShow} />
          <Route path='/pictures/:uid' component={PictureShow} />
        </Switch>
      </BrowserRouter>
    </Provider>
  ), target)
}
