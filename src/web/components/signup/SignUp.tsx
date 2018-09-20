import * as React from "react";
import * as _ from "lodash";
import {Observer, observer} from "mobx-react";
import { Form, Input, Button } from "antd";
import {SignUpProps, SignUpState} from "./SIgnUpInterface"; 
import {BaseComponent} from "../BaseComponent";

const FormItem = Form.Item;

@observer
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
            successfulSignup: false,
            validUsername: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleUpdateProfile = this.handleUpdateProfile.bind(this);
        this.validateEmailAndPassword = this.validateEmailAndPassword.bind(this);
        this.validateNoSpaces = this.validateNoSpaces.bind(this);
        this.validatePhone = this.validatePhone.bind(this);
    }
    handleChange = (e: any) => {
        const target = e.target;
        let value = target.value;
        const name = target.name;
        if (name === "phone" && value.length >= this.state.phone!.length) {
            if (value.match(/(\d{3})/))
                value = value.replace(/(\d{3})\-?/, "$1-");
            if (value.match(/(\d{3})\-?(\d{3})/))
                value = value.replace(/(\d{3})\-?(\d{3})\-?/, "$1-$2-");
            if (value.match(/(\d{3})\-?(\d{3})\-?(\d{4})/))
                value = value.replace(/(\d{3})\-?(\d{3})\-?(\d{4})/, "$1-$2-$3");
        }
        this.setState({
            [name]: value
        });
        if (name === "username") {
            const data = {
                username: value
            };
            this.appStore.dataStore.checkUsername(data)
            .then((valid) => {
                if (valid) {
                    this.setState({validUsername: true});
                } else {
                    this.setState({validUsername: false});
                }

            })
            .catch((err) => {
                this.appStore.showMessage("error", err);
            });
        }
    }

    validateNoSpaces(profileInfo: any) {
        const containsSpaces = /\s/g.test(profileInfo);
        if (containsSpaces)
            return false;
        return true;
    }

    validatePhone(phone: any) {
        const validPhone = /^\d{3}-\d{3}-\d{4}$/g.test(phone);
        if (!validPhone)
            this.appStore.showMessage("error", "Not a valid Phone Number");
        return validPhone;
    } 

    validateEmailAndPassword(email: string | undefined, password: string | undefined) {
        const validEmail = this.appStore.validateEmail(email);
        const validPassword = this.appStore.validatePassword(password);

        if (validEmail && validPassword)
            return true;
        else if (!validEmail)
            this.appStore.showMessage("error", "Please enter a valid Email");
        else if (!validPassword)
            this.appStore.showMessage("error", "Please enter a valid Password");
        return false;
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        const {appStore} = this;
        const user = {
            app_secret_key: this.state.app_secret_key,
            email: this.state.email,
            password: this.state.password
        };
        if (this.validateEmailAndPassword(user.email, user.password)) {
            appStore.dataStore.checkIfUserExists(user)
            .then((userExists?: any) => {
                if (!userExists) {
                    this.setState({successfulSignup: true});
                    this.appStore.showMessage("success", "Email Address Available!");
                } else {
                    this.appStore.showMessage("error", "Email already exists. Please choose another or Sign In.");
                }
            })
            .catch((err: any) => {
                console.error(err);
                this.appStore.showMessage("error", err);
            });
        }
    }

    handleUpdateProfile = (e: any) => {
        e.preventDefault();
        const {appStore} = this;
        const profileInfo = {
            app_secret_key: this.state.app_secret_key,
            email: this.state.email,
            password: this.state.password,
            username: this.state.username,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            phone: this.state.phone,
        };
        const validProfileInfo = () => {
            let validObj = true;
            Object.keys(profileInfo).forEach((key) => {
                if (!this.validateNoSpaces(profileInfo[key]))
                    validObj = false;
            });
            return validObj;
        };
        if (this.validatePhone(profileInfo.phone)) {
            if (validProfileInfo()) {
                if (this.appStore.validateProfileData(profileInfo))

                    appStore.dataStore.createUser(profileInfo)
                    .then((userObj: any) => {
                        if (!_.isNil(userObj)) {
                            this.appStore.navigateTo("/");
                            this.appStore.showMessage("success", "Account Successfully Created.");
                        }
                    })
                    .catch((err: any) => {
                        console.error(err);
                        this.appStore.showMessage("error", err);
                    });
                else 
                    this.appStore.showMessage("error", "Please Complete all Profile Fields");
            } else {
                this.appStore.showMessage("error", "Information can not have spaces. Please fix your responses.");
            }
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 14 },
          };
        const signup = (
            <div className="sb_app__component-container sb_signup__component-container">
                <div className="sb_signup__form-container">
                    <h1> CREATE AN ACCOUNT </h1>
                    <Form onSubmit={this.handleSubmit} name="signup" className="login-form">
                        <FormItem 
                            {...formItemLayout}
                            label="APP Secret Key: "
                            className="sb_signup__input">
                            <Input 
                                onChange={this.handleChange} 
                                value={this.state.app_secret_key} 
                                name="app_secret_key" 
                                type="password"
                                placeholder="APP Secret Key" />
                        </FormItem>
                        <FormItem 
                            {...formItemLayout}
                            label="Email: "
                            className="sb_signup__input">
                            <Input  
                                onChange={this.handleChange} 
                                value={this.state.email} 
                                name="email" 
                                placeholder="Email" />
                        </FormItem>
                        <FormItem 
                            {...formItemLayout}
                            label="Password: "
                            help="Must contain a Capital Letter, Number, Special Character (!@#$%&*?|) and be atleast 8 characters long."
                            className="sb_signup__input">
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
                                className="sb_signup__submit-button">
                                Submit
                            </Button>
                        </FormItem>
                    </Form>
                    </div>
            </div>
        );
        const updateUserProfile = (
                <div className="sb_app__component-container sb_signup-profile__component-container">
                    <div className="sb_signup__form-container">
                        <Form onSubmit={this.handleUpdateProfile} name="update" className="login-form">
                            {this.state.validUsername &&
                            <FormItem 
                            {...formItemLayout}
                            label="Username: "
                            className="sb_signup__input">
                            <Input 
                                    onChange={this.handleChange} 
                                    value={this.state.username} 
                                    name="username" 
                                    autoFocus
                                    placeholder="Username" />
                            </FormItem>}
                            {!this.state.validUsername &&
                            <FormItem 
                                {...formItemLayout}
                                label="Username: "
                                validateStatus="error"
                                help="Username Already Taken"
                                className="sb_signup__input">
                                <Input 
                                    onChange={this.handleChange} 
                                    value={this.state.username} 
                                    name="username" 
                                    autoFocus
                                    placeholder="Username" />
                            </FormItem>}
                            <FormItem 
                                {...formItemLayout}
                                label="First Name: "
                                className="sb_signup__input">
                                <Input  
                                    onChange={this.handleChange} 
                                    value={this.state.first_name} 
                                    name="first_name" 
                                    placeholder="First Name" />
                            </FormItem>
                            <FormItem 
                                {...formItemLayout}
                                label="Last Name: "
                                className="sb_signup__input">
                                <Input  
                                    onChange={this.handleChange} 
                                    value={this.state.last_name} 
                                    name="last_name" 
                                    placeholder="Last Name" />
                            </FormItem>
                            <FormItem 
                                {...formItemLayout}
                                label="Phone Number: "
                                className="sb_signup__input">
                                <Input  
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
                                    Create Account
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