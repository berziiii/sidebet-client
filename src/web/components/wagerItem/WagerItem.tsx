import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Icon, Button, Drawer, Form, Input, DatePicker, Select, Modal, Collapse } from "antd";
import {BaseComponent} from "../BaseComponent";
import {AppMode} from "../../stores/AppStore";
import {WagerItemProps, WagerItemState} from "./WagerItemInterface";
import * as moment from "moment";
import * as ComponentFactory from "../ComponentFactory";
import TextArea from "antd/lib/input/TextArea";

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;

let oldState: any = {};
let keys: any = [];

export class WagerItem extends BaseComponent<WagerItemProps, WagerItemState> {
    constructor(props: WagerItemProps) {
        super(props);
        this.state = {
            loading: true,
            dirtyData: false,
            modalVisible: false,
            visibleDrawer: false,
            wager_id: undefined,
            wager_title: undefined,
            bets: [],
            wager_description: undefined,
            share_type: undefined,
            wager_prize: undefined,
            wager_prize_type: undefined,
            wager_type: undefined,
            wager_buy_in: undefined,
            closes_at: undefined,
            expires_at: undefined,
            options: [],
            owner: undefined,
            userBet: undefined,
        };

        this.getWagerDetails = this.getWagerDetails.bind(this);
        this.handleBet = this.handleBet.bind(this);
        this.setWagerState = this.setWagerState.bind(this);
        this.removeBet = this.removeBet.bind(this);
        this.onClose = this.onClose.bind(this);
        this.handleEditWager = this.handleEditWager.bind(this);
        this.handleWagerPrizeChange = this.handleWagerPrizeChange.bind(this);
        this.handleBettingClosesChange = this.handleBettingClosesChange.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.submitEditWager = this.submitEditWager.bind(this);
        this.handleOptionChange = this.handleOptionChange.bind(this);
        this.removeWager = this.removeWager.bind(this);
        this.handleBackToWagers = this.handleBackToWagers.bind(this);
        this.editWager = this.editWager.bind(this);
        this.handleDeleteWager = this.handleDeleteWager.bind(this);
        this.handleRemoveWagerCancel = this.handleRemoveWagerCancel.bind(this);
        this.handleRemoveWagerSubmit = this.handleRemoveWagerSubmit.bind(this);
        this.handleWagerTypeChange = this.handleWagerTypeChange.bind(this);
    }

    componentDidMount() {
        keys = [];
        const { match } = this.props.match;
        const wagerId = match.params.wagerId;

        this.getWagerDetails(wagerId)
        .then((wager: any) => {
            this.setWagerState(wager);
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.navigateTo("/notfound");
            this.appStore.showMessage("error", "Something went wrong. Unable to get Wager or Wager doesn't exist");
        });
    }

    setWagerState(wager: any) {
        const {appStore} = this;
        let userBet = undefined;
        wager.bets.forEach((bet: any) => {
            if (appStore.dataStore.authorizedUser.user_id === bet.user_id)
                userBet = bet.option_id;
        });
        keys = wager.options;
        oldState = {
            loading: false,
            visibleDrawer: false,
            modalVisible: false,
            dirtyData: false,
            wager_id: wager.wager_id,
            wager_title: wager.wager_title,
            bets: wager.bets,
            wager_description: wager.wager_description,
            share_type: wager.share_type,
            wager_prize: wager.wager_prize,
            wager_prize_type: wager.wager_prize_type,
            wager_type: wager.wager_type,
            wager_buy_in: wager.wager_buy_in,
            closes_at: wager.closes_at,
            expires_at: wager.expires_at,
            options: wager.options,
            owner: wager.owner.username,
            owner_id: wager.owner.user_id,
            created_at: wager.created_at,
            last_modified: wager.last_modified,
            userBet: userBet
        };
        this.setState({
            loading: false,
            visibleDrawer: false,
            modalVisible: false,
            dirtyData: false,
            wager_id: wager.wager_id,
            wager_title: wager.wager_title,
            bets: wager.bets,
            wager_description: wager.wager_description,
            share_type: wager.share_type,
            wager_prize: wager.wager_prize,
            wager_prize_type: wager.wager_prize_type,
            wager_type: wager.wager_type,
            wager_buy_in: wager.wager_buy_in,
            closes_at: wager.closes_at,
            expires_at: wager.expires_at,
            options: wager.options,
            owner: wager.owner.username,
            owner_id: wager.owner.user_id,
            created_at: wager.created_at,
            last_modified: wager.last_modified,
            userBet: userBet
        });
    }

    getWagerDetails(wagerId: any) {
        const {appStore} = this;
        return appStore.dataStore.getWagerById(wagerId);
    }

    removeBet() {
        const { appStore, state } = this;
        const betData = {
            wager_id: state.wager_id,
        };
        appStore.dataStore.deleteUserBet(betData)
        .then(() => {
            return this.getWagerDetails(betData.wager_id);
        })
        .then((wager: any) => {
            this.setWagerState(wager);
            appStore.showMessage("success", "Successfully removed Bet");
        })
        .catch((err: any) => {
            console.error(err);
            appStore.showMessage("error", "Something went wrong. Unable to remove Bet");
        });
    }

    handleBet(option: any) {
        const { appStore, state } = this;
        const optionData = {
            wager_id: state.wager_id,
            option_id: option.option_id,
            owner_id: appStore.dataStore.authorizedUser.user_id,
            bet_amount: state.wager_buy_in
        };
        if (optionData.option_id !== state.userBet)
            appStore.dataStore.enterUserBet(optionData)
            .then((betDetails: any) => {
                return this.getWagerDetails(betDetails.wager_id);
            })
            .then((wager: any) => {
                this.setWagerState(wager);
                appStore.showMessage("success", "Bet Successfully Made.");
            })
            .catch((err: any) => {
                console.error(err);
                appStore.showMessage("error", "Something went wrong. Unable to enter Bet");
            });
        if (optionData.option_id === state.userBet)
            this.removeBet();
    }

    handleTextInputChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        this.setState({
            [name]: value,
            dirtyData: true,
        });
    }
    
    onClose() {
        if (this.state.dirtyData) {
            oldState.visibleDrawer = false;
            oldState.dirtyData = false;
            this.setState(oldState);
            this.appStore.showMessage("warning", "Any changes were not updated on Wager");
        } else    
            this.setState({
                visibleDrawer: false,
            });
    }

    handleEditWager(e: any) {
        this.setState({visibleDrawer: true});
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
            closes_at: timestame,
            dirtyData: true,
        });
    }

    handleBetExpiresAt(d: any, dateStamp: any) {
        const timestame = moment(dateStamp).format();
        this.setState({
            expires_at: timestame,
            dirtyData: true,
        });
    }

    submitEditWager(e: any) {
        const {appStore, state} = this;
        e.preventDefault();
        const wagerData = {
            wager_id: state.wager_id,
            wager_title: state.wager_title,
            wager_description: state.wager_description,
            share_type: state.share_type,
            wager_prize_type: state.wager_prize_type,
            wager_type: state.wager_type,
            closes_at: state.closes_at,
            expires_at: state.expires_at,
        };
        if (state.wager_prize_type === "Monetary")
            wagerData["wager_buy_in"] = state.wager_buy_in;
        else 
            wagerData["wager_prize"] = state.wager_prize;
        if (appStore.validateEditWager(wagerData)) {
            this.editWager(wagerData);
        } else {
            appStore.showMessage("error", "Please Complete All Form fields.");
            if (keys.length < 2) 
                appStore.showMessage("error", "Must have at Minimum 2 Wager Options");
        }
    }

    handleOptionChange(e: any) {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        keys = keys.map((key: any) => {
            if (key.option_id === name) {
                key.option_text = value;
                return key;
            }
            return key;
        });
        this.setState({
            options: keys,
            dirtyData: true,
        });
    }

    updateOptions(options: any) {
        const {appStore} = this;
        const promiseChain: any = [];
        options.forEach((option: any) => {
            const optionData = {
                wager_id: option.wager_id,
                option_id: option.option_id,
                option_text: option.option_text
            };
            promiseChain.push(appStore.dataStore.updateWagerOption(optionData));
        });
        return Promise.all(promiseChain);
    }

    editWager(wagerData: any) {
        const {appStore, state} = this;
        appStore.dataStore.updateWager(wagerData)
        .then(() => {
            return this.updateOptions(state.options);
        })
        .then(() => {
            return appStore.dataStore.getWagerById(state.wager_id);
        })
        .then((wager: any) => {
            this.setWagerState(wager);
            appStore.showMessage("success", "Wager Successfully Updated");
        })
        .catch((err: any) => {
            console.error(err);
            this.appStore.showMessage("error", "Something went wrong. Unable to create Wager");
        });
    }

    handleDeleteWager() {
        this.setState({
            modalVisible: true
        });
    }

    removeWager() {
        const {appStore, state} = this;
        const wagerId = state.wager_id;
        return appStore.dataStore.removeWager(wagerId);
    }

    handleBackToWagers() {
        const {appStore} = this;
        appStore.navigateTo("/");
    }

    handleRemoveWagerCancel() {
        this.setState({
            modalVisible: false
        });
    }

    handleWagerTypeChange(e: any) {
        this.setState({
            wager_type: e,
            dirtyData: true,
        });
    }

    handleRemoveWagerSubmit() {
        const {appStore} = this;
        this.removeWager()
        .then(() => {
            this.setState({
                modalVisible: false,
            });
            appStore.navigateTo("/");
            appStore.showMessage("success", "Wager, Options and Bets Successfully Removed.");
        }).catch((err: any) => {
            console.error(err);
            appStore.showMessage("error", "Something went wrong. Unable to remove Wager");
        });
    }

    render() {
        const {appStore, state} = this;
        const MonetaryPrize = state.wager_prize_type === "Monetary";
        const userIsOwner = state.owner_id === appStore.dataStore.authorizedUser.user_id;
        const wagerClosed = moment().format() >= state.closes_at;
        const ownerInitial = () => {
            if (!_.isNil(state.owner))
                return state.owner.charAt(0).toUpperCase();
            return "U";
        };

        const ownerAvatar = (
            <div className="sb_wager__owner-avatar">{ownerInitial()}</div>
        );

        const wagerStatus = (
            <>
                {!_.isNil(state.expires_at) && 
                    <>
                        {moment().format() < state.closes_at && 
                        <div className="sb_wager__status">
                            <div className="open-status"/>
                            <h5 className="open">Open</h5>
                        </div>}
                        {moment().format() >= state.closes_at && 
                        <div className="sb_wager__status">
                            <div className="closed-status"/>
                            <h5 className="closed">Closed</h5>
                        </div>}
                    </>
                }
            </>
        );

        const optionBets = (option: any) => state.bets.map((bet: any, i: any) => {
            let initial = "U";
            let name = "User";
            if (!_.isNil(bet.username)) {
                initial = bet.username.charAt(0).toUpperCase();
                name = bet.username !== "" ? bet.username : "User";
            }
            return (
                <>
                    {bet.option_id === option.option_id && 
                    <div key={`optionBet${i}`} className="sb_wager__bets-wrapper">
                        <div key={`betUser${i}`} className="sb_wager__bet-user-avatar">{initial}</div> {name}
                    </div>}
                </>
            );
        });

        const removeWagerConfirmation = (
            <div className="sb_wager__remove-wager-container">
                <Modal
                title="DELETE ACCOUNT CONFIRMATION"
                visible={this.state.modalVisible}
                footer={[
                    <Button key="back" onClick={this.handleRemoveWagerCancel}>CANCEL</Button>,
                    <Button key="submit" type="danger" onClick={this.handleRemoveWagerSubmit}>
                      DELETE WAGER
                    </Button>,
                  ]}
                >
                    <h4> Are you sure you want to delete this wager? This action cannot be undone and will deleting this Wager will also remove all Bets...</h4>
                </Modal>
            </div>
        );

        const wagerOptions = state.options.map((option: any, i: any) => {
            const optionWidth = 100 / state.options.length;
            let hasBets = false;
            state.bets.forEach((bet: any) => {
                if (bet.option_id === option.option_id)
                    hasBets = true;
            });
            const userBetOption = state.userBet === option.option_id;
            return (
                <>
                    {appStore.state.mode === AppMode.Desktop && 
                        <div key={`optionWrapper${i}`} className="sb_wager__option-wrapper" style={{width: `${optionWidth}%`}}>
                        {userBetOption && !wagerClosed &&
                        <Button 
                            // key={`optionButton${i}`}
                            className="sb_wager__option-button sb_wager__user-selected-option"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {userBetOption && wagerClosed &&
                        <Button 
                            disabled
                            // key={`optionButton${i}`}
                            className="sb_wager__option-button sb_wager__user-selected-option"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {!userBetOption && !wagerClosed &&
                        <Button 
                            // key={`optionButton${i}`}
                            className="sb_wager__option-button"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {!userBetOption && wagerClosed &&
                        <Button 
                        // key={`optionButton${i}`}
                            disabled
                            className="sb_wager__option-button"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {hasBets && optionBets(option)}
                        {!hasBets &&
                            <h4 key={`noBets${i}`} className="sb_wager__no-bets"> No Bets</h4>}
                    </div>}
                    
                    {appStore.state.mode === AppMode.Mobile && 
                    <div key={`optionWrapper${i}`} className="sb_wager__option-wrapper" style={{width: "100%"}}>
                        {userBetOption && !wagerClosed &&
                        <Button 
                            className="sb_wager__option-button sb_wager__user-selected-option"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {userBetOption && wagerClosed &&
                        <Button 
                            disabled
                            className="sb_wager__option-button sb_wager__user-selected-option"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {!userBetOption && !wagerClosed &&
                        <Button 
                            className="sb_wager__option-button"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {!userBetOption && wagerClosed &&
                        <Button 
                            disabled
                            className="sb_wager__option-button"
                            onClick={() => this.handleBet(option)}>
                            {option.option_text}
                        </Button>}

                        {hasBets && 
                        <Collapse accordion>
                            <Panel header="Players" key={`${i}`}>
                                {optionBets(option)}
                            </Panel>
                        </Collapse>}
                        {!hasBets &&
                            <h4 key={`noBets${i}`} className="sb_wager__no-bets"> No Bets</h4>}
                    </div>}
                </>
            );
        });

        const formItems = keys.map((k: any, i: any) => {
            return (
                    <FormItem
                        key={`formItem${i}`}>
                        <Input 
                            key={`formInput${i}`}
                            name={k.option_id}
                            value={k.option_text}
                            onChange={this.handleOptionChange}
                            placeholder="Wager Option" 
                            className="sb_wagers__option-input"/>
                    </FormItem>
            );
          });

        const drawer = (
            <Drawer
                title="Edit Wager"
                placement={"right"}
                closable={false}
                onClose={this.onClose}
                visible={state.visibleDrawer}
                className="sb_wagers__add-wager-drawer"
            >
                <Form onSubmit={this.submitEditWager}>
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Title:</h5>
                        <Input 
                            type="text" 
                            value={state.wager_title} 
                            name="wager_title"
                            onChange={this.handleTextInputChange}
                            className="sb_wagers__add-wager-input"/>
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Description:</h5>
                        <TextArea 
                            value={state.wager_description} 
                            name="wager_description"
                            onChange={this.handleTextInputChange}
                            className="sb_wagers__add-wager-input"/>
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Type:</h5>
                        <Select 
                            defaultValue={state.wager_type} 
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
                        <Select defaultValue={state.share_type} disabled className="sb_wagers__add-wager-input">
                            <Option value="Public">Public</Option>
                            <Option value="Private">Private</Option>
                        </Select>
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Prize Type:</h5>
                        <Select 
                            defaultValue={state.wager_prize_type} 
                            className="sb_wagers__add-wager-input"
                            onChange={this.handleWagerPrizeChange}
                            >
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
                            value={state.wager_buy_in}
                            name="wager_buy_in"/>
                    </FormItem>}

                    {!MonetaryPrize &&
                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Prize:</h5>
                        <Input 
                            className="sb_wagers__add-wager-input"
                            type="text"
                            onChange={this.handleTextInputChange}
                            value={state.wager_prize}
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
                            defaultValue={moment(state.closes_at)}
                            className="sb_wagers__add-wager-input"
                            onChange={(d, ds) => this.handleBettingClosesChange(d, ds)}
                            placeholder="Betting Closes at..." />
                    </FormItem>

                    <FormItem>
                        <h5 className="sb_wagers__add-wager-input-label">Wager Expires at:</h5>
                        <DatePicker 
                            showTime={{
                                use12Hours: true,
                                format: "HH:mm A"
                            }}
                            format="llll"
                            defaultValue={moment(state.closes_at)}
                            className="sb_wagers__add-wager-input"
                            onChange={(d, ds) => this.handleBetExpiresAt(d, ds)}
                            placeholder="Wager Expires at..." />
                    </FormItem>

                    <h5 className="sb_wagers__add-wager-input-label">Wager Options (2-3 Options): </h5>
                    {formItems}

                    <FormItem className="sb_wagers__submit-button">
                        <Button 
                            onClick={this.handleEditWager}
                            type="primary" 
                            htmlType="submit" >
                            Update Wager
                        </Button>
                    </FormItem>

                    <FormItem className="sb_wagers__submit-button">
                        <Button 
                            onClick={this.handleDeleteWager}
                            type="danger">
                            Delete Wager
                        </Button>
                    </FormItem>
                </Form>
            </Drawer>
        );

        const mobileSideContent = (
            <>
                <Collapse 
                    accordion
                    className="sb_wager__details-collaspe">
                    <Panel header="Wager Details" key="1">
                        <div className="sb_wager__wager-meta-data-container meta-data-mobile">
                            <div className="sb_wager__wager-meta-data-item meta-data-item-mobile">
                                <h5><span>Owner</span> <div className="sb_wager__wager-meta-data-content">{ownerAvatar}{state.owner}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Status</span> <div className="sb_wager__wager-meta-data-content">{wagerStatus}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Betting Closes</span> <div className="sb_wager__wager-meta-data-content">{moment(state.closes_at).format("llll")}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Wager Closes</span> <div className="sb_wager__wager-meta-data-content">{moment(state.expires_at).format("llll")}</div></h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                <h5>
                                    <span>Wager Type</span>
                                    <div className="sb_wager__wager-meta-data-content">
                                        <Icon type="star" /> {state.wager_type}
                                    </div>
                                </h5>
                            </div>
                            <div className="sb_wager__wager-meta-data-item">
                                    <h5>
                                        <span>Prize Type</span>
                                        <div className="sb_wager__wager-meta-data-content">
                                            <Icon type="gift" /> {state.wager_prize_type}
                                        </div>
                                    </h5>
                                </div>
                            {MonetaryPrize && 
                            <>
                                <div className="sb_wager__wager-meta-data-item">
                                    <h5>
                                        <span>Buy In Amount</span>
                                        <div className="sb_wager__wager-meta-data-content">
                                            ${state.wager_buy_in}
                                        </div>
                                    </h5>   
                                </div>
                            </>}
                            {!MonetaryPrize && 
                            <>
                                <div className="sb_wager__wager-meta-data-item">
                                    <h5>
                                        <span>Prize</span>
                                        <div className="sb_wager__wager-meta-data-content">
                                            <Icon type="trophy" /> {state.wager_prize}
                                        </div>
                                    </h5>
                                </div>
                            </>}
                            <div className="sb_wager__wager-meta-data-item">
                                <h5><span>Last Modified</span> <div className="sb_wager__wager-meta-data-content">{moment(state.last_modified).format("llll")}</div></h5>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
            </>
        );

        const sideContent = (
            <div className="sb_wager__wager-meta-data-container">
                <div className="sb_wager__wager-meta-data-item">
                    <h5><span>Owner</span> <div className="sb_wager__wager-meta-data-content">{ownerAvatar}{state.owner}</div></h5>
                </div>
                <div className="sb_wager__wager-meta-data-item">
                    <h5><span>Status</span> <div className="sb_wager__wager-meta-data-content">{wagerStatus}</div></h5>
                </div>
                <div className="sb_wager__wager-meta-data-item">
                    <h5><span>Betting Closes</span> <div className="sb_wager__wager-meta-data-content">{moment(state.closes_at).format("llll")}</div></h5>
                </div>
                <div className="sb_wager__wager-meta-data-item">
                    <h5><span>Wager Closes</span> <div className="sb_wager__wager-meta-data-content">{moment(state.expires_at).format("llll")}</div></h5>
                </div>
                <div className="sb_wager__wager-meta-data-item">
                    <h5>
                        <span>Wager Type</span>
                        <div className="sb_wager__wager-meta-data-content">
                            <Icon type="star" /> {state.wager_type}
                        </div>
                    </h5>
                </div>
                <div className="sb_wager__wager-meta-data-item">
                        <h5>
                            <span>Prize Type</span>
                            <div className="sb_wager__wager-meta-data-content">
                                <Icon type="gift" /> {state.wager_prize_type}
                            </div>
                        </h5>
                    </div>
                {MonetaryPrize && 
                <>
                    <div className="sb_wager__wager-meta-data-item">
                        <h5>
                            <span>Buy In Amount</span>
                            <div className="sb_wager__wager-meta-data-content">
                                ${state.wager_buy_in}
                            </div>
                        </h5>   
                    </div>
                </>}
                {!MonetaryPrize && 
                <>
                    <div className="sb_wager__wager-meta-data-item">
                        <h5>
                            <span>Prize</span>
                            <div className="sb_wager__wager-meta-data-content">
                                <Icon type="trophy" /> {state.wager_prize}
                            </div>
                        </h5>
                    </div>
                </>}
                <div className="sb_wager__wager-meta-data-item">
                    <h5><span>Last Modified</span> <div className="sb_wager__wager-meta-data-content">{moment(state.last_modified).format("llll")}</div></h5>
                </div>
            </div>
        );
        
        const content = (
            <div className="sb_wager__main-container">
                <div className="sb_wager__card-container">
                    <div className="sb_wager__wager-title">
                    <Button 
                        onClick={this.handleBackToWagers}
                        className="sb_wager__back">
                        <Icon 
                            className="sb_wager__back-icon"
                            type="rollback" />
                    </Button>
                    <h2 className="sb_wager__header-text">{state.wager_title}</h2>
                    
                    {userIsOwner && !wagerClosed && 
                    <Button 
                        onClick={this.handleEditWager}
                        className="sb_wager__edit-wager-button">
                        <Icon 
                            className="sb_wager__edit-wager-icon"
                            type="edit" />
                    </Button>}
                    {appStore.state.mode === AppMode.Mobile &&
                        mobileSideContent}
                    </div>
                    <div className="sb_wager__wager-content-container">

                        {appStore.state.mode === AppMode.Desktop &&
                        sideContent}
                        <div className="sb_wager__wager-details">
                            <p className="sb_wager__wager-description">{state.wager_description}</p> 
                            <h2 className="sb_wager__options-header"> Place a Bet! </h2>  
                            <div className="sb_wager__wager-options-container">
                                {wagerOptions}
                            </div> 
                        </div>
                    </div>
                </div>

                {drawer}
                {removeWagerConfirmation}
            </div>
        );

        return(
            <Observer>
            {() => 
                <>
                    {state.loading && 
                    <ComponentFactory.Loading />}
                    {!state.loading && 
                    content}
                </>}
            </Observer>
        );
    }
}