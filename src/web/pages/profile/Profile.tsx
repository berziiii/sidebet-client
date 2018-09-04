import * as _ from "lodash";
import * as React from "react";
import {Observer} from "mobx-react";
import {BaseComponent} from "../../components/BaseComponent";
import * as ComponentFactory from "../../components/ComponentFactory";

export class Profile extends BaseComponent {
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
    }

    render() { 
        return(
            <Observer> 
            {() => 
                <ComponentFactory.ProfileForm />
            }
            </Observer>
        );
    }  
}   