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
                        resolve(userObj);
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
                resolve(user);
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }

    @action
    loginUser(userCredentials: Models.SignIn) {
        return new Promise((resolve, reject) => {
            APIClient.signInUser(userCredentials)
            .then((user: Models.User) => {
                this.storage.setItem("token", user.token)
                .then(() => {
                    this.authorizedUser = user;
                    resolve(user);
                })
                .catch((err) => {
                    console.error(err);
                    reject(err);
                });
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
        });
    }
}
