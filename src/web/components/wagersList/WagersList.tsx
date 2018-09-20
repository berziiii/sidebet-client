import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Button, 
        Icon, 
        Drawer, 
        Form, 
        Input, 
        Select, 
        DatePicker,
        Collapse } from "antd";
import {BaseComponent} from "../BaseComponent";
import * as ComponentFactory from "../ComponentFactory";
import {WagersListProps, WagersListState} from "./WagersListInterface";
import * as moment from "moment";
import TextArea from "antd/lib/input/TextArea";

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
let uuid = 1;
let keys: any = [];

export class WagersList extends BaseComponent<WagersListProps, WagersListState> {
    constructor(props: WagersListProps) {
        super(props);
        this.state = {
            loading: true,
            wagers: undefined,
            wager_title: "",
            wager_description: "",
            special_instruction: "",
            share_type: "Public",
            wager_prize: "",
            wager_prize_type: "Monetary",
            wager_type: "Head to Head",
            wager_buy_in: "",
            closes_at: "",
            expires_at: "",
            options: {},
            search: "",
        };
        this.getWagers = this.getWagers.bind(this);
        this.handleAddWager = this.handleAddWager.bind(this);
        this.handleWagerPrizeChange = this.handleWagerPrizeChange.bind(this);
        this.handleBettingClosesChange = this.handleBettingClosesChange.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.submitCreateWager = this.submitCreateWager.bind(this);
        this.addOption = this.addOption.bind(this);
        this.removeOption = this.removeOption.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.createWager = this.createWager.bind(this);
        this.createWagerOptions = this.createWagerOptions.bind(this);
        this.handleWagerTypeChange = this.handleWagerTypeChange.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
    }

    componentDidMount() {
        uuid = 1;
        keys = [];
        this.getWagers()
        .then((wagers: any) => {
            this.setState({
                wagers: wagers,
                loading: false,
                visibleDrawer: false,
            });
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to get Wagers");
        });
    }

    getWagers() {
        return new Promise((resolve, reject) => {
            this.appStore.dataStore.getAllWagers()
            .then((wagers: any) => {
                resolve(wagers);
            })
            .catch((err: any) => {
                reject(err);
            });
        });
    }

    handleTextInputChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name]: value
        });
    }

    onClose = () => {
        this.setState({
            visibleDrawer: false,
        });
    }

    handleAddWager(e: any) {
        this.setState({visibleDrawer: true});
    }

    handleWagerTypeChange(e: any) {
        this.setState({wager_type: e});
    }

    handleWagerPrizeChange(value: any) {
        this.setState({
            wager_prize_type: value,
            wager_buy_in: "",
            wager_prize: ""
        });
    }

    handleBettingClosesChange(d: any, dateStamp: any) {
        const timestame = moment(dateStamp).format();
        this.setState({
            closes_at: timestame
        });
    }

    handleBetExpiresAt(d: any, dateStamp: any) {
        const timestame = moment(dateStamp).format();
        this.setState({
            expires_at: timestame
        });
    }

    createWagerOptions(createdWager: any) {
        const PromiseChain: any = [];
        _.each(this.state.options, (option: any) => {
            const optionData = {
                wager_id: createdWager.wager_id,
                owner_id: this.appStore.dataStore.authorizedUser.user_id,
                option_text: option.value,
            };
            PromiseChain.push(this.appStore.dataStore.createWagerOption(optionData));
        });
        return Promise.all(PromiseChain)
                .then(() => {
                    return createdWager;
                })
                .catch((err: any) => {
                    console.error(err);
                    this.appStore.showMessage("error", "Something went wrong. Unable to add Wager Options");
                });
    }

    createWager(wagerData: any) {
        this.appStore.dataStore.createWager(wagerData)
        .then((createdWager: any) => {
            return this.createWagerOptions(createdWager);
        })
        .then((createdWager: any) => {
            this.appStore.navigateTo(`/wagers/${createdWager.wager_id}`);
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to create Wager");
        });
    }

    submitCreateWager(e: any) {
        e.preventDefault();
        const newWagerData = {
            wager_title: this.state.wager_title,
            wager_description: this.state.wager_description,
            share_type: this.state.share_type,
            wager_prize_type: this.state.wager_prize_type,
            wager_type: this.state.wager_type,
            special_instruction: this.state.special_instruction,
            closes_at: this.state.closes_at,
            expires_at: this.state.expires_at,
        };
        if (this.state.wager_prize_type === "Monetary")
            newWagerData["wager_buy_in"] = this.state.wager_buy_in;
        else 
            newWagerData["wager_prize"] = this.state.wager_prize;
        if (this.appStore.validateNewWager(newWagerData)) {
            this.createWager(newWagerData);
        } else {
            this.appStore.showMessage("error", "Please Complete All Form fields.");
            if (keys.length < 2) 
                this.appStore.showMessage("error", "Must have at Minimum 2 Wager Options");
        }

    }

    addOption() {
        const option = `option${uuid}`;
        keys.push({
            option: option,
            value: ""
        });
        uuid++;
        this.setState({
            options: keys
        });
    }

    removeOption(k: any) {
        if (keys.length === 1) {
            return;
        }
        keys = keys.filter((item: any) => item.option !== k.option);
        this.setState({
            options: keys
        });
    }

    handleOptionChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        const updateOptions = this.state.options.map((key: any) => {
            if (key.option === name) {
                key.value = value;
                return key;
            }
            return key;
        });
        this.setState({
            options: updateOptions
        });
    }

    handleSearchChange(e: any) {
        const value = e.target.value;
        this.setState({
            search: value,
        });
    }

    render() {
        const MonetaryPrize = this.state.wager_prize_type === "Monetary";
        let wagersList: any = [];
        if (_.isArray(this.state.wagers)) {
            wagersList = this.state.wagers.map((wager: any, i: any) => {
                return (
                    <ComponentFactory.WagerCard key={`wagerCard${i}`} wager={wager} />
                );
            });
        }
        const formItems = keys.map((k: any, i: any) => {
            return (
                    <FormItem
                    key={`createOption${i}`}>
                        <Input 
                            name={k.option}
                            value={k.value}
                            onChange={this.handleOptionChange}
                            placeholder="Wager Option" 
                            className="sb_wagers__option-input"/>
                        {keys.length > 1 ? (
                            <Icon
                                className="dynamic-delete-button sb_wagers__option-remove-icon"
                                type="minus-circle-o"
                                onClick={() => this.removeOption(k)}
                            />
                        ) : null}
                    </FormItem>
            );
        });
        
        const drawer = (
            <Drawer
                title="Create a Wager"
                placement={"right"}
                closable={false}
                onClose={this.onClose}
                visible={this.state.visibleDrawer}
                className="sb_wagers__add-wager-drawer"
            >
                <Form onSubmit={this.submitCreateWager}>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Title:</h5>
                        <Input 
                            type="text" 
                            value={this.state.wager_title} 
                            name="wager_title"
                            onChange={this.handleTextInputChange}
                            className="sb_wagers__add-wager-input"/>
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Description:</h5>
                        <TextArea 
                            value={this.state.wager_description} 
                            name="wager_description"
                            onChange={this.handleTextInputChange}
                            className="sb_wagers__add-wager-input"/>
                    </FormItem>

                    <FormItem>
                        <Collapse className="sb_wagers__wager-special-instructions">
                            <Panel 
                            header="Special Wager Details" 
                            key="1">
                                <TextArea 
                                value={this.state.special_instruction} 
                                name="special_instruction"
                                onChange={this.handleTextInputChange}
                                className="sb_wagers__add-wager-input"/>
                            </Panel>
                        </Collapse>
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Type:</h5>
                        <Select 
                            defaultValue={this.state.wager_type} 
                            onChange={this.handleWagerTypeChange}
                            className="sb_wagers__add-wager-input">
                            <Option value="Head to Head">Head to Head</Option>
                            <Option value="Over / Under">Over / Under</Option>
                            <Option value="Futures / Outright">Futures / Outright</Option>
                            <Option value="Prop Bet / Specials">Prop Bet / Specials</Option>
                        </Select>
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Share Type:</h5>
                        <Select defaultValue={this.state.share_type} disabled className="sb_wagers__add-wager-input">
                            <Option value="Public">Public</Option>
                            <Option value="Private">Private</Option>
                        </Select>
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Prize Type:</h5>
                        <Select 
                            defaultValue={this.state.wager_prize_type} 
                            className="sb_wagers__add-wager-input"
                            onChange={this.handleWagerPrizeChange}>
                            <Option value="Monetary">Monetary</Option>
                            <Option value="Non-Monetary">Non-Monetary</Option>
                        </Select>
                    </FormItem>

                    {MonetaryPrize &&
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Buy In:</h5>
                        <Input 
                            prefix={"$"}
                            className="sb_wagers__add-wager-input"
                            type="number"
                            onChange={this.handleTextInputChange}
                            value={this.state.wager_buy_in}
                            name="wager_buy_in"/>
                    </FormItem>}

                    {!MonetaryPrize &&
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Prize:</h5>
                        <Input 
                            className="sb_wagers__add-wager-input"
                            type="text"
                            onChange={this.handleTextInputChange}
                            value={this.state.wager_prize}
                            name="wager_prize"/>
                    </FormItem>}

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Bets Close at:</h5>
                        <DatePicker 
                            showTime={{
                                use12Hours: true,
                                format: "HH:mm A"
                            }}
                            format="llll"
                            className="sb_wagers__add-wager-input"
                            onChange={(d, ds) => this.handleBettingClosesChange(d, ds)}
                            placeholder="Betting Closes at..." />
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Expires at:</h5>
                        <DatePicker 
                            showTime={{
                                use12Hours: true,
                                format: "HH:mm a"
                            }}
                            format="llll"
                            className="sb_wagers__add-wager-input"
                            onChange={(d, ds) => this.handleBetExpiresAt(d, ds)}
                            placeholder="Wager Expires at..." />
                    </FormItem>

                    <h5 className="sb_wagers__add-wager-input-label">Wager Options (2-3 Options): </h5>
                    {formItems}

                    {keys.length < 3 &&
                    <FormItem 
                        className="sb_wagers__add-option-button">
                        <Button type="dashed" onClick={this.addOption} style={{ width: "60%" }}>
                            <Icon type="plus" /> Add Wager Option
                        </Button>
                    </FormItem>}

                    <FormItem className="sb_wagers__submit-button">
                        <Button 
                            onClick={this.handleAddWager}
                            type="primary" 
                            htmlType="submit" >
                            Create Wager
                        </Button>
                    </FormItem>

                </Form>
            </Drawer>
        );

        const content = (
            <div className="sb_app__component-container sb_wagers__component-container">
                <div className="sb_app__wagers-list-container">
                    {/* <Input 
                    className="sb_wagers-list__search-input-container"
                    prefix={<Icon type="search" />}
                    type="text"
                    placeholder="Search Wagers"
                    onChange={this.handleSearchChange}
                    /> */}
                    {_.isArray(this.state.wagers) && 
                        wagersList}
                    {!_.isArray(this.state.wagers) &&
                    <h4>{this.state.wagers}</h4>}
                </div>
                <Button 
                    onClick={this.handleAddWager}
                    className="sb_wagers__add-wager-button">
                    <Icon 
                        className="sb_wagers__add-wager-icon"
                        type="plus" />
                </Button>
                {drawer}
            </div>
        );

        return(
            <Observer>
            {() => 
                <>
                {this.state.loading && 
                <ComponentFactory.Loading />}
                {!this.state.loading &&
                 content}
                </>}
            </Observer>
        );
    }
}