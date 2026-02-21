import { CharacterRepository } from "./character.repository.js";
import {CreateCharacterDTO, CharacterInput, UpdateCharacterDTO} from "./character.dto.js";
import {Character, Prisma} from "@db/client.js";

export class CharacterService {

    private repo = new CharacterRepository();

    async getCharacterById(id: string): Promise<Character| null> {
        return this.repo.getById(id);
    }

    async getAllCharacters(): Promise<Character[]> {
        return this.repo.getAll();
    }

    async getCharacterByName(name: string): Promise<Character[] | null> {
        return this.repo.getByName(name);
    }

    async createCharacter(dto: CreateCharacterDTO): Promise<Character> {
        return this.repo.create({
            name: dto.name,
            licenseId: dto.licenseId
        });
    }

    async updateCharacter(id: string, dto: UpdateCharacterDTO): Promise<Character> {
        return this.repo.update(id, dto);
    }

    async deleteCharacter(id: string): Promise<Character> {
        return this.repo.delete(id);
    }

    async existsCharacter(id: string): Promise<boolean> {
        return this.repo.exists(id);
    }

    async getCharacterBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Character[]> {
        return this.repo.getBySimilarityName(name, threshold, limit);
    }

    async attachMedias(id: string, media_hashes: string[]): Promise<Character> {
        return this.repo.attachMedias(id, media_hashes);
    }
}