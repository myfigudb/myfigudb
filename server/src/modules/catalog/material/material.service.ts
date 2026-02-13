import { MaterialRepository } from "./material.repository.js";
import { Material } from "../../../generated/prisma/client.js";
import {CreateMaterialDTO, UpdateMaterialDTO} from "./material.dto.js";

export class MaterialService {

    private repo = new MaterialRepository();

    /**
     * Retrieve a Material by its unique Name.
     */
    async getMaterial(name: string): Promise<Material | null> {
        return this.repo.getByName(name);
    }

    /**
     * Retrieve all Materials.
     */
    async getAllMaterials(): Promise<Material[]> {
        return this.repo.getAll();
    }

    /**
     * Create a new Material.
     */
    async createMaterial(dto: CreateMaterialDTO): Promise<Material> {
        return this.repo.create({
            name: dto.name
        });
    }

    /**
     * Update an existing Material using its Name.
     */
    async updateMaterial(name: string, dto: UpdateMaterialDTO): Promise<Material> {
        return this.repo.update(name, {
            name: dto.name
        });
    }

    /**
     * Delete a Material using its Name.
     */
    async deleteMaterial(name: string): Promise<Material> {
        return this.repo.delete(name);
    }


    async getMaterialBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Material[]> {
        return this.repo.getBySimilarityName(name, threshold, limit);
    }
}