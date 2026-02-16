import { PagingParams } from "../../../models/PagingParams";

type FlagKey = "isGoing" | "isHost" | "all";

export class ActivityPagingParams extends PagingParams {
    private flags:Map<FlagKey, boolean> = new Map();
    private startDate:Date|null = null;

    constructor(pageNumber:number = 1, pageSize:number = 5){
        super(pageNumber, pageSize);
        this.setDefaultFilters();
    }

    private setDefaultFilters() {
        this.flags.set("all", true);
    }

    setGoingFilter() {
        this.clearAllFlags();
        this.resetPageToOne();
        this.flags.set("isGoing", true);
    }

    private resetPageToOne() {
        this.pageNumber = 1;
    }

    private clearAllFlags() {
        this.flags.clear();
    }

    setHostingFilter() {
        this.clearAllFlags();
        this.resetPageToOne();
        this.flags.set("isHost", true);
    }

    all() {
        this.clearAllFlags();
        this.resetPageToOne();
        this.flags.set("all", true);
    }

    filterByStartDate(date:Date) {
        this.resetPageToOne();
        this.startDate = date;
    }

    createURLSearchParams() {
        const params = super.createURLSearchParams();
        if (this.startDate) {
            params.set("startDate", this.startDate.toISOString());
        }
        this.flags.forEach((value, key) => {
            params.set(key, value.toString());
        })
        return params;
    }
}