import {
  EmailAuth,
  SocialAccount,
  User,
  UserProfile,
} from './models';

export default function sync() {
  // configure relation
  UserProfile.associate();
  SocialAccount.associate();

  // sync Models
  User.sync();
  UserProfile.sync();
  SocialAccount.sync();
  EmailAuth.sync();
}
