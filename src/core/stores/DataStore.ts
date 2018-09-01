import * as _ from "lodash";
import * as localforage from "localforage";
import * as Models from "../models/Index";
import APIClient from "./APIClient";

export class DataStore implements Models.Store {
    instance: any = null;
    storage: LocalForage;
    initializing: boolean = false;
    initialized: boolean = false;
    authenticatedUser: any = undefined;

    constructor() {
        if (_.isNil(this.instance)) {
            this.instance = this;

            this.storage = localforage.createInstance({
                name: "default"
            });
        }

        return this.instance;
    }
    get isInitializing(): boolean {
        return this.initializing;
    }

    get isInitialized(): boolean {
        return this.initialized;
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.initializing = true;
            this.initialized = false;
            return this.storage.getItem("token")
            .then((accessToken) => {
                if (!_.isNil(accessToken)) {
                    APIClient.accessToken = accessToken as Models.AccessToken;
                    this.fetchUser()
                    .then((user) => {
                        if (!_.isNil(user)) {
                            this.initializing = false;
                            this.initialized = true;
                            resolve(user);
                        }
                    })
                    .catch((err) => {
                        this.initializing = false;
                        this.initialized = false;
                        console.error(err);
                        reject(err);
                    });
                } else {
                    this.initializing = false;
                    this.initialized = true;
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

    fetchUser() {
        return new Promise((resolve, reject) => {
            APIClient.fetchUser()
            .then((user: any) => {
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }

    loginUser(userCredentials: Models.SignIn) {
        return new Promise((resolve, reject) => {
            APIClient.signInUser(userCredentials)
            .then((user: Models.User) => {
                this.authenticatedUser = user;
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }
}
