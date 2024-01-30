import { omit } from 'rambda';

// Tables
import { IUserInfo } from '../_shared/database/schema.ts';

export function formatUserInfo(model: IUserInfo) {
  return {
    ...omit(['idp_id'], model),
    email: model.emails.find((e) => e.type === 'primary')!.email,
    gender: model.gender,
    created_at: new Date(model.created_at).toJSON(),
    updated_at: new Date(model.updated_at).toJSON(),
  }
}