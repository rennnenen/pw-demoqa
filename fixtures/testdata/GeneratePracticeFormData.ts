import { faker } from '@faker-js/faker';
import { format } from 'date-fns';
import { PracticeForm } from '@utils/interfaces/PracticeFormInterface';
import {
  City,
  DOB_FORMAT,
  Gender,
  GENDER,
  HOBBIES,
  Hobby,
  State,
  STATES_AND_CITIES,
  Subject,
  SUBJECTS,
} from '@utils/constants/PracticeFormConstants';
import { EMAIL_PROVIDER } from '@utils/constants/GlobalConstants';
import path from 'path';

/**
 * Utility class that generates realistic test data for the PracticeForm model.
 *
 * @examples
 * - GeneratePracticeFormData.completeData() -> a full PracticeForm object ready for submission.
 * - GeneratePracticeFormData.requiredData() -> an object containing only required fields.
 * - GeneratePracticeFormData.mobile(5) -> returns a 5-digit numeric string.
 *
 */
export class GeneratePracticeFormData {
  static completeData(): PracticeForm {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      firstName,
      lastName,
      email: faker.internet.email({
        firstName,
        lastName,
        provider: EMAIL_PROVIDER,
      }),
      gender: GeneratePracticeFormData.gender(),
      mobile: GeneratePracticeFormData.mobile(),
      dateOfBirth: GeneratePracticeFormData.dateOfBirth(),
      subjects: GeneratePracticeFormData.subjects(),
      hobbies: GeneratePracticeFormData.hobbies(),
      picture: path.join(__dirname, '../../tests/assets/image.png'),
      address: faker.location.streetAddress(),
      ...GeneratePracticeFormData.stateAndCity(),
    };
  }

  static requiredData(): Partial<PracticeForm> {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      firstName,
      lastName,
      mobile: GeneratePracticeFormData.mobile(),
      gender: GeneratePracticeFormData.gender(),
    };
  }

  static invalidData(): Partial<PracticeForm> {
    return {
      ...GeneratePracticeFormData.requiredData(),
      mobile: GeneratePracticeFormData.mobile(5), // Only testing less than required length unable to input greater than 10 digits
      email: 'invalid-email',
    };
  }

  static gender(): Gender {
    return faker.helpers.arrayElement(GENDER);
  }

  static mobile(length: number = 10): string {
    return faker.string.numeric({ length });
  }

  static dateOfBirth(): string {
    return format(
      faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
      DOB_FORMAT
    );
  }

  static subjects(): Subject[] {
    return faker.helpers.arrayElements(SUBJECTS);
  }

  static hobbies(): Hobby[] {
    return faker.helpers.arrayElements(HOBBIES);
  }

  static stateAndCity(): { state: State; city: City } {
    const state = faker.helpers.arrayElement(STATES_AND_CITIES);
    const city = faker.helpers.arrayElement(state.city);
    return { state: state.state, city };
  }
}
