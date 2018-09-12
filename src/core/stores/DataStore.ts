import * as _ from "lodash";
import * as localforage from "localforage";
import * as Models from "../models/Index";
import APIClient from "./APIClient";
import {observable, action} from "mobx";

export class DataStore implements Models.Store {
    instance: any = null;
    storage: LocalForage;
    @observable authorizedUser: any = undefined;

    constructor() {
        if (_.isNil(this.instance)) {
            this.storage = localforage.createInstance({
                name: "default"
            });
        }

        return this.instance;
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
            this.storage.getItem("token")
            .then((token: any) => {
                if (!_.isNil(token)) {
                    APIClient.accessToken = token;
                    this.fetchUser()
                    .then((userObj: any) => {
                        if (typeof userObj === "object") {
                            this.authorizedUser = userObj;
                            resolve(this.processResponse(userObj));
                        } else {
                            resolve(false);
                        }
                    })
                    .catch((err: any) => {
                        console.error(err);
                        reject(err);
                    });
                } else {
                    this.authorizedUser = undefined;
                    resolve(false);
                }
            })
            .catch((err) => {
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

    // ********************* //
    // ******* WAGER ******* //
    // ********************* //

    @action
    getAllWagers() {
        return new Promise((resolve, reject) => {
            APIClient.getAllWagers()
            .then((wagers: any) => {
                resolve(this.processResponse(wagers));
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    getWagerById(wagerId: string) {
        return new Promise((resolve, reject) => {
            APIClient.getWagerById(wagerId)
            .then((wagers: any) => {
                resolve(this.processResponse(wagers));
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    createWager(wagerData: any) {
        return new Promise((resolve, reject) => {
            APIClient.createWager(wagerData)
            .then((wager: any) => {
                resolve(this.processResponse(wager));
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    createWagerOption(optionData: any) {
        return new Promise((resolve, reject) => {
            APIClient.createWagerOption(optionData)
            .then((wager: any) => {
                resolve(this.processResponse(wager));
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    @action
    enterUserBet(betData: any) {
        return new Promise((resolve, reject) => {
            APIClient.enterUserBet(betData)
            .then((wager: any) => {
                resolve(this.processResponse(wager));
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    // ********************* //
    // ******* ADMIN ******* //
    // ********************* //

    @action
    adminGetAllUsers() {
        return new Promise((resolve, reject) => {
            if (this.authorizedUser.is_admin)
                APIClient.adminGetAllUsers()
                .then((users: any) => {
                    resolve(this.processResponse(users));
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    @action
    adminGetUserById(userId: any) {
        return new Promise((resolve, reject) => {
            if (this.authorizedUser.is_admin)
                APIClient.adminGetUserById(userId)
                .then((user: any) => {
                    resolve(this.processResponse(user));
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    @action
    adminUpdateUserAdmin(user: any) {
        return new Promise((resolve, reject) => {
            if (this.authorizedUser.is_admin)
                APIClient.adminUpdateUserAdminRole(user)
                .then((users: any) => {
                    resolve(this.processResponse(users));
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    @action
    adminUpdateUserActive(user: any) {
        return new Promise((resolve, reject) => {
            if (this.authorizedUser.is_admin)
                APIClient.adminUpdateUserActiveRole(user)
                .then((users: any) => {
                    resolve(this.processResponse(users));
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    @action
    adminResetUserPassword(user: any) {
        return new Promise((resolve, reject) => {
            if (this.authorizedUser.is_admin)
                APIClient.adminResetUserPassword(user)
                .then((users: any) => {
                    resolve(this.processResponse(users));
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    @action
    adminDeleteUser(user: any) {
        return new Promise((resolve, reject) => {
            if (this.authorizedUser.is_admin)
                APIClient.adminDeleteUser(user)
                .then(() => {
                    resolve();
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }

    @action
    adminGetUserActivity(userId: any) {
        return new Promise((resolve, reject) => {
            if (this.authorizedUser.is_admin)
                APIClient.adminGetUserActivity(userId)
                .then((userActivity: any) => {
                    resolve(this.processResponse(userActivity));
                })
                .catch((err: any) => {
                    reject(err);
                });
        });
    }
}
