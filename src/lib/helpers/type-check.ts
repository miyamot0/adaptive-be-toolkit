/** is_undefined
 *
 * Check if a value is undefined
 *
 * @param {any} value
 * @returns {boolean}
 */
export function is_undefined<T>(value: T | undefined) {
  return value === undefined;
}
