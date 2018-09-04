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

    componentWillMount() {
        this.appStore.checkAuthenticatedRoute();
    }

    handleNavClick(path: string) {
        this.appStore.navigateTo(path);
    }

    handleLogout() {
        this.appStore.dataStore.storage.clear()
        .then(() => {
            this.setState({validUser: false});
            this.appStore.dataStore.clearUserAndToken();
            this.appStore.navigateTo("/signin");
            this.appStore.showMessage("success", "Successfully Logged Out.");
        })
        .catch((err) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }
    render() {
        const avatar = () => {
            let initial;
            if (!_.isNil(this.appStore.dataStore.authorizedUser.first_name))
                 initial = this.appStore.dataStore.authorizedUser.first_name.charAt(0).toUpperCase();
            else 
                initial = false;
            return(
                <>
                    {!_.isNil(this.appStore.dataStore.authorizedUser.first_name) &&
                    <Button 
                        className="sb_navigation__avatar"
                        onClick={() => this.handleNavClick("/profile")}>
                        {initial}
                    </Button>}
                    {_.isNil(this.appStore.dataStore.authorizedUser.first_name) &&
                        <Button 
                        className="sb_navigation__avatar"
                        onClick={() => this.handleNavClick("/profile")}>
                        <Icon type="user" />
                    </Button>}
                </>
            );
        };

        return (
            <Observer>
                {() => 
                <Menu
                    className="sb_navigation__menu-container"
                    mode="inline"
                    theme="dark">
                    
                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                        avatar()}
                    {!_.isNil(this.appStore.dataStore.authorizedUser) &&
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/")}
                        key="home">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="home" />
                        <span> Home </span>
                    </Menu.Item>}
                    {_.isNil(this.appStore.dataStore.authorizedUser) && 
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/signup")}
                        key="signup">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="user-add" />
                        <span> Sign Up </span>
                    </Menu.Item>}
                    {_.isNil(this.appStore.dataStore.authorizedUser) && 
                    <Menu.Item 
                        onClick={() => this.handleNavClick("/signin")}
                        key="signin">
                        <Icon 
                        className="sb_navigation__menu-icon"
                        type="login" />
                        <span> Login </span>
                    </Menu.Item>}
                    {!_.isNil(this.appStore.dataStore.authorizedUser) && 
                        <Menu.Item 
                            onClick={this.handleLogout}
                            className="sb_navigation__logout-icon"
                            key="logout">
                                <Icon 
                                className="sb_navigation__menu-icon"
                                type="logout" />
                                <span> Logout </span>
                        </Menu.Item>}
                </Menu>  
                }      
            </Observer>
        );
    }
}