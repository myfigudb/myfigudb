import {TagRepository} from "./tag.repository.js";
import {UserRepository} from "../user/user.repository.js";

import {VoteTagDTO} from "./tag.dto.js";
import {FigureTag, FigureTagVote} from "../../generated/prisma/client.js";

import jwt from "jsonwebtoken";


interface SurveyPayload {
    surveyId: string; //figure tag id
    userId: string;
}

interface Survey {
    token: string;
    figureTag: FigureTag;
}

export class TagSurveyService {

    private repo = new TagRepository();
    private userRepo = new UserRepository();

    /**
     * Finds a random pending tag for the user to vote on.
     */
    async getTagValidationSurvey(userId: string): Promise<Survey | null> {
        const count = await this.repo.countPendingForUser(userId);
        if (count === 0) return null;

        const rdmIndex = Math.floor(Math.random() * count);
        const survey = await this.repo.findRandomPendingForUser(userId, rdmIndex);

        if (!survey) return null;

        const payload: SurveyPayload = {
            surveyId: survey.id,
            userId: userId
        };

        const secretKey = process.env.JWT_TRIAL_SECRET || 'default_secret_key'
        const token = jwt.sign(payload, secretKey, { expiresIn: '15m' });

        return {
            token: token,
            figureTag: survey
        };
    }

    /**
     * Registers a vote with weighted power based on User XP.
     */
    async voteOnTag(userId: string, figureTagId: string, dto: VoteTagDTO): Promise<FigureTagVote> {
        const user = await this.userRepo.getById(userId);
        if (!user) throw new Error("User not found");

        const weight = this.calculateWeight(user.exp || 0, dto.vote);

        return this.repo.upsertVote({
            figureTagId,
            userId,
            weight
        });
    }

    /**
     * Internal logic for weight calculation.
     */
    private calculateWeight(exp: number, vote: boolean): number {
        //TODO ENV VARIABLES

        const VOTE_BASE = 50;
        const VOTE_MULTIPLIER = 30;

        const factor = Math.log(exp + 1);
        const rawWeight = VOTE_BASE + (factor * VOTE_MULTIPLIER);
        const baseWeight = Math.round(rawWeight);

        return vote ? baseWeight : -baseWeight;
    }
}


