export interface Store {
    instance?: any;
    storage?: LocalForage;
    initializing?: boolean;
    initialized?: boolean;
}