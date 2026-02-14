import {Request, RequestHandler, Response} from 'express';
import {LicenseService} from "./license.service.js";
import {tr} from "zod/v4/locales/index.js";
import {CreateLicenseDTO, createLicenseSchema} from "./license.dto.js";
import {ParamsIdDTO, ParamsNameDTO} from "../../../core/dtos/params_dto.js";

const service = new LicenseService();

export class LicenseController {

    create: RequestHandler<{}, any, CreateLicenseDTO> = async (req, res) => {
        try {
            const license = await service.createLicense(req.body);
            return res.status(201).json(license);
        } catch (error) {
            console.error("Error creating license:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    delete: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;

            const license = await service.deleteLicense(id);

            if (!license) {
                return res.status(404).json({ message: "License not found" });
            }

            return res.status(204).json(license);

        } catch(error) {
            console.error("Error deleting licence:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    update: RequestHandler<ParamsIdDTO, any, CreateLicenseDTO> = async (req, res) => {
        try {
            const { id } = req.params;

            const license = await service.updateLicense(id, req.body);

            if (!license) {
                return res.status(404).json({ message: "License not found" });
            }

            return res.status(200).json(license)
        } catch(error) {
            console.error("Error update licence:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    findById: RequestHandler<ParamsIdDTO> = async (req, res) => {
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

    findByName: RequestHandler<ParamsNameDTO> = async (req, res) => {
        try {
            const { name } = req.params;

            const license = await service.getLicenseByName(name);

            if (!license) {
                return res.status(404).json({ message: "License not found" });
            }

            return res.status(200).json(license);

        } catch(error) {
            console.error("Error getting license by name:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    findAll: RequestHandler = async (req, res) => {
        try {
            const licenses = await service.getAllLicenses();
            return res.status(200).json(licenses);
        } catch (error) {
            console.error("Error getting all licenses with error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}