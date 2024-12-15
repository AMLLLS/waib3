import { chapitre as chapitre1 } from './chapitre-1';

export const chapitres = [chapitre1];

export const getFormation = (chapterId: number, formationId: number) => {
  const chapter = chapitres.find(c => c.id === chapterId);
  if (!chapter) return null;
  
  return chapter.formations.find(f => f.id === formationId);
}; 