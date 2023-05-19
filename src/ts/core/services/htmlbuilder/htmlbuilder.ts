import { Episode } from "../../../models/episodes.model";

// Default image in base64, this is not the lightest one but the most stable
const DB64I: string = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export class HtmlBuilder {
    /**
     * Build the back button
     * 
     * @returns string
     */
    back() {
        return '<div class="wbtnr__reader--back"><button class="wbtnr__reader--back-link _wbtnr_btn_back"><i class="icon icon--arrow "><svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="191px" height="295.6px" viewBox="0 0 191 295.6" overflow="visible" xml:space="preserve"><defs></defs><path fill-rule="evenodd" d="M0,147.8L147.8,0L191,43.1L86.3,147.8L191,252.5l-43.1,43.1L0,147.8"></path></svg></i></button></div>';
    }

    /**
     * Build the progressbar
     * 
     * @param from_nav
     * @returns string
     */
    progressbar(from_nav: boolean = false) {
        if (from_nav === true) return '<div class="wbtnr__reader--progressbar _wbtnr_prgsbr hide"><span class="_wbtnr_track" style="width: 0%;" data-pos="0"></span></div>';
        else return '<div class="wbtnr__reader--progressbar _wbtnr_prgsbr"><span class="_wbtnr_track" style="width: 0%;" data-pos="0"></span></div>';
    }

    /**
     * Build the reader
     * 
     * @param images
     * @param breakpoints
     * @param from_nav
     * @returns string
     */
    reader(images: Episode[], from_nav: boolean = false) {
        let html: string;
        
        if (from_nav === true) html = '<div class="wbtnr__reader--episode _wbtnr_ep hide">';
        else html = '<div class="wbtnr__reader--episode _wbtnr_ep">';

        for (let image of images) {
            html += '<figure><div class="inner"><picture class="wbtnr__reader--episode--picture">';
            
            for (let i_data of image) {
                html += `<source srcset="${i_data.path}" media="screen and (min-width: ${i_data.width}px)">`;
            }

            const _bp: string[] = image[0].breakpoint.split('x', 2);
            html += `<img class="_wbtnr_jlzy" src="${DB64I}" data-src="${image[0].path}" width="${_bp[0]}" height="${_bp[1]}" loading="lazy">`;
            html += '</picture></div></figure>';
        }

        html += '</div>';

        return html;
    }

    /**
     * Create the navigation
     * 
     * @returns string
     */
    navigation() {
        return '<div class="wbtnr__reader--nav _wbtnr_rnav"><button class="previous _wbtnr_prev"><span>Épisode précédent</span></button><button class="next _wbtnr_next"><span>Épisode suivant</span></button></div>';
    }
}
