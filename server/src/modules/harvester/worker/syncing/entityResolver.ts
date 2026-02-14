export interface EntityResolver<T, I = string> {
    /**
     * Cherche l'entité ou la crée.
     * @returns L'entité complète
     */
    resolve(input: I): Promise<T>;
}