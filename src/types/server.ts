import { ObjectId } from 'mongodb';

export type WithMongoId<T> = Omit<T, '_id'> & {
  _id: ObjectId;
};

export type WithClientId<T> = T & {
  _id: string;
};

export function toMongoId(id: string | ObjectId | undefined): ObjectId | undefined {
  if (!id) return undefined;
  if (id instanceof ObjectId) return id;
  if (typeof id === 'string' && ObjectId.isValid(id)) return new ObjectId(id);
  return undefined;
}

export function toClientId(id: ObjectId | string | undefined): string | undefined {
  if (!id) return undefined;
  return id.toString();
}

export function toMongoDocument<T>(doc: WithClientId<T>): WithMongoId<T> {
  const { _id, ...rest } = doc;
  const mongoId = toMongoId(_id);
  if (!mongoId) throw new Error('Invalid ObjectId');
  return {
    ...rest,
    _id: mongoId,
  } as WithMongoId<T>;
}

export function toClientDocument<T>(doc: WithMongoId<T>): WithClientId<T> {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id.toString(),
  } as WithClientId<T>;
} 