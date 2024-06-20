import { User } from "./User.interface"

export interface Quote{
    id: number,
    user: User | null,
    author: string | any,
    text: string,
    karma: number
}