import {Item} from "./item";

export interface User {
    id: number;
    first_name: string;
    inbox?: Item[];
}