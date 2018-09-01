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

    static createUser() {
        // this
    }

    static fetchUser() {
        const {client, config} = this.createClient();
        return client.get(`/api/users/fetchuser`, config)
        .then((user: any) => {
            return this.processResponse(user);
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    }

    static signInUser(userData: Models.SignIn) {
        const {client, config} = this.createClient();

        return client.post(`/api/users/login`, userData, config)
        .then((user: AxiosResponse) => {
            return this.processResponse(user);
        })
        .catch((err) => {
            console.error(err);
            return err;
        });
    }

    static processResponse(response: any) {
        return response.data;
    }
}

export default APIClient;