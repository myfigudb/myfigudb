import {Request, RequestHandler, Response} from 'express';
import {FigureService} from "../services/database/figure/figureService.js";


import {ParamsIdDTO, ParamsNameDTO} from "../interfaces/dtos/params_dto.js";
import {
    FigureInput,
    CreateFigureDTO,
    toFigureDTO
} from "../interfaces/dtos/entities/figure_dto.js";
import {FigureSearchDTO, FigureSearchQuery, figureSearchSchema} from "../interfaces/dtos/search_dto.js";

const service = new FigureService();

export class FigureController {

    create: RequestHandler<{}, any, CreateFigureDTO> = async (req, res) => {
        try {
            const figure = await service.createFigure(req.body);
            return res.status(201).json(toFigureDTO(figure as FigureInput));
        } catch (error) {
            console.error("Error creating figure:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    update: RequestHandler<ParamsIdDTO, any, CreateFigureDTO> = async (req, res) => {
        try {
            const { id } = req.params;
            const figure = await service.updateFigure(id, req.body);
            return res.status(200).json(toFigureDTO(figure as FigureInput));
        } catch(error) {
            console.error("Error updating figure:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    delete: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;
            await service.deleteFigure(id);
            // 204 No Content est le standard pour une suppression réussie
            return res.status(204).send();
        } catch(error) {
            console.error("Error deleting figure:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    findById: RequestHandler<ParamsIdDTO> = async (req, res) => {
        try {
            const { id } = req.params;
            const figure = await service.getFigureById(id);

            if (!figure) {
                return res.status(404).json({ message: "Figure not found" });
            }

            return res.status(200).json(toFigureDTO(figure as FigureInput));

        } catch(error) {
            console.error("Error getting figure by id:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    searchByName: RequestHandler<ParamsNameDTO> = async (req, res) => {
        try {
            const { name } = req.params;

            const figures = await service.getFigureBySimilarityName(name);

            if (!figures || figures.length === 0) {
                return res.status(404).json({ message: "No figures found" });
            }

            const response_data = figures.map(f => toFigureDTO(f as FigureInput));
            return res.status(200).json(response_data);

        } catch(error) {
            console.error("Error searching figure:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    findAll: RequestHandler = async (req, res) => {
        try {
            const figures = await service.getAllFigures();
            const response_data = figures.map(f => toFigureDTO(f as FigureInput));
            return res.status(200).json(response_data);
        } catch (error) {
            console.error("Error getting all figures:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    search: RequestHandler<{}, any, {}, FigureSearchQuery> = async (req, res) => {
        try {
            const result = await service.searchFigure(res.locals.dtos.query as FigureSearchDTO);
            return res.status(200).json(result);

        } catch (error) {
            console.error("CRASH VALIDATION:", error);
            return res.status(500).json({ message: "Internal Error" });
        }
    }
}