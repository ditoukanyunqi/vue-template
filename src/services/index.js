import request from '@/src/utils/request';
import { stringify } from '@fe/common-utils';

export async function example(param) {
  return request(`/api/v1/${projectCode}/example?${stringify(param)}`, {
    method: 'get'
  });
}
