export class PagingParams {
    pageNumber:number;
    pageSize:number;

    constructor(pageNumber:number = 1, pageSize:number = 10) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    nextPage() {
        this.pageNumber += 1;
    }

    firstPage() {
        this.pageNumber = 1;
    }

    createURLSearchParams() {
        const params = new URLSearchParams();
        params.append("pageNumber", this.pageNumber.toString());
        params.append("pageSize", this.pageSize.toString());
        return params;
    }
}