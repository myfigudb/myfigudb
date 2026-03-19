import type { ApiFigure } from '../../api/types'
import {
    extractFigureImageUrls,
    getFigureCharacterLabel,
    getFigureEditorLabel,
    getFigureLicenseLabel,
    getFigureMinimumPriceLabel,
    getFigureReleaseDateLabel,
    getFigureResellers,
    getFigureScoreLabel,
    getFigureSeriesLabel,
    getFigureShortName,
    getFigureSizeLabel,
} from '../../utils/figurine'

export function getSearchResultsEmptyDescription(searchTerm: string) {
    return searchTerm.trim()
        ? `No API results matched "${searchTerm}".`
        : 'No figures are currently available from the API.'
}

export function toSearchCardFigure(figure: ApiFigure) {
    return {
        id: figure.id,
        name: figure.name,
        shortName: getFigureShortName(figure),
        character: getFigureCharacterLabel(figure),
        license: getFigureLicenseLabel(figure),
        imageUrl: extractFigureImageUrls(figure)[0] ?? null,
        scoreLabel: getFigureScoreLabel(figure),
        priceLabel: getFigureMinimumPriceLabel(figure),
    }
}

export function toSearchListFigure(figure: ApiFigure) {
    return {
        id: figure.id,
        name: figure.name,
        imageUrl: extractFigureImageUrls(figure)[0] ?? null,
        license: getFigureLicenseLabel(figure),
        character: getFigureCharacterLabel(figure),
        releaseDate: getFigureReleaseDateLabel(figure),
        scoreLabel: getFigureScoreLabel(figure),
        priceLabel: getFigureMinimumPriceLabel(figure),
        series: getFigureSeriesLabel(figure),
        editor: getFigureEditorLabel(figure),
        size: getFigureSizeLabel(figure),
        resellers: getFigureResellers(figure),
    }
}
