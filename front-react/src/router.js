import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// site
import Home from './pages/site/Home';

export default function Routes()
{
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
            </Switch>
        </BrowserRouter>
    );
}