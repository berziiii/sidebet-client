import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Menu, Icon, Button } from "antd";
import {NavigationProps, NavigationState} from "./NavigationInterface"; 
import {BaseComponent} from "../BaseComponent";

export class Navigation extends BaseComponent<NavigationProps, NavigationState> {
    constructor(props: any) {
        super(props);
        this.state = {
            collapsed: true,
        };
        this.handleNavClick = this.handleNavClick.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    // componentWillMount() {
    //     if (!_.isNil(this.appStore.dataStore.authorizedUser)) {
    //         this.setState({validUser: true});
    //     }
    // }

    handleNavClick(path: string) {
        this.appStore.navigateTo(path);
    }

    handleLogout() {
        this.appStore.dataStore.storage.clear()
        .then(() => {
            this.setState({validUser: false});
            this.appStore.dataStore.authorizedUser = undefined;
            this.appStore.navigateTo("/signin");
        })
        .catch((err) => {
            console.error(err);
        });
    }
    render() {
        return (
            <Observer>
                {() => 
                <Menu
                    mode="inline"
                    theme="dark">
                    <Button 
                    className="sb_navigation__menu-button"
                    size="large" 
                    onClick={this.props.toggle}>
                        <Icon
                        className="trigger"
                        type={this.props.collapsed ? "menu-unfold" : "menu-fold"}
                        />
                    </Button>
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/")}
                        key="home">
                        <Icon type="home" />
                        <span> Home </span>
                    </Menu.Item>
                    {_.isNil(this.appStore.dataStore.authorizedUser) && 
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/signin")}
                        key="signin">
                        <Icon type="login" />
                        <span> Login </span>
                    </Menu.Item>}
                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                    <Menu.Item 
                        onClick={this.handleLogout}
                        className="sb_navigation__logout-icon"
                        key="logout">
                            <Icon type="logout" />
                            <span> Logout </span>
                    </Menu.Item>}
                </Menu>  
                }      
            </Observer>
        );
    }
}