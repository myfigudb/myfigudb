import {pclient} from "../../config/prisma.js";
import {Figure, License, Material, Prisma} from "../../generated/prisma/client.js";

export class MaterialService {

    /**
     * Retrieve a Material by its unique Name.
     */
    async getMaterial(name: string): Promise<Material | null> {
        return pclient.material.findUnique({
            where: { name }
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
     * Update an existing Material using its Name.
     */
    async updateMaterial(name: string, data: Prisma.MaterialUpdateInput): Promise<Material> {
        return pclient.material.update({
            where: { name },
            data: data
        });
    }

    /**
     * Delete a Material using its Name.
     */
    async deleteMaterial(name: string): Promise<Material> {
        return pclient.material.delete({
            where: { name }
        });
    }

    /**
     * Find Material with exact name matching.
     * @param name
     */
    async getMaterialByExactName(name: string): Promise<Material| null> {
        return pclient.material.findFirst({
            where: {
                name: {
                    equals: name.trim(),
                    mode: 'insensitive'
                }
            }
        });
    }


    async getMaterialBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<Material[]> {
        return pclient.$queryRaw<Material[]>`
            SELECT *
            FROM "materials"
            WHERE similarity(name, ${name}) > ${threshold}
            LIMIT ${limit};
        `;
    }
}