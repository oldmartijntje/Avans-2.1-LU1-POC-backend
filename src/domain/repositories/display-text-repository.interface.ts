import { DisplayText } from '../entities/display-text.entity';

export const DISPLAY_TEXT_REPOSITORY = Symbol('IDisplayTextRepository');

export interface IDisplayTextRepository {
    findAll(): Promise<DisplayText[]>;
    findById(id: string): Promise<DisplayText | null>;
    findByUiKey(uiKey: string): Promise<DisplayText | null>;
    findByUiKeys(uiKeys: string[]): Promise<DisplayText[]>;
    create(displayText: Omit<DisplayText, 'id'>): Promise<DisplayText>;
    update(id: string, updates: Partial<Omit<DisplayText, 'id'>>): Promise<DisplayText | null>;
    massUpdate(updates: Array<{ id: string; updates: Partial<Omit<DisplayText, 'id'>> }>): Promise<DisplayText[]>;
    delete(id: string): Promise<boolean>;
    findUnused(): Promise<DisplayText[]>;
    deleteDuplicates(): Promise<void>;
}
