import * as _ from "lodash";
import * as React from "react";
import {Observer} from "mobx-react";
import * as ComponentFactory from "../../components/ComponentFactory";
import {BaseComponent} from "../../components/BaseComponent";

export class SignUp extends BaseComponent {
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
    }

    render() { 
        return(
            <Observer>
            {() =>
                <ComponentFactory.SignUpForm />
            }
            </Observer>
        );
    }  
}   