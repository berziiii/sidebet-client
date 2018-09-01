import * as React from "react";
import { Form, Icon, Input, Button } from "antd";
import {SignInProps, SignInState} from "./SignInInterface"; 
import {BaseComponent} from "../BaseComponent";

const FormItem = Form.Item;

export class SignInForm extends BaseComponent<SignInProps, SignInState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            password: "",
            validUser: this.props.validUser
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
            this.setState({validUser: true});
            this.appStore.navigateTo("/");
        })
        .catch((err: any) => {
            console.error(err);
        });
    }

    render() {
        return(
            <div className="sb_signin__main-container">
                <div className="sb_signin__form-container">
                    <Form onSubmit={this.handleSubmit} name="signin" className="login-form">
                        <FormItem className="sb_signin__input">
                            <Input prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />} onChange={this.handleChange} value={this.state.email} name="email" placeholder="Username" />
                        </FormItem>
                        <FormItem className="sb_signin__input">
                            <Input prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />} onChange={this.handleChange} value={this.state.password} name="password" type="password" placeholder="Password" />
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Sign In
                            </Button>
                        </FormItem>
                    </Form>
                    </div>
            </div>
        );
    }
}