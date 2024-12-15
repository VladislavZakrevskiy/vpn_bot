import { Purchase } from "@/entities/Purchase";

export interface UserSchema {
	user: User | null;
	tgUser: TgUser | null;
	tgInitData: Record<string, string> | null;

	_inited: boolean;
}

export interface TgUser {
	id: number;
	first_name: string;
	last_name?: string;
	username: string;
	language_code: string;
	allows_write_to_pm: boolean;
}

export interface User<isPurchases extends boolean = false> {
	id: string;
	tg_id: string;
	role: Role;
	vpn_uuid: string;
	is_active: boolean;
	was_trial: boolean;
	purchases: isPurchases extends true ? Purchase[] : undefined;
}

enum Role {
	ADMIN,
	USER,
}
