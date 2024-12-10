export interface User {
  added_by_uuid?: boolean;
  comment?: string;
  current_usage_GB?: number;
  ed25519_private_key?: string;
  ed25519_public_key?: string;
  enable?: boolean;
  id?: number;
  is_active?: boolean;
  lang?: string;
  last_online?: string;
  last_reset_time?: string;
  mode?: string;
  name: string;
  package_days?: number;
  start_date?: string;
  telegram_id?: number;
  usage_limit_GB?: number;
  uuid: string;
  wg_pk?: string;
  wg_psk?: string;
  wg_pub?: string;
}
