import { Router } from 'express';

import {TagController} from "./tag.controller.js";

const router = Router();
const controller = new TagController();



export default router;