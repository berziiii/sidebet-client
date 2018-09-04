import * as React from "react";
import {Observer} from "mobx-react";
import { Icon, Button } from "antd";
import {BaseComponent} from "../BaseComponent";

export class NotFound extends BaseComponent {
    constructor(props: any) {
        super(props);
        this.handleHomeClick = this.handleHomeClick.bind(this);
    }
    handleHomeClick() {
        this.appStore.navigateTo("/");
    }
    render() {
        return(
            <Observer>
            {() => 
                <>
                    <h1> Not Found </h1>
                    <Button 
                        onClick={this.handleHomeClick}
                        type="primary" 
                        htmlType="submit" 
                        className="login-form-button">
                        <Icon type="home" />
                    </Button>
                </>
            }
            </Observer>
        );
    }
}