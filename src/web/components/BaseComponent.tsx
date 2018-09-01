import * as React from "react";
import {AppStore} from "../stores/AppStore";

export abstract class BaseComponent<P = {}, S = {}> extends React.Component<P, S> {
    protected appStore = new AppStore();
}