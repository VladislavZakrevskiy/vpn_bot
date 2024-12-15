import { Currency, Rate } from "@/entities/Rate";
import { User } from "@/entities/User";

export interface Purchase {
	id: string;
	user_id: string;
	user: User;
	rate_id: string;
	rate: Rate;
	vpn_token?: string;
	hash?: string;

	purchase_date: string;
	amount: number;
	currency: Currency;
	active: boolean;
}
