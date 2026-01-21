import { Request, Response } from 'express';
import {LicenseService} from "../services/LicenseService.js";

const service = new LicenseService();

export class LicenseController {

    async create(req: Request, res: Response) {
        try {
            const license = await service.createLicense(req.body);
            return res.status(201).json(license);
        } catch (error) {
            console.error("Error creating license:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async findById(req: Request<{ id: string }>, res: Response) {
        try {
            const { id } = req.params;

            const license = await service.getLicenseById(id);

            if (!license) {
                return res.status(404).json({ message: "License not found" });
            }

            return res.status(200).json(license);

        } catch(error) {
            console.error("Error getting license by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const licenses = await service.getAllLicenses();
            return res.status(200).json(licenses);
        } catch (error) {
            console.error("Error getting all licenses with error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}