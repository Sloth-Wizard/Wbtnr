export interface EpisodeModel {
    width: number;
    path: string;
    breakpoint: string;
};
export type Episode = Array<EpisodeModel>;
export type Episodes = Array<Episode>;

export interface EpisodeFoff {
    webtoon: string[]
    title: string
    num: number
}
export interface SerieFoff {
    title: string
    episodes: EpisodeFoff[]
}
export type SeriesFoff = SerieFoff[]
