import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Form, Icon, Input, Button } from "antd";
import {SignInProps, SignInState} from "./SignInInterface"; 
import {BaseComponent} from "../BaseComponent";

const FormItem = Form.Item;

export class SignInForm extends BaseComponent<SignInProps, SignInState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: this.props.email || "",
            password: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
        appStore.dataStore.loginUser(this.state)
        .then((userObj: any) => {
            if (!_.isNil(userObj)) {
                this.appStore.navigateTo("/");
                this.appStore.showMessage("success", "Successfully Logged In.");
            }
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }

    render() {
        return(
            <Observer>
            {() => 
                <div className="sb_signin__main-container">
                    <div className="sb_signin__form-container">
                        <h1> SIGN IN </h1>
                        <Form onSubmit={this.handleSubmit} name="signin" className="login-form">
                            <FormItem className="sb_signin__input">
                                <Input 
                                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} 
                                    onChange={this.handleChange} 
                                    value={this.state.email} 
                                    name="email" 
                                    placeholder="Username" />
                            </FormItem>
                            <FormItem className="sb_signin__input">
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
                                    className="sb_signin__submit-button">
                                    Sign In
                                </Button>
                            </FormItem>
                        </Form>
                        </div>
                </div>}
            </Observer>
        );
    }
}