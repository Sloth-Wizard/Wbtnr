import { BREAKPOINTS } from '../../../config/conf';
import jsonData from '../../../data/data.json';
import { Breakpoints } from '../../../models/breakpoint.model';
import { Episodes, Episode, EpisodeModel } from '../../../models/episodes.model';

const L_BP: Breakpoints = BREAKPOINTS;
const BURL: string = 'https://www.liberation.fr/';

export class Scanner {
    /**
     * Scan for images to display in the reader
     * It orders them in "episodes" to display
     * This one uses a given set of data from a json
     * Made for https://www.liberation.fr/
     * 
     * @returns An array of episodes
     */
    scan(): Episodes[] | undefined {
        let result: Episodes[] = [];
        jsonData.episodes.forEach((el): undefined | void => {
            let episode = el.content_elements;
            if (episode) {
                let trEp: Episode[] = [];
                for (let e of episode) {
                    if (e.type === 'image') {
                        let t: EpisodeModel[] = [];
                        L_BP.forEach(lpb => {
                            const key_typed = lpb.l_key as keyof typeof e.resized_params;
                            const k_str: string = e.resized_params![key_typed];
                            const t_path: string[] = k_str.split('=filters', 2);
                            const f_path: string = BURL+'resizer/'+t_path[0]+'=/'+key_typed+'/filters'+t_path[1]+e.url!.replace(/(^\w+:|^)\/\//, '');

                            t.push(Object.assign({}, {width: lpb.width, path: f_path, breakpoint: lpb.l_key}));
                        });

                        trEp.push(t);
                    }
                }
                
                if (trEp.length > 0) result.push(trEp);
                else return undefined;
            } else return undefined;
        });

        if (result.length > 0) return result;
        else return undefined;
    }
}
