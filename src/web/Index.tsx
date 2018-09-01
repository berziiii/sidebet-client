import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "../assets/stylesheets/App.scss";

import App from"./App";

import registerServiceWorker from "../core/registerServiceWorker";

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, 
document.getElementById("root") as HTMLElement);
registerServiceWorker();
