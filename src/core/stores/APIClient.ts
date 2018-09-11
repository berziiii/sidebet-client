import * as _ from "lodash";
import axios, {AxiosInstance, AxiosRequestConfig, CancelTokenSource, AxiosResponse} from "axios";
import {AppConfig} from "../AppConfig";
import * as Models from "../models/Index";

export class APIClient {

    static accessToken: Models.AccessToken | undefined;

    static createClient(): { client: AxiosInstance, config: AxiosRequestConfig, cancelToken: CancelTokenSource } {
        const result: any = {};
    
        const clientConfig: AxiosRequestConfig = {
            timeout: AppConfig.Settings.Server.timeout,
            baseURL: AppConfig.Settings.Server.baseUrl
        };

        result.client = axios.create(clientConfig);
        
        const cancelTokenHelper = axios.CancelToken;
        result.cancelToken = cancelTokenHelper.source();
    
        const config: AxiosRequestConfig = {};
        config.headers = {};
    
        config.headers["Accept"] = "application/json";
        config.headers["Content-Type"] = "application/json";
        config.headers["X-Context"] = AppConfig.Settings.Server.context;
        if (!_.isNil(this.accessToken))
            config.headers["Authorization"] = `token=${this.accessToken}`;
    
        config.params = {};
    
        config.cancelToken = result.cancelToken.token;
    
        config.withCredentials = true;
    
        result.config = config;
    
        return result;
    }

    // ********************* //
    // ******* USERS ******* //
    // ********************* //

    static fetchUser() {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            return client.get(`/api/users/fetchuser`, config)
            .then((user: any) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static signInUser(userData: Models.SignIn) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();

            return client.post(`/api/users/login`, userData, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static signUpUser(userData: Models.SignUp) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            return client.post(`/api/users/signup`, userData, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static newProfile(userData: Models.NewProfile) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const userId = userData.user_id;
            delete userData.user_id;
            const url = `/api/users/${userId}/update`;
            return client.put(url, userData, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static updateProfile(userData: Models.NewProfile) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const userId = userData.user_id;
            delete userData.user_id;
            const url = `/api/users/${userId}/update`;
            return client.put(url, userData, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static updatePassword(userData: Models.UserProfile) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const userId = userData.user_id;
            delete userData.user_id;
            const url = `/api/users/${userId}/password`;
            return client.put(url, userData, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static deleteUserAccount(userData: Models.UserProfile) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const userId = userData.user_id;
            delete userData.user_id;
            const url = `/api/users/${userId}/delete`;
            return client.delete(url, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static validateUserName(username: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/api/users/validateUsername`;
            return client.post(url, username, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    // ********************** //
    // ******* WAGERS ******* //
    // ********************** //

    static getAllWagers() {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/api/wagers`;
            return client.get(url, config)
            .then((wagers: AxiosResponse) => {
                resolve(wagers);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static createWager(wagerData: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/api/wagers/create`;
            return client.post(url, wagerData, config)
            .then((wager: AxiosResponse) => {
                resolve(wager);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static createWagerOption(optionData: any) {
        return new Promise((resolve, reject) => {
            debugger;
            const {client, config} = this.createClient();
            const url = `/api/wagers/${optionData.wager_id}/options/create`;
            delete optionData.wager_id;
            return client.post(url, optionData, config)
            .then((wager: AxiosResponse) => {
                resolve(wager);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    // ********************* //
    // ******* ADMIN ******* //
    // ********************* //

    static adminGetAllUsers() {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/admin/users`;
            return client.get(url, config)
            .then((users: AxiosResponse) => {
                resolve(users);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static adminGetUserById(userId: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/admin/users/${userId}`;
            return client.get(url, config)
            .then((user: AxiosResponse) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static adminUpdateUserAdminRole(user: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/admin/users/${user.user_id}/update`;
            delete user.user_id;
            return client.put(url, user, config)
            .then((users: AxiosResponse) => {
                resolve(users);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static adminUpdateUserActiveRole(user: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/admin/users/${user.user_id}/update`;
            delete user.user_id;
            return client.put(url, user, config)
            .then((users: AxiosResponse) => {
                resolve(users);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static adminResetUserPassword(user: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/admin/users/${user.user_id}/update`;
            delete user.user_id;
            return client.put(url, user, config)
            .then((users: AxiosResponse) => {
                resolve(users);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static adminDeleteUser(user: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/admin/users/${user.user_id}/delete`;
            delete user.user_id;
            return client.delete(url, config)
            .then(() => {
                resolve();
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }

    static adminGetUserActivity(userId: any) {
        return new Promise((resolve, reject) => {
            const {client, config} = this.createClient();
            const url = `/admin/users/${userId}/activity`;
            return client.get(url, config)
            .then((userAcitivity: any) => {
                resolve(userAcitivity);
            })
            .catch((err) => {
                console.error(err);
                reject(err.response.data);
            });
        });
    }
}

export default APIClient;