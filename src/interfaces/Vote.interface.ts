import { Quote } from "./Quote.interface";
import { User } from "./User.interface";

export interface Vote{
    value?: boolean,
    user?: User,
    quote?: Quote
}