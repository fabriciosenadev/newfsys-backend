import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

// site
import Home from './pages/site/Home';
import About from './pages/site/About';

export default function Routes()
{
    return(
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home}/>
                <Route path="/about" component={About} />
            </Switch>
        </BrowserRouter>
    );
}