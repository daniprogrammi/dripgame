import React from 'react';
import { Router, Route, Link, Route } from 'react-router-dom';

function Main(props) {
    return (
    <Route exact path='/' component={props.component}>
    </Route>
    );
}