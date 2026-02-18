export type ProfileActivityFilter = "pastEvents" | "futureEvents" | "hosting";

export interface ProfileActivity {
    id:string;
    title:string;
    date:Date;
    category:string;
}