import {pclient} from "../../core/config/prisma.js";

export class MediaService {

    async ensureMediaExists(hash: string, mimeType: string, folder: string) {
        return pclient.media.upsert({
            where: { hash },
            create: {
                hash,
                mimeType,
                folder,
                extension: mimeType.split('/')[1]
            },
            update: {}
        });
    }

    async deleteMedia(hash: string) {
        return pclient.media.delete({ where: { hash } });
    }
}