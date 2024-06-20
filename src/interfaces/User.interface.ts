import { Quote } from "./Quote.interface";
import { Vote } from "./Vote.interface";

export interface User{
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    quotes: Quote[],
    votes: Vote[],
    avatar: string,
}