import * as React from "react";
import * as _ from "lodash";
import {Observer, observer} from "mobx-react";
import { Form, Input, Button, Modal } from "antd";
import {ProfileProps, ProfileState} from "./ProfileInterface"; 
import {BaseComponent} from "../BaseComponent";

const FormItem = Form.Item;

@observer
export class ProfileForm extends BaseComponent<ProfileProps, ProfileState> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: this.appStore.dataStore.authorizedUser.email || "",
            username: this.appStore.dataStore.authorizedUser.username || "",
            first_name: this.appStore.dataStore.authorizedUser.first_name || "",
            last_name: this.appStore.dataStore.authorizedUser.last_name || "",
            phone: this.appStore.dataStore.authorizedUser.phone || "",
            password: "" || undefined,
            user_id: this.appStore.dataStore.authorizedUser.user_id || null,
            confirmEmail: "",
            modalVisible: false,
            validUsername: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
        this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
        this.handleRemoveAccount = this.handleRemoveAccount.bind(this);
        this.handleRemoveAccountCancel = this.handleRemoveAccountCancel.bind(this);
        this.handleRemoveAccountSubmit = this.handleRemoveAccountSubmit.bind(this);
    }

    handleChange = (e: any) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
        if (name === "username") {
            const data = {
                username: value
            };
            if (this.appStore.dataStore.authorizedUser.username !== value)
                this.appStore.dataStore.checkUsername(data)
                .then((valid) => {
                    if (valid) {
                        this.setState({validUsername: true});
                    } else {
                        this.setState({validUsername: false});
                    }

                })
                .catch((err) => {
                    this.appStore.showMessage("error", "Something went wrong. Unable to validate Username");
                });
        }
    }

    handleProfileSubmit = (e: any) => {
        e.preventDefault();
        const {appStore} = this;
        const userProfile = {
            email: this.state.email,
            username: this.state.username,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            phone: this.state.phone,
            user_id: this.appStore.dataStore.authorizedUser.user_id
        };
        if (this.state.validUsername)
            if (this.appStore.validateProfileData(userProfile))
                appStore.dataStore.updateUserProfile(userProfile)
                .then(() => {
                    this.appStore.showMessage("success", "Successfully Updated Profile.");
                })
                .catch((err: any) => {
                    console.error(err);
                    this.appStore.showMessage("error", err);
                });
            else 
                this.appStore.showMessage("error", "Please complete all fields.");
    }

    validatePassword(password: string | undefined) {
        const validPassword = this.appStore.validatePassword(password);

        if (validPassword)
            return true;
        else
            this.appStore.showMessage("error", "Please enter a valid Password");
        return false;
    }

    handlePasswordSubmit = (e: any) => {
        e.preventDefault();
        const {appStore} = this;
        const userPassword = {
            password: this.state.password,
            user_id: this.appStore.dataStore.authorizedUser.user_id
        };
        if (this.validatePassword(userPassword.password))
            appStore.dataStore.updateUserPassword(userPassword)
            .then((userObj: any) => {
                this.setState({password: ""});
                this.appStore.showMessage("success", "Successfully Updated Password.");
            })
            .catch((err: any) => {
                console.error(err);
                this.appStore.showMessage("error", err);
            });
    }

    handleRemoveAccount = (e: any) => {
        e.preventDefault();
        this.setState({modalVisible: true});
    }

    handleRemoveAccountCancel = (e: any) => {
        e.preventDefault();
        this.setState({modalVisible: false});
    }

    handleRemoveAccountSubmit = (e: any) => {
        e.preventDefault();
        if (this.state.confirmEmail === this.state.email) {
            const userData = {
                user_id: this.appStore.dataStore.authorizedUser.user_id
            };
            const {appStore} = this;
            appStore.dataStore.deleteUser(userData)
            .then(() => {
                this.setState({modalVisible: false});
                this.appStore.dataStore.clearUserAndToken();
                this.appStore.navigateTo("/signin");
                this.appStore.showMessage("success", "Account Successfully Deleted.");
            })
            .catch((err: any) => {

            });
        } else {
            this.appStore.showMessage("error", "Email address does not match. Please try again.");
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
          };
        const profileForm = (
            <div className="sb_profile__form-container">
                <Form onSubmit={this.handleProfileSubmit} name="profile" className="login-form">
                    <FormItem 
                        {...formItemLayout}
                        label="Email: "
                        className="sb_profile__input">
                        <Input 
                            onChange={this.handleChange} 
                            value={this.state.email} 
                            name="email" 
                            placeholder="Email" 
                            disabled />
                    </FormItem>
                    {this.state.validUsername && 
                        <FormItem 
                            {...formItemLayout}
                            label="Username: "
                            className="sb_profile__input">
                        <Input 
                            onChange={this.handleChange} 
                            value={this.state.username} 
                            name="username" 
                            autoFocus
                            placeholder="Username"/>
                    </FormItem>}
                    {!this.state.validUsername && 
                        <FormItem 
                            {...formItemLayout}
                            label="Username: "
                            validateStatus="error"
                            help="Username Already Taken"
                            className="sb_profile__input">
                        <Input 
                            onChange={this.handleChange} 
                            value={this.state.username} 
                            name="username" 
                            autoFocus
                            placeholder="Username"/>
                    </FormItem>}
                    <FormItem 
                        {...formItemLayout}
                        label="First Name: "
                        className="sb_profile__input">
                        <Input  
                            onChange={this.handleChange} 
                            value={this.state.first_name} 
                            name="first_name" 
                            placeholder="First Name"/>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="Last Name: "
                        className="sb_profile__input">
                        <Input 
                            onChange={this.handleChange} 
                            value={this.state.last_name} 
                            name="last_name" 
                            placeholder="Last Name"/>
                    </FormItem>
                    <FormItem 
                        {...formItemLayout}
                        label="Phone: "
                        className="sb_profile__input">
                        <Input 
                            onChange={this.handleChange} 
                            value={this.state.phone} 
                            name="phone" 
                            placeholder="Phone Number (e.g. 617-231-3210)" />
                    </FormItem>
                    <FormItem>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="sb_profile__submit-button">
                            Update Profile
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );

        const passwordForm = (
            <div className="sb_profile__form-container">
                <Form onSubmit={this.handlePasswordSubmit} name="password" className="login-form">
                    <FormItem
                        {...formItemLayout}
                        label="Password: "
                        help="Must contain a Capital Letter, Number, Special Character (!@#$%&*?|) and be atleast 8 characters long." 
                        className="sb_profile__input">
                        <Input 
                            onChange={this.handleChange} 
                            value={this.state.password} 
                            name="password" 
                            type="password"
                            placeholder="New Password" />
                            
                    </FormItem>
                    <FormItem>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="sb_profile__submit-button">
                            Update Password
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );

        const removeAccount = (
            <div className="sb_profile__form-container">
                <Button 
                    onClick={this.handleRemoveAccount}
                    type="danger" 
                    htmlType="submit"
                    className="sb_profile__submit-button">
                    DELETE ACCOUNT
                </Button>
            </div>
        );

        const removeAccountConfirmation = (
            <div className="sb_profile__form-container">
                <Modal
                title="DELETE ACCOUNT CONFIRMATION"
                visible={this.state.modalVisible}
                footer={[
                    <Button key="back" onClick={this.handleRemoveAccountCancel}>CANCEL</Button>,
                    <Button key="submit" type="danger" onClick={this.handleRemoveAccountSubmit}>
                      DELETE
                    </Button>,
                  ]}
                >
                    <Form onSubmit={this.handleRemoveAccountSubmit} name="removeAccount" className="login-form">
                        <FormItem 
                            {...formItemLayout}
                            label="Confirm Email: "
                            className="sb_profile__input">
                            <Input 
                                onChange={this.handleChange} 
                                value={this.state.confirmEmail} 
                                name="confirmEmail" 
                                placeholder="Confirm Email Address" />
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );

        return(
            <Observer>
            {() => 
                <div className="sb_app__component-container sb_profile__component-container">
                    <h1> PROFILE </h1>
                    <h3> Account Information </h3>
                    {profileForm}
                    <h3> Update Password </h3>
                    {passwordForm}
                    {removeAccount}
                    {removeAccountConfirmation}
                </div>}
            </Observer>
        );
    }
}