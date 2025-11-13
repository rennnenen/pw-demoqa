import { WebtableRecord } from '@utils/interfaces/WebtableRecordInterface';
import { faker } from '@faker-js/faker';
import { EMAIL_PROVIDER } from '@utils/constants/GlobalConstants';

/**
 *
 * Utility class that produces realistic (and deliberately invalid) test data for a WebtableRecord.
 * All generators return strings to match the expected payload format used by the system under test.
 *
 * @example
 * const record = GenerateWebtableData.validData();
 * // record.age -> "27"
 * // record.salary -> "42000"
 */
export class GenerateWebtableData {
  static validData(): WebtableRecord {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      firstName,
      lastName,
      age: faker.number.int({ min: 18, max: 99 }).toString(),
      email: faker.internet.email({
        firstName,
        lastName,
        provider: EMAIL_PROVIDER,
      }),
      salary: GenerateWebtableData.salary(),
      department: GenerateWebtableData.department(),
    };
  }

  static salary(): string {
    return faker.number
      .int({ min: 10000, max: 999999, multipleOf: 1000 })
      .toString();
  }

  static department(): string {
    return faker.commerce.department();
  }

  static invalidValues(): Partial<WebtableRecord> {
    return {
      email: 'invalid-email',
      age: 'invalid-age',
      salary: 'invalid-salary',
    };
  }
}
