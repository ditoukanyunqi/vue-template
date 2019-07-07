import { stringify } from '@fe/common-utils';
import request from '@/utils/request';

/**
 * @param {Object} param
 *
 */
export default async function example(param) {
  return request(`/api/v1/example?${stringify(param)}`, {
    method: 'get'
  });
}
