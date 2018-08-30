import * as React from "react";
import * as ReactDOM from "react-dom";

import "../assets/stylesheets/App.scss";

import App from"./App";

import registerServiceWorker from "../core/registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
registerServiceWorker();
