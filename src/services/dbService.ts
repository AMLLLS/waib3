import { Db, MongoClient, ObjectId, Filter, Document } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { WithMongoId, WithClientId } from '@/types/server';
import { Chapter, Formation } from '@/types/models';

export class DbService {
  private static db: Db | null = null;

  static async getDb(): Promise<Db> {
    if (!this.db) {
      const { db } = await connectToDatabase();
      this.db = db;
    }
    return this.db;
  }

  static toObjectId(id: string | ObjectId | undefined): ObjectId | undefined {
    if (!id) return undefined;
    if (id instanceof ObjectId) return id;
    if (typeof id === 'string' && ObjectId.isValid(id)) return new ObjectId(id);
    return undefined;
  }

  static toFilter<T>(query: Partial<T>): Filter<Document> {
    const filter: any = {};
    for (const [key, value] of Object.entries(query)) {
      if (key === '_id' || key.endsWith('Id')) {
        if (value instanceof ObjectId) {
          filter[key] = value;
        } else if (typeof value === 'string' && ObjectId.isValid(value)) {
          filter[key] = new ObjectId(value);
        } else if (Array.isArray(value)) {
          filter[key] = { $in: value.map(id => this.toObjectId(id)).filter(Boolean) };
        }
      } else {
        filter[key] = value;
      }
    }
    return filter;
  }

  static toClientDocument<T>(doc: WithMongoId<T>): WithClientId<T> {
    const { _id, ...rest } = doc;
    return {
      ...rest,
      _id: _id.toString()
    } as WithClientId<T>;
  }

  static toMongoDocument<T>(doc: WithClientId<T>): WithMongoId<T> {
    const { _id, ...rest } = doc;
    return {
      ...rest,
      _id: this.toObjectId(_id)!
    } as WithMongoId<T>;
  }
}

export class ChapterService extends DbService {
  static async getAllChapters(): Promise<WithClientId<Chapter>[]> {
    const db = await this.getDb();
    const chapters = await db.collection('chapters').find().toArray();
    return chapters.map(chapter => this.toClientDocument(chapter as WithMongoId<Chapter>));
  }

  static async getChapterById(id: string): Promise<WithClientId<Chapter> | null> {
    const db = await this.getDb();
    const chapter = await db.collection('chapters').findOne({ _id: this.toObjectId(id) });
    return chapter ? this.toClientDocument(chapter as WithMongoId<Chapter>) : null;
  }

  static async createChapter(chapter: Omit<Chapter, '_id'>): Promise<WithClientId<Chapter>> {
    const db = await this.getDb();
    const result = await db.collection('chapters').insertOne(chapter);
    return this.toClientDocument({ ...chapter, _id: result.insertedId } as WithMongoId<Chapter>);
  }

  static async updateChapter(id: string, chapter: Partial<Chapter>): Promise<WithClientId<Chapter> | null> {
    const db = await this.getDb();
    const result = await db.collection('chapters').findOneAndUpdate(
      { _id: this.toObjectId(id) },
      { $set: chapter },
      { returnDocument: 'after' }
    );
    return result?.value ? this.toClientDocument(result.value as WithMongoId<Chapter>) : null;
  }

  static async deleteChapter(id: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.collection('chapters').deleteOne({ _id: this.toObjectId(id) });
    return result.deletedCount > 0;
  }
}

export class FormationService extends DbService {
  static async getAllFormations(): Promise<WithClientId<Formation>[]> {
    try {
      console.log('Getting all formations...');
      const db = await this.getDb();
      console.log('Connected to database');
      
      const formations = await db.collection('formations').find().toArray();
      console.log('Formations found:', formations.length);
      
      const mappedFormations = formations.map(formation => this.toClientDocument(formation as WithMongoId<Formation>));
      console.log('Formations mapped:', mappedFormations.length);
      
      return mappedFormations;
    } catch (error) {
      console.error('Error in getAllFormations:', error);
      throw error;
    }
  }

  static async getFormationById(id: string): Promise<WithClientId<Formation> | null> {
    const db = await this.getDb();
    const formation = await db.collection('formations').findOne({ _id: this.toObjectId(id) });
    return formation ? this.toClientDocument(formation as WithMongoId<Formation>) : null;
  }

  static async createFormation(formation: Omit<Formation, '_id'>): Promise<WithClientId<Formation>> {
    const db = await this.getDb();
    const result = await db.collection('formations').insertOne(formation);
    return this.toClientDocument({ ...formation, _id: result.insertedId } as WithMongoId<Formation>);
  }

  static async updateFormation(id: string, formation: Partial<Formation>): Promise<WithClientId<Formation> | null> {
    const db = await this.getDb();
    const { _id, ...updateData } = formation;
    const result = await db.collection('formations').findOneAndUpdate(
      { _id: this.toObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result?.value ? this.toClientDocument(result.value as WithMongoId<Formation>) : null;
  }

  static async deleteFormation(id: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.collection('formations').deleteOne({ _id: this.toObjectId(id) });
    return result.deletedCount > 0;
  }

  static async getFormationsByChapterId(chapterId: string): Promise<WithClientId<Formation>[]> {
    const db = await this.getDb();
    const formations = await db.collection('formations').find({ chapterId: this.toObjectId(chapterId) }).toArray();
    return formations.map(formation => this.toClientDocument(formation as WithMongoId<Formation>));
  }
} 