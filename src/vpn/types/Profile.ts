export interface Profile {
  admin_message_html?: string;
  admin_message_url?: string;
  brand_icon_url?: string;
  brand_title?: string;
  doh?: string;
  lang: string;
  profile_remaining_days: number;
  profile_reset_days?: number;
  profile_title: string;
  profile_url: string;
  profile_usage_current: number;
  profile_usage_total: number;
  speedtest_enable: boolean;
  telegram_bot_url: string;
  telegram_id?: number;
  telegram_proxy_enable: boolean;
}
