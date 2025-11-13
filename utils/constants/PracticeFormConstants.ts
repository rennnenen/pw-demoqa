export const GENDER = ['Male', 'Female', 'Other'] as const;
export type Gender = (typeof GENDER)[number];

export const HOBBIES = ['Sports', 'Reading', 'Music'] as const;
export type Hobby = (typeof HOBBIES)[number];

export const SUBJECTS = [
  'Maths',
  'Accounting',
  'Arts',
  'Social Studies',
  'Computer Science',
  'Commerce',
  'Civics',
  'Economics',
  'Physics',
  'Chemistry',
  'Biology',
  'English',
  'History',
  'Hindi',
] as const;
export type Subject = (typeof SUBJECTS)[number];

export const STATES_AND_CITIES = [
  { state: 'NCR', city: ['Delhi', 'Gurgaon', 'Noida'] },
  { state: 'Uttar Pradesh', city: ['Agra', 'Lucknow', 'Merrut'] },
  { state: 'Haryana', city: ['Karnal', 'Panipat'] },
  { state: 'Rajasthan', city: ['Jaipur', 'Jodhpur'] },
] as const;
export const DOB_FORMAT = 'dd MMM yyyy' as const;
export type State = (typeof STATES_AND_CITIES)[number]['state'];
export type City = (typeof STATES_AND_CITIES)[number]['city'][number];
