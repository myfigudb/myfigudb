import {pclient} from "../../config/prisma.js";
import {Material, Prisma} from "../../generated/prisma/client.js";

export class MaterialService {

    /**
     * Retrieve a Material by its unique ID.
     */
    async getMaterialById(id: string): Promise<Material | null> {
        return pclient.material.findUnique({
            where: { id }
        });
    }

    /**
     * Retrieve all Materials.
     */
    async getAllMaterials(): Promise<Material[]> {
        return pclient.material.findMany();
    }

    /**
     * Create a new Material.
     */
    async createMaterial(data: Prisma.MaterialCreateInput): Promise<Material> {
        return pclient.material.create({
            data: data
        });
    }

    /**
     * Update an existing Material.
     */
    async updateMaterial(id: string, data: Prisma.MaterialUpdateInput): Promise<Material> {
        return pclient.material.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a Material.
     */
    async deleteMaterial(id: string): Promise<Material> {
        return pclient.material.delete({
            where: { id }
        });
    }
}