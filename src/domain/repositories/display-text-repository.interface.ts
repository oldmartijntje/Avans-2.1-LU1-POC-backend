import { DisplayText } from '../entities/display-text.entity';

export const DISPLAY_TEXT_REPOSITORY = Symbol('IDisplayTextRepository');

export interface IDisplayTextRepository {
    findAll(): Promise<any[]>; // Returns raw Mongoose documents
    findById(id: string): Promise<any | null>; // Returns raw Mongoose document
    findByUiKey(uiKey: string): Promise<any | null>; // Returns raw Mongoose document
    findByUiKeys(uiKeys: string[]): Promise<any[]>; // Returns raw Mongoose documents
    findByTranslations(dutch: string, english: string): Promise<any | null>; // Returns raw Mongoose document
    create(displayText: Omit<DisplayText, 'id'>): Promise<any>; // Returns raw Mongoose document
    update(id: string, updates: Partial<Omit<DisplayText, 'id'>>): Promise<any | null>; // Returns raw Mongoose document
    massUpdate(updates: Array<{ id: string; updates: Partial<Omit<DisplayText, 'id'>> }>): Promise<any[]>; // Returns raw Mongoose documents
    delete(id: string): Promise<boolean>;
    findUnused(): Promise<any[]>; // Returns raw Mongoose documents
    deleteDuplicates(): Promise<void>;
}
