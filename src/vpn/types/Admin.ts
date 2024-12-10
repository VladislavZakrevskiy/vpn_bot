export interface Admin {
  can_add_admin: boolean;
  comment?: string;
  lang: 'en' | 'fa' | 'ru' | 'pt' | 'zh';
  max_active_users?: number;
  max_users?: number;
  mode: 'super_admin' | 'admin' | 'agent';
  name: string;
  parent_admin_uuid?: string;
  telegram_id?: number;
  uuid?: string;
}
