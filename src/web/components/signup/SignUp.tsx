import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Form, Icon, Input, Button } from "antd";
import {SignUpProps, SignUpState} from "./SIgnUpInterface"; 
import {BaseComponent} from "../BaseComponent";

const FormItem = Form.Item;

export class SignUpForm extends BaseComponent<SignUpProps, SignUpState> {
    constructor(props: any) {
        super(props);
        this.state = {
            app_secret_key: "",
            email: this.props.email || "",
            password: "",
            username: "",
            first_name: "",
            last_name: "",
            phone: "",
            successfulSignup: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
    }
    handleChange = (e: any) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
            [name]: value
        });
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        const {appStore} = this;
        const user = {
            app_secret_key: this.state.app_secret_key,
            email: this.state.email,
            password: this.state.password
        };
        appStore.dataStore.createUser(user)
        .then((userObj: any) => {
            if (!_.isNil(userObj)) {
                this.appStore.dataStore.authorizedUser = userObj;
                this.setState({successfulSignup: true});
                this.appStore.showMessage("success", "Account Successfully Created.");
            }
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }

    handleUpdateProfile = (e: any) => {
        e.preventDefault();
        const {appStore} = this;
        const user = {
            username: this.state.username,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            phone: this.state.phone,
            user_id: this.appStore.dataStore.authorizedUser.user_id
        };
        appStore.dataStore.updateNewUser(user)
        .then((userObj: any) => {
            if (!_.isNil(userObj)) {
                this.appStore.navigateTo("/");
                this.appStore.showMessage("success", "Profile Successfully Created.");
            }
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }

    render() {
        const signup = (
            <div className="sb_signup__main-container">
                <div className="sb_signup__form-container">
                    <h1> CREATE AN ACCOUNT </h1>
                    <Form onSubmit={this.handleSubmit} name="signup" className="login-form">
                        <FormItem className="sb_signup__input">
                            <Input 
                                prefix={<Icon type="key" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                onChange={this.handleChange} 
                                value={this.state.app_secret_key} 
                                name="app_secret_key" 
                                type="password" 
                                placeholder="API Secret Key" />
                        </FormItem>
                        <FormItem className="sb_signup__input">
                            <Input 
                                prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                onChange={this.handleChange} 
                                value={this.state.email} 
                                name="email" 
                                placeholder="Username" />
                        </FormItem>
                        <FormItem className="sb_signup__input">
                            <Input 
                                prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                onChange={this.handleChange} 
                                value={this.state.password} 
                                name="password" 
                                type="password" 
                                placeholder="Password" />
                        </FormItem>
                        <FormItem>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="sb_signup__submit-button">
                                Sign Up
                            </Button>
                        </FormItem>
                    </Form>
                    </div>
            </div>
        );
        const updateUserProfile = (
            <div className="sb_signup__main-container">
                <div className="sb_signup__form-container">
                    <Form onSubmit={this.handleUpdateProfile} name="update" className="login-form">
                        <FormItem className="sb_signup__input">
                            <Input 
                                prefix={<Icon type="info" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                    onChange={this.handleChange} 
                                    value={this.state.username} 
                                    name="username" 
                                    placeholder="Username" />
                        </FormItem>
                        <FormItem className="sb_signup__input">
                            <Input 
                                prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                onChange={this.handleChange} 
                                value={this.state.first_name} 
                                name="first_name" 
                                placeholder="First Name" />
                        </FormItem>
                        <FormItem className="sb_signup__input">
                            <Input 
                                prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                onChange={this.handleChange} 
                                value={this.state.last_name} 
                                name="last_name" 
                                placeholder="Last Name" />
                        </FormItem>
                        <FormItem className="sb_signup__input">
                            <Input 
                                prefix={<Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                onChange={this.handleChange} 
                                value={this.state.phone} 
                                name="phone" 
                                type="phone" 
                                placeholder="Phone Number" />
                        </FormItem>
                        <FormItem>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="sb_signup__submit-button">
                               Save Profile
                            </Button>
                        </FormItem>
                    </Form>
                    </div>
            </div>
        );
        return(
            <Observer>
            {() =>
                <>
                {!this.state.successfulSignup &&
                signup}
                {this.state.successfulSignup &&
                updateUserProfile}
                </>}
            </Observer>
        );
    }
}