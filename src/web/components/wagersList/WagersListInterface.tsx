export interface WagersListProps {

}

export interface WagersListState {
    loading?: boolean;
    wagers?: any;
    visibleDrawer?: boolean;
    wager_title?: string | undefined;
    wager_description?: string | undefined;
    special_instruction?: string | undefined;
    share_type?: string | undefined;
    wager_prize?: string | undefined;
    wager_prize_type?: string | undefined;
    wager_type?: string | undefined;
    wager_buy_in?: string | undefined;
    closes_at?: string | undefined;
    expires_at?: string | undefined;
    options?: any | undefined;
    search?: any | undefined;
}