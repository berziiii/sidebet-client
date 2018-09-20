import * as React from "react";
import * as _ from "lodash";
import {Observer, observer} from "mobx-react";
import { Form, Input, Button } from "antd";
import {SignInProps, SignInState} from "./SignInInterface"; 
import {BaseComponent} from "../BaseComponent";

const FormItem = Form.Item;

@observer
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
            } else {
                const error = userObj || "Something went wrong. Unable to Sign In.";
                this.appStore.showMessage("error", error);
            }
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", err);
        });
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
          };
        return(
            <Observer>
            {() => 
                <div className="sb_app__component-container sb_signin__component-container">
                    <div className="sb_signin__form-container">
                        <h1> SIGN IN </h1>
                        <Form onSubmit={this.handleSubmit} name="signin" className="login-form">
                            <FormItem 
                                {...formItemLayout}
                                label="Email or Username: "
                                className="sb_signin__input">
                                <Input
                                    onChange={this.handleChange} 
                                    value={this.state.email} 
                                    name="email" 
                                    placeholder="Email or Username" />
                            </FormItem>
                            <FormItem 
                                {...formItemLayout}
                                label="Password: "
                                className="sb_signin__input">
                                <Input
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