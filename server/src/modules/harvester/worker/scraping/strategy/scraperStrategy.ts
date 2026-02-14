import {FigurePageScrapDTO, FigureScrapDTO} from "../../../../../core/dtos/scrap_dto.js";


export interface ScraperStrategy {
    /**
     * Vérifie si cette stratégie peut gérer ce domaine
     */
    canHandle(domain: string): boolean;

    /**
     * Extrait les données
     */
    extract(url: string, html: string): FigurePageScrapDTO | null;
}