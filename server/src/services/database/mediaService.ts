import {pclient} from "../../config/prisma.js";

export class MediaService {

    async ensureMediaExists(hash: string, mime_type: string, folder: string) {
        return pclient.media.upsert({
            where: { hash },
            create: {
                hash,
                mime_type,
                folder,
                extension: mime_type.split('/')[1]
            },
            update: {}
        });
    }

    async deleteMedia(hash: string) {
        return pclient.media.delete({ where: { hash } });
    }
}