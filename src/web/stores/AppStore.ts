import * as _ from "lodash";
import {DataStore} from "../../core/stores/DataStore";
import { message } from "antd";

export enum AppMode {
    Mobile = "mobile",
    Desktop = "desktop"
}

export interface AppStoreState {
    mode: AppMode | undefined;
}

export class AppStore {
    static instance: any = null;
    static history: any;
    static location: any;
    static initialConfig: any;

    mobileBreakpoint: number = 769; // sm breakpoint

    dataStore = new DataStore();

    // STATE
    state: AppStoreState = {
        mode: this.evaluateMode(),
    };

    constructor() {
        if (!_.isNil(AppStore.instance))
            return AppStore.instance;

        AppStore.instance = this;

        this.handlerWindowResize = this.handlerWindowResize.bind(this);

        window.addEventListener("resize", this.handlerWindowResize);

        document.documentElement.setAttribute("data-browser", navigator.userAgent);

        // this.initialConfig = _.cloneDeep(AppConfig);

        return AppStore.instance;
    }
    setMode(mode: AppMode) {
        console.assert(!_.isNil(mode));
        this.state.mode = mode;
    }

    public showMessage(type: string, ms: string) {
        message[type](ms);
    }

    private evaluateMode(): AppMode {
        const {mobileBreakpoint} = this;

        return !_.isNil(mobileBreakpoint) ? (window.innerWidth < mobileBreakpoint ? AppMode.Mobile : AppMode.Desktop) : AppMode.Desktop;
    }

    private handlerWindowResize() {
        const mode = this.evaluateMode();

        this.setMode(mode);
    }

    public navigateTo(path: string, replace: boolean = false) {
        console.assert(!_.isNil(path) && path.length > 0);

        const prefix = ``;

        const url = `${!path.startsWith(prefix) ? prefix : ""}${path.startsWith("/") ? "" : "/"}${path}`;

        if (replace)
            AppStore.history.replace(url);
        else
            AppStore.history.push(url);        
    }

    public checkAuthenticatedRoute() {
        const path = AppStore.history.location.pathname;
        if (_.isNil(this.dataStore.authorizedUser)) {
            if (path.indexOf("signin") === -1 && path.indexOf("signup") === -1) {
                this.navigateTo("/signin");
            }
        } else if (!_.isNil(this.dataStore.authorizedUser)) {
            if (path.indexOf("admin") !== -1 && !this.dataStore.authorizedUser!.is_admin) {
                this.navigateTo("/");
            }
        }
    }

    public validateEmail(email: any) {
        const regEx = /^\S+@\S+\.\S+$/;
        return regEx.test(email);
    }

    public validatePassword(password: any) {
        return /[A-Z]/       .test(password) &&
                /[a-z]/       .test(password) &&
                /[0-9]/       .test(password) &&
                /[!@#$%&*?]/g.test(password) &&
                password.length >= 8;
    }
}