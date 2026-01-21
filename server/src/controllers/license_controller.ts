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

    async findById(req: Request, res: Response) {
        try{
            const license = await service.getLicenseById(req.body);
            return res.status(200).json(license);
        }catch(error){
            console.error("Error getting all liscenses by id with error:", error);
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