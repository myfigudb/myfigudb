import { LicenseRepository } from "./license.repository.js";
import { CreateLicenseDTO, UpdateLicenseDTO } from "./license.dto.js";

import { License } from "../../../generated/prisma/client.js";

export class LicenseService {

    private repo = new LicenseRepository();

    async getLicenseById(id: string): Promise<License | null> {
        return this.repo.getById(id);
    }

    async getAllLicenses(): Promise<License[]> {
        return this.repo.getAll();
    }

    async getLicenseByName(name: string): Promise<License | null> {
        return this.repo.getByName(name);
    }

    async createLicense(dto: CreateLicenseDTO): Promise<License> {
        return this.repo.create({
            name: dto.name
        });
    }

    async updateLicense(id: string, dto: UpdateLicenseDTO): Promise<License> {
        return this.repo.update(id, {
            name: dto.name
        });
    }

    async deleteLicense(id: string): Promise<License> {
        return this.repo.delete(id);
    }


    async getLicenseBySimilarityName(name: string, threshold: number = 0.3, limit: number = 1): Promise<License[]> {
        return this.repo.getBySimilarityName(name, threshold, limit);
    }
}