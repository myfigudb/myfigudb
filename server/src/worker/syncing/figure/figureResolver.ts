import { Figure } from '../../../generated/prisma/client.js';
import {EntityResolver} from "../entityResolver.js";
import {FigureScrapDTO} from "../../../interfaces/dtos/scrap_dto.js";
import {FigureService} from "../../../services/database/figureService.js";
import {MaterialResolver} from "./materialResolver.js";
import {CharacterResolver} from "./characterResolver.js";
import {RangeResolver} from "./rangeResolver.js";
import {EditorResolver} from "./editorResolver.js";


export class FigureResolver implements EntityResolver<Figure, FigureScrapDTO> {

    private cache = new Map<string, Figure>();

    constructor(
        private service: FigureService,

        private material_resolver: MaterialResolver,
        private character_resolver: CharacterResolver, //=> LicenseResolver
        private range_resolver: RangeResolver, //=> EditorResolver
        private editor_resolver: EditorResolver,
    ) {}

    async resolve(data: FigureScrapDTO): Promise<Figure> {
        const clean_name = data.name.trim();
        const cache_key = clean_name.toLowerCase();

        if (this.cache.has(cache_key)) return this.cache.get(cache_key)!;

        //TODO  getFigureByGTIN

        let entity = await this.service.getFigureByExactName(clean_name);

        if (!entity) {
            const candidates = await this.service.getFigureBySimilarityName(clean_name, 0.8, 1);
            entity = candidates[0];
        }

        if (!entity) {
            const { editor, range, materials, characters, ...figure_data } = data;

            const materials_entities = await Promise.all(
                materials.map((material) => this.material_resolver.resolve(material))
            );

            const characters_entities = await Promise.all(
                characters.map((character) => this.character_resolver.resolve(character))
            );

            let range_entity = undefined;
            if(range) range_entity = await this.range_resolver.resolve(range);

            const editor_entity = await this.editor_resolver.resolve(editor)


            entity = await this.service.createFigure({
                ...figure_data,
                name: clean_name,
                editor_id: editor_entity.id,
                range_id: range_entity?.id,
                materials: {
                    connect: materials_entities.map((m) => ({ id: m.id })),
                },
                characters: {
                    connect: characters_entities.map((c) => ({ id: c.id })),
                },
            });
        }

        this.cache.set(cache_key, entity);
        return entity;
    }
}