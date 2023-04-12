/*
 * @Author: Undercake
 * @Date: 2023-04-11 10:39:10
 * @LastEditTime: 2023-04-12 15:35:25
 * @FilePath: /ah-admin-vue/src/utils/type.d.ts
 * @Description:
 */

// ! 基础类型
interface url {
  [index: string]: string;
}

interface req_data {
  code: 0 | -1 | -2 | -3;
  message?: string;
}

// !权限相关
interface right {
  detail: string;
  icon: string;
  id: number;
  name: string;
  parent: number;
  path: string;
  sort: number;
  type: number;
  children: Array<right>;
}
interface rights extends req_data {
  rights: right[];
}

// ! 列表
interface list_dataset extends req_data {
  count: number;
  count_per_page: number;
  current_page: number;
  data: Array<any>;
}

// ! 客户相关
interface customer_service {
  contract_code: string;
  contract_path: string;
  create_time: string;
  customer_id: number;
  deleted: number;
  end_time: string;
  id: number;
  remark: string;
  start_time: string;
  type: number;
}

interface customer_services {
  [index: number]: customer_service[];
}

interface customer_addr {
  id: number;
  address: string;
  customer_id: number;
  area: number;
}

interface customer_list {
  black: number;
  create_time: string;
  del: number;
  id: number;
  last_modify: string;
  mobile: string;
  name: string;
  pinyin: string;
  pym: string;
  remark: string;
  total_count: number;
  total_money: string;
  type: number;
}

interface customer_dataset extends list_dataset {
  services: customer_services;
  addr: customer_addr[];
  data: customer_list[];
}

// ! 服务相关
interface service_category {
  id: number;
  name: string;
  sort: number;
  status: number;
}

interface service_option {
  deleted: number;
  id: number;
  image: string;
  min_num: number;
  name: string;
  price: string;
  price_intro: string;
  service_id: number;
  wai_num: number;
}

interface service {
  avatar: string;
  banner: string;
  class_id: number;
  deleted: number;
  details: string;
  id: number;
  intro: string;
  name: string;
  prompt: string;
  sort: number;
  status: 0 | 1;
}

interface remain extends req_data {
  data: number|string
}

interface req_service_category extends req_data {
  data: service_category[];
}
interface req_service_option extends req_data {
  data: service_option[];
}

interface service_dataset extends list_dataset {
  data: service[];
}

export {
  url,
  req_data,
  list_dataset,
  customer_list,
  customer_addr,
  customer_dataset,
  customer_services,
  customer_service,
  right,
  rights,
  service,
  service_category,
  service_option,
  service_dataset,
  req_service_category,
  req_service_option,
  remain
};
