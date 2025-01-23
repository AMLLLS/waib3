import { ObjectId } from 'mongodb';

// Type pour les documents MongoDB avec _id optionnel
export type MongoDocument = {
  _id?: ObjectId;
};

// Type pour les documents MongoDB avec _id requis
export type MongoDocumentWithId = {
  _id: ObjectId;
};

// Type pour convertir un document MongoDB en document client
export type WithClientId<T extends MongoDocument> = Omit<T, '_id'> & {
  _id: string;
};

// Fonction pour convertir un ObjectId en string
export const toClientId = (id?: ObjectId): string => {
  return id?.toString() || '';
};

// Fonction pour convertir une string en ObjectId
export const toObjectId = (id: string): ObjectId => {
  return new ObjectId(id);
};

// Fonction pour convertir un document MongoDB en document client
export const toClientDocument = <T extends MongoDocument>(doc: T): WithClientId<T> => {
  if (!doc) return doc as WithClientId<T>;
  
  return {
    ...doc,
    _id: toClientId(doc._id)
  } as WithClientId<T>;
};

// Fonction pour convertir un tableau de documents MongoDB en documents client
export const toClientDocuments = <T extends MongoDocument>(docs: T[]): WithClientId<T>[] => {
  return docs.map(doc => toClientDocument(doc));
}; 