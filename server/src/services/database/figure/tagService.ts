import { pclient } from "../../../config/prisma.js";
import {Tag, Prisma, FigureTag, FigureTagStatus, FigureTagVote} from "../../../generated/prisma/client.js";
import {UserService} from "./userService.js";

export class TagService {

    private user_service = new UserService();

    /**
     * Retrieve a Tag by its unique ID.
     */
    async getTagById(id: string): Promise<Tag | null> {
        return pclient.tag.findUnique({
            where: { id }
        });
    }

    /**
     * Get all tags available in the database.
     */
    async getAllTags(): Promise<Tag[]> {
        return pclient.tag.findMany({
            orderBy: { label: 'asc' }
        });
    }

    /**
     * Create a new tag.
     * The label is cleaned (trimmed) before insertion.
     */
    async createTag(data: Prisma.TagCreateInput): Promise<Tag> {
        return pclient.tag.create({
            data : data
        });
    }

    /**
     * Update a tag label.
     */
    async updateTag(id: string, data: Prisma.TagUpdateInput): Promise<Tag> {
        return pclient.tag.update({
            where: { id },
            data: data
        });
    }

    /**
     * Delete a tag from the reference table.
     */
    async deleteTag(id: string): Promise<Tag> {
        return pclient.tag.delete({
            where: { id }
        });
    }

    /**
     * Check if a tag exists by its label (case insensitive).
     */
    async existsTag(label: string): Promise<boolean> {
        const count = await pclient.tag.count({
            where: {
                label: {
                    equals: label.trim(),
                    mode: 'insensitive'
                }
            }
        });
        return count > 0;
    }

    /**
     * Find tags with similar names using trigram similarity (PostgreSQL pg_trgm).
     *
     * IMPORTANT : We use strict SQL here, so we must use the database table name ("tag"),
     * defined in {@link ../../prisma/schema/catalog.prisma catalog.prisma} via @@map("tag")
     *
     * @param label          Name to search
     * @param threshold     Trigger threshold (default: 0.3)
     * @param limit         Number of results to return (default: 5)
     */
    async getTagsBySimilarity(label: string, threshold: number = 0.3, limit: number = 10): Promise<Tag[]> {
        return pclient.$queryRaw<Tag[]>`
            SELECT *
            FROM "tag"
            WHERE similarity(label, ${label}) > ${threshold}
            ORDER BY similarity(label, ${label}) DESC
            LIMIT ${limit};
        `;
    }

    /**
     * Search tags by exact label.
     */
    async getTagByLabel(label: string): Promise<Tag | null> {
        return pclient.tag.findUnique({
            where: { label: label.trim() }
        });
    }

    /**
     * Search tags that start with a specific string.
     * Used for autocomplete when a user is typing a new tag.
     *
     * @param prefix The beginning of the tag label
     * @param limit  Maximum number of suggestions
     */
    async getTagsStartingWith(prefix: string, limit: number = 10): Promise<Tag[]> {
        return pclient.tag.findMany({
            where: {
                label: {
                    startsWith: prefix.trim(),
                    mode: 'insensitive'
                }
            },
            take: limit,
            orderBy: {
                label: 'asc'
            }
        });
    }


    //FIGURE TAG
    async getTagValidationSurvey(user_id: string): Promise<FigureTag | null> {
        const filter = {
            status: 'PENDING' as FigureTagStatus,
            added_by: { not: user_id },
            votes: {
                none: { voted_by: user_id }
            }
        };

        const count = await pclient.figureTag.count({ where: filter });

        if (count === 0) return null;

        const rdm_index = Math.floor(Math.random() * count);

        return pclient.figureTag.findFirst({
            where: filter,
            skip: rdm_index,
            include: {
                tag: true,
                figure: true
            }
        });
    }


    async registerTagValidationVote(user_id: string, figure_tag_id: string, vote: boolean): Promise<FigureTagVote> {

        const user_exp = await this.user_service.getUserExp(user_id);

        const weight = this.calculateWeight(user_exp, vote);

        return pclient.figureTagVote.upsert({
            where: {
                figure_tag_id_voted_by: {
                    figure_tag_id: figure_tag_id,
                    voted_by: user_id
                }
            },
            update: {
                weight: weight
            },
            create: {
                figure_tag_id: figure_tag_id,
                voted_by: user_id,
                weight: weight
            }
        });
    }

    private calculateWeight(exp: number, vote: boolean): number {
        const VOTE_BASE = 50;
        const VOTE_MULTIPLIER = 30;

        const factor = Math.log(exp + 1);
        const raw_weight = VOTE_BASE + (factor * VOTE_MULTIPLIER);
        const base_weight = Math.round(raw_weight);

        return vote ? base_weight : -base_weight;
    }
}