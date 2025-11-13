import {
  City,
  Gender,
  Hobby,
  State,
  Subject,
} from '@utils/constants/PracticeFormConstants';

export interface PracticeForm {
  firstName: string;
  lastName: string;
  email: string;
  gender: Gender;
  mobile: string;
  dateOfBirth: string;
  subjects: Subject[];
  hobbies: Hobby[];
  picture: string;
  address: string;
  state: State;
  city: City;
}
