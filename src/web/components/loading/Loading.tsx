import * as React from "react";
import {Observer} from "mobx-react";
import { Icon } from "antd";
import {BaseComponent} from "../BaseComponent";

export class Loading extends BaseComponent {
    constructor(props: any) {
        super(props);
    }

    render() {
        return(
            <Observer>
            {() => 
                <div className="sb_loading__main-container">
                    <Icon type="loading" />
                </div>}
            </Observer>
        );
    }
}