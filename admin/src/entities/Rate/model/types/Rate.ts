import { Purchase } from "@/entities/Purchase";

export interface Rate<isPurchases extends boolean = false> {
	id: string;
	name: string;
	description: string;
	price: number;
	price_XTR: number;
	GB_limit: number;
	max_devices: number;
	MB_speed: number;
	expiresIn: number;
	purchases: isPurchases extends true ? Purchase[] : undefined;
}

export enum Currency {
	RUB,
	STARS,
	CRYPTO,
}
