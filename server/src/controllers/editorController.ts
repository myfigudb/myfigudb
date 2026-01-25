import { RequestHandler } from 'express';
import { EditorService } from "../services/database/editorService.js";
import { CreateEditorDTO, toEditorDTO } from "../interfaces/dtos/entities/editor_dto.js";

const service = new EditorService();

export class EditorController {

    // Création
    create: RequestHandler<{}, any, CreateEditorDTO> = async (req, res) => {
        try {
            const editor = await service.createEditor(req.body);
            return res.status(201).json(toEditorDTO(editor));
        } catch (error) {
            console.error("Error creating editor:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // Récupération de tous les éditeurs
    findAll: RequestHandler = async (req, res) => {
        try {
            const editors = await service.getAllEditors(); // Assure-toi que cette méthode existe dans ton service
            const response = editors.map(editor => toEditorDTO(editor));
            return res.status(200).json(response);
        } catch (error) {
            console.error("Error getting all editors:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}