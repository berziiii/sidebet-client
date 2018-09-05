import * as _ from "lodash";
import * as localforage from "localforage";
import * as Models from "../models/Index";
import APIClient from "./APIClient";
import {observable, action, computed} from "mobx";

export class DataStore implements Models.Store {
    instance: any = null;
    storage: LocalForage;
    @observable initializing: boolean = false;
    @observable initialized: boolean = false;
    @observable authorizedUser: any = undefined;

    constructor() {
        if (_.isNil(this.instance)) {
            // this.instance = this;

            this.storage = localforage.createInstance({
                name: "default"
            });
        }

        return this.instance;
    }

    @computed
    get isInitializing(): boolean {
        return this.initializing;
    }

    @computed
    get isInitialized(): boolean {
        return this.initialized;
    }

    processResponse(response: any) {
        return response.data;
    }

    @action
    clearUserAndToken = () => {
        this.storage.clear()
        .then(() => {
            this.authorizedUser = undefined;
            return "cleared";
        })
        .catch((err) => {
            console.error(err);
    
        });
    }

    @action
    initialize() {
        return new Promise((resolve, reject) => {
            this.initializing = true;
            this.initialized = false;
            this.storage.getItem("token")
            .then((token: any) => {
                if (!_.isNil(token)) {
                    APIClient.accessToken = token;
                    this.fetchUser()
                    .then((userObj: any) => {
                        this.initializing = false;
                        this.initialized = true;
                        this.authorizedUser = userObj;
                        resolve(this.processResponse(userObj));
                    })
                    .catch((err: any) => {
                        this.initializing = false;
                        this.initialized = false;
                        console.error(err);
                        reject(err);
                    });
                } else {
                    this.initializing = false;
                    this.initialized = true;
                    this.authorizedUser = undefined;
                    resolve(false);
                }
            })
            .catch((err) => {
                this.initializing = false;
                this.initialized = false;
                console.error(err);
                reject(err);
            });
        });
    }

    @action
    fetchUser() {
        return new Promise((resolve, reject) => {
            APIClient.fetchUser()
            .then((user: any) => {
                resolve(this.processResponse(user));
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    @action
    loginUser(userCredentials: Models.SignIn) {
        return new Promise((resolve, reject) => {
            APIClient.signInUser(userCredentials)
            .then((userObj: Models.User) => {
                const user = this.processResponse(userObj);
                APIClient.accessToken = user.token;
                this.storage.setItem("token", user.token)
                .then(() => {
                    this.authorizedUser = user;
                    resolve(user);
                })
                .catch((err) => {
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    @action
    createUser(userCredentials: Models.SignUp) {
        return new Promise((resolve, reject) => {
            APIClient.signUpUser(userCredentials)
            .then((userObj: Models.User) => {
                const user = this.processResponse(userObj);
                this.authorizedUser = user;
                APIClient.accessToken = user.token;
                this.storage.setItem("token", user.token)
                .then(() => {
                    resolve(user);
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    @action
    updateNewUser(profileInfo: Models.NewProfile) {
        return new Promise((resolve, reject) => {
            APIClient.newProfile(profileInfo)
            .then((userObj: Models.User) => {
                const user = this.processResponse(userObj);
                APIClient.accessToken = user.token;
                this.authorizedUser = user;
                resolve(user);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    updateUserProfile(profileInfo: Models.UserProfile) {
        return new Promise((resolve, reject) => {
            APIClient.updateProfile(profileInfo)
            .then((userObj: Models.User) => {
                const user = this.processResponse(userObj);
                APIClient.accessToken = user.token;
                this.authorizedUser = user;
                resolve(user);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    updateUserPassword(userData: Models.UserPassword) {
        return new Promise((resolve, reject) => {
            APIClient.updatePassword(userData)
            .then((userObj: Models.User) => {
                const user = this.processResponse(userObj);
                resolve(user);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    deleteUser(userData: Models.UserPassword) {
        return new Promise((resolve, reject) => {
            APIClient.deleteUserAccount(userData)
            .then((userObj: Models.User) => {
                const user = this.processResponse(userObj);
                resolve(user);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    checkUsername(username: any) {
        return new Promise((resolve, reject) => {
            APIClient.validateUserName(username)
            .then((validUsername: boolean) => {
                const valid = this.processResponse(validUsername);
                resolve(valid);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }
}
