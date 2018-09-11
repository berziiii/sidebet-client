import * as React from "react";
import * as _ from "lodash";
import {Observer} from "mobx-react";
import { Icon } from "antd";
import {BaseComponent} from "../BaseComponent";
import {WagerCardProps, WagerCardState} from "./WagerCardInterface";

export class WagerCard extends BaseComponent<WagerCardProps, WagerCardState> {
    constructor(props: WagerCardProps) {
        super(props);
        this.state = {};
        this.handleWagerSelect = this.handleWagerSelect.bind(this);
    }

    componentDidMount() {
    }

    handleWagerSelect(e: any) {
        debugger;
    }

    render() {
        const MonetaryPrize = this.props.wager.wager_prize_type === "Monetary";
        return(
            <Observer>
            {() => 
                <>
                    <div className="sb_wagers__wager-card-container">
                        <div className="sb_wagers__wager-card">
                            <a onClick={this.handleWagerSelect}>
                                <h2 className="sb_wagers__wager-title">{this.props.wager.wager_title}</h2>
                                <div className="sb_wagers__wager-details">
                                    <p className="sb_wagers__wager-description">{this.props.wager.wager_description}</p>    
                                </div>
                                <div className="sb_wager__wager-metainfo-container">
                                    <div className="sb_wager__wager-info">
                                        <h5><Icon type="star" /> {this.props.wager.wager_type}</h5>
                                    </div>
                                    <div className="sb_wager__wager-info">
                                            <h5><Icon type="gift" /> {this.props.wager.wager_prize_type}</h5>
                                        </div>
                                    {MonetaryPrize && 
                                    <>
                                        <div className="sb_wager__wager-info">
                                            <h5>${this.props.wager.wager_buy_in}</h5>
                                        </div>
                                    </>}
                                    {!MonetaryPrize && 
                                    <>
                                        <div className="sb_wager__wager-info">
                                            <h5><Icon type="trophy" /> {this.props.wager.wager_prize}</h5>
                                        </div>
                                    </>}
                                    <div className="sb_wager__wager-info">
                                        <h5><Icon type="team" />{this.props.wager.bets.length}</h5>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                </>}
            </Observer>
        );
    }
}