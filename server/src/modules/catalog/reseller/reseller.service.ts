import { ResellerRepository } from "./reseller.repository.js";
import { CreateResellerDTO, UpdateResellerDTO } from "./reseller.dto.js";
import { Reseller } from "@db/client.js";

export class ResellerService {

    private repo = new ResellerRepository();

    async getResellerById(id: string): Promise<Reseller | null> {
        return this.repo.getById(id);
    }

    async getResellerByDomain(domain: string): Promise<Reseller | null> {
        return this.repo.getByDomain(domain);
    }

    async getResellerByName(name: string): Promise<Reseller | null> {
        return this.repo.getByName(name);
    }

    async getAllResellers(): Promise<Reseller[]> {
        return this.repo.getAll();
    }

    async createReseller(dto: CreateResellerDTO): Promise<Reseller> {
        return this.repo.create({
            domain: "", url: "", //TODO FIX SCHEMA
            name: dto.name
        });
    }

    async updateReseller(id: string, dto: UpdateResellerDTO): Promise<Reseller> {
        return this.repo.update(id, {
            name: dto.name
        });
    }

    async deleteReseller(id: string): Promise<Reseller> {
        return this.repo.delete(id);
    }

    async getResellerBySimilarityName(name: string, threshold: number = 0.3, limit: number = 5): Promise<Reseller[]> {
        return this.repo.getBySimilarityName(name, threshold, limit);
    }
}