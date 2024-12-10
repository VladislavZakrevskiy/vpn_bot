export interface ConfigAPI {
  domain: string;
  link: string;
  name: string;
  protocol: string;
  security: string;
  transport: string;
  type: string;
}

export interface Install {
  title: string;
  type: string;
  url: string;
}

export interface AppAPI {
  deeplink: string;
  description: string;
  guide_url: string;
  icon_url: string;
  install: Install[];
  title: string;
}

export interface InfoAPI {
  admin_message_html: string;
  admin_message_url: string;
  brand_icon_url: string;
  brand_title: string;
  doh: string;
  lang: string;
  profile_remaining_days: number;
  profile_reset_days: number;
  profile_title: string;
  profile_url: string;
  profile_usage_current: number;
  profile_usage_total: number;
  speedtest_enable: boolean;
  telegram_bot_url: string;
  telegram_id: number;
  telegram_proxy_enable: boolean;
}

export interface MTProxiesAPI {
  link: string;
  title: string;
}

export interface ShortAPI {
  expire_in: number;
  full_url: string;
  short: string;
}
