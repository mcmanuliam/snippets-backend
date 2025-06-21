import {UserDocument} from '../src/models/user';

/** Pick specific fields to extend the User attribute in the Request interface */
export interface SessionUser extends Pick<UserDocument, '_id' | 'providerId' | 'username' | 'avatar'> {}
