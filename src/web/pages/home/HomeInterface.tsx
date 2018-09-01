import {BaseComponent} from "../../components/BaseComponent";

export interface HomeOptions {
    iconEnabled?: boolean;
    heroImageEnabled?: boolean;
    pickUpEnabled?: boolean;
    deliveryEnabled?: boolean;
}

export interface HomeProps {
    options?: HomeOptions;
}

export interface HomeState {
    addressValue?: string;
    storedPickUpValue?: string;
    storedDeliveryValue?: any;

    lastOptions?: HomeOptions;
}

export interface HomeInterface extends BaseComponent<HomeProps, HomeState> {

}
