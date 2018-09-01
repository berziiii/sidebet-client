import * as _ from "lodash";
import * as React from "react";
import {BaseComponent} from "../../components/BaseComponent";
import {HomeInterface, HomeProps, HomeState} from "./HomeInterface";

export class Home<P extends HomeProps = HomeProps, S extends HomeState = HomeState> extends BaseComponent<P, S> implements HomeInterface {
    constructor(props: P) {
        super(props);
    }
    componentDidMount() {
    }
    render() {
        return(
            <h1> This is Home </h1>
        );
    }
}   