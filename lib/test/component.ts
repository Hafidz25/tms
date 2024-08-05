/**
 * Digunakan untuk mengimplementasikan `data-testId` 
 * secara dinamis dengan mudah. 
 * Menentukan `data-testId` secara hard-coded
 * pada componenet internal (parts), dapat
 * menyebabkan {@link https://en.wikipedia.org/wiki/False_positives_and_false_negatives#False_positive_error|false positive}.
 * @see {@link https://medium.com/@kavianrabbani/the-hidden-danger-of-hardcoded-data-testid-in-testing-8ec9e671955e}
 *
 * Attribute `test-id` akan dipasang sesuai dengan konteks (fitur)
 * yang diperlukan. Jika ingin menerapkan test id pada component tertentu,
 * maka ini harus dilakukan secara manual pada component parts.
 */
export type TestableComponent = {
  testable?: boolean;
};

/**
 * Digunakan untuk menghindari warning
 * pada react ketika menggunakan `testId`.
 */
export const TEST_ID_ATTRIBUTE = "data-test-id";

/**
 * Digunakan untuk menentukan property test pada component.
 * @param id digunakan untuk menentukan nilai id.
 * @param testable digunakan untuk menentukan pengembalian props.
 */
export function getTestableProps(
  testable: boolean,
  id: string,
): {} | { [TEST_ID_ATTRIBUTE]: string } {
  if (!testable) return {};
  return {
    [TEST_ID_ATTRIBUTE]: id,
  };
}
