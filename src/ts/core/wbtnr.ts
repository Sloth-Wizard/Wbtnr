import { HTML, LS_KEY, WBTNR_CONTAINER } from '../config/conf';

import { Episodes } from '../models/episodes.model';
import { Navigation } from '../models/navigation.model';
import { LocalStorageData } from '../models/localstorage.model';

import { Scanner } from './services/scanner/scanner';
import { HtmlBuilder } from './services/htmlbuilder/htmlbuilder';
import { Lazyloading } from './services/lazyloading/lazyloading';
import { Progressbar } from './services/progressbar/progressbar';

import { Toolbox } from '../tools/toolbox';

export class Wbtnr {
    scanner!: Scanner;
    html_builder!: HtmlBuilder;
    lazyloader!: Lazyloading;
    progressbar!: Progressbar;
    toolbox!: Toolbox;

    local_storage_data!: LocalStorageData;
    
    html_template!: string;
    episodes!: Episodes[] | undefined;
    
    constructor() {
        if (WBTNR_CONTAINER) {
            this.scanner = new Scanner();
            this.html_builder = new HtmlBuilder();
            this.lazyloader = new Lazyloading();
            this.progressbar = new Progressbar();
            this.toolbox = new Toolbox();

            this.reader('manual', true);
        } else console.error('No anchor point');
    }

    /**
     * Initialize the reader
     * 
     * @param trigger // Can be manual or automatic, if manual you will need to add a button to your html
     * @param navigation // If set to true, it will generate a navigation to use beteween episodes, leave default if only using on a single ep
     * @returns boolean|void
     */
    reader(trigger: string = 'automatic', navigation: boolean = false): boolean | void {
        this.episodes = this.scanner.scan();
        
        if (this.episodes) {
            if (trigger === 'manual') { // Button click to open readeer
                let btn: HTMLElement = HTML.querySelector('._wbtnr_trr')!;
                btn.addEventListener('click', (e) => {
                    e.preventDefault(), e.stopPropagation();
                    this.open_reader(navigation);
                });
            } else { // Opens with timeout
                setTimeout(() => {
                    this.open_reader(navigation);
                }, 550);
            }
        } else return false;
    }

    /**
     * Open the reader, build it if it's opening the 1st time
     * 
     * @param episodes
     * @param navigation
     * @returns void
     */
    open_reader(navigation: boolean): void {
        let show = () => {
            // Hide the content
            HTML.classList.add('active-reader');
            
            // Then show the reader
            if (!WBTNR_CONTAINER!.classList.contains('show')) {
                setTimeout(() => {
                    WBTNR_CONTAINER!.classList.add('show');
                    // Then listen to scrolling for progressbar
                    this.progressbar.listen(WBTNR_CONTAINER!.querySelector('._wbtnr_track')!, WBTNR_CONTAINER!.querySelector('._wbtnr_ep')!);
                }, 451);
            }
        }

        // Check what episode we are on in localStorage (if none, start at 0 by default)
        let ls_data: string = localStorage.getItem(LS_KEY)!;
        let _ls: {};
        if (!ls_data) { // Means we never had a localStorage set before, so init to 0
            _ls = {active_episode: 0, total_episodes: this.episodes!.length};
        } else { // Update the total of episodes
            let _lsd: LocalStorageData = JSON.parse(ls_data);
            let _ae: number;
            let _nbe: number = this.episodes!.length - 1;
            if (_lsd.active_episode < 0) _ae = 0;
            else if (_lsd.active_episode > _nbe) _ae = _nbe;
            else _ae = _lsd.active_episode
            _ls = {active_episode: _ae, total_episodes: this.episodes!.length};
        }
        localStorage.setItem(LS_KEY, JSON.stringify(_ls));
        ls_data = localStorage.getItem(LS_KEY)!;
        this.local_storage_data = JSON.parse(ls_data as string);
        
        // Create the reader template
        if (!HTML.querySelector('._wbtnr_btn_back')) this.html_template = this.html_builder.back();
        if (!HTML.querySelector('._wbtnr_track')) this.html_template += this.html_builder.progressbar();
        if (!HTML.querySelector('._wbtnr_ep')) {
            let ep_i: number;
            if (this.local_storage_data.active_episode < 0) ep_i = 0;
            else if (this.local_storage_data.active_episode > (this.local_storage_data.total_episodes - 1)) ep_i = --this.local_storage_data.total_episodes;
            else ep_i = this.local_storage_data.active_episode;
            
            this.html_template += this.html_builder.reader(this.episodes![ep_i]);
        }
        if (!HTML.querySelector('._wbtnr_rnav') && navigation === true) this.html_template += this.html_builder.navigation();
        
        // Manage if it has already been appended to the html or not
        if (!WBTNR_CONTAINER!.classList.contains('_wbtnr_built')) {
            // We add the reader
            if (this.toolbox.append(this.html_template, WBTNR_CONTAINER!)) {
                // Display the reader and start lazyloading
                this.lazyloader.load_io();
                WBTNR_CONTAINER!.classList.add('_wbtnr_built');
                this.listener(navigation);
                show();
            } else {
                console.warn('Nothing to open the reader with or it already exists (wbtnr_1)');
            }
        } else { // Only display the reader because already built in the html
            show();
        }
    }

    /**
     * Close the reader
     * @returns void
     */
    close_reader(): void {
        if (WBTNR_CONTAINER!.classList.contains('show')) WBTNR_CONTAINER!.classList.remove('show');
        setTimeout(() => {
            if (HTML.classList.contains('active-reader')) HTML.classList.remove('active-reader');
        }, 550);
    }

    /**
     * Change the episode without leaving the reader
     * 
     * @param navigation
     * @returns void
     */
    change_episode(navigation: Navigation): void {
        this.html_template = this.html_builder.progressbar(true);
        let new_reader_html: string = this.html_builder.reader(this.episodes![this.local_storage_data.active_episode], true);

        if (new_reader_html) {
            this.html_template += new_reader_html;

            let anchor: HTMLElement = WBTNR_CONTAINER!.querySelector('._wbtnr_rnav')!;
            let old_progressbar: HTMLElement = WBTNR_CONTAINER!.querySelector('._wbtnr_prgsbr')!;
            let old_reader: HTMLElement = WBTNR_CONTAINER!.querySelector('._wbtnr_ep')!;

            if (old_progressbar && old_reader && anchor) {
                // Previous button check
                if (this.local_storage_data.active_episode === 0) this.toolbox.disable_hel(navigation.prev);
                if (this.local_storage_data.active_episode > 0 && navigation.prev.classList.contains('disabled')) this.toolbox.enable_hel(navigation.prev);

                // Next button check
                if (this.local_storage_data.active_episode >= this.local_storage_data.total_episodes) this.toolbox.disable_hel(navigation.next);
                if (this.local_storage_data.active_episode < this.local_storage_data.total_episodes && navigation.next.classList.contains('disabled')) this.toolbox.enable_hel(navigation.next);

                old_progressbar.classList.add('hide');
                old_reader.classList.add('hide');

                setTimeout(() => {
                    anchor.insertAdjacentHTML('beforebegin', this.html_template);
                    
                    old_progressbar.remove();
                    old_reader.remove();

                    this.position_nav(anchor);
                    this.lazyloader.load_io();

                    let new_progressbar: HTMLElement = WBTNR_CONTAINER!.querySelector('._wbtnr_prgsbr')!;
                    let new_reader: HTMLElement = WBTNR_CONTAINER!.querySelector('._wbtnr_ep')!;
                    new_progressbar.classList.remove('hide');
                    new_reader.classList.remove('hide');

                    this.progressbar.listen(new_progressbar.querySelector('._wbtnr_track') as HTMLElement, new_reader);
                }, 451);
            }
        }
    }

    /**
     * Listen to events on possible actions
     * Like the back button or the next & previous episode
     * 
     * @param navigation
     * @returns void
     */
    listener(navigation: boolean = false): void {
        // Check if the close button exists or isn't already lisetened to
        let back_btn: HTMLElement = HTML.querySelector('._wbtnr_btn_back')!;
        if (back_btn && back_btn.getAttribute('data-listener') !== 'true') {
            back_btn.setAttribute('data-listener', 'true');
            back_btn.addEventListener('click', (e) => {
                e.preventDefault(), e.stopPropagation();

                this.close_reader();
            });
        }

        // Navigation
        if (navigation === true) {
            // Check if navbar is present in the html
            let navbar: HTMLElement = HTML.querySelector('._wbtnr_rnav')!;
            if (navbar) { // Then get the prev and next buttons
                this.position_nav(navbar);
                let prev: HTMLElement = navbar.querySelector('._wbtnr_prev')!;
                let next: HTMLElement = navbar.querySelector('._wbtnr_next')!;

                if (this.local_storage_data.active_episode <= 0) { // Disable previous button
                    this.toolbox.disable_hel(prev);
                } else if (prev.classList.contains('disabled')) this.toolbox.enable_hel(prev);

                if (this.local_storage_data.active_episode >= --this.local_storage_data.total_episodes) { // Disable next button
                    this.toolbox.disable_hel(next);
                } else if (next.classList.contains('disabled')) this.toolbox.enable_hel(next);

                // Add event listeners now
                [prev, next].forEach(el => {
                    if (el.getAttribute('data-listener') !== 'true') {
                        el.setAttribute('data-listener', 'true');
                        el.addEventListener('click', e => {
                            e.preventDefault(), e.stopPropagation();
    
                            if (el.classList.contains('_wbtnr_prev')) { // Ep -1
                                --this.local_storage_data.active_episode;
                            }
    
                            if (el.classList.contains('_wbtnr_next')) { // Ep +1
                                ++this.local_storage_data.active_episode;
                            }
    
                            this.change_episode({
                                prev: prev,
                                next: next
                            });
                            localStorage.setItem(LS_KEY, JSON.stringify(this.local_storage_data));
                        });
                    }
                });
            }
        }
    }

    /**
     * Position the navigation on the episode well
     * 
     * @param nav_el
     * @returns void
     */
    position_nav(nav_el: HTMLElement): void {
        let hep: HTMLElement = WBTNR_CONTAINER!.querySelector('._wbtnr_ep figure:last-child')!;
        if (hep) {
            let trigger = () => {
                let r_hep: DOMRect = hep.getBoundingClientRect();
                hep.style.marginBottom = nav_el.scrollHeight+'px';
                nav_el.style.left = r_hep.left+'px';
            }

            trigger();
            
            window.addEventListener('resize', trigger);
        }
    }
}
