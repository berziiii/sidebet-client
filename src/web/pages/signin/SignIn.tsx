import * as _ from "lodash";
import * as React from "react";
import * as ComponentFactory from "../../components/ComponentFactory";
import {BaseComponent} from "../../components/BaseComponent";

export class SignIn extends BaseComponent {
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
    }

    render() { 
        return(
            <ComponentFactory.SignInForm />
        );
    }  
}   