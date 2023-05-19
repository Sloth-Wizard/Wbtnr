import { Breakpoints } from "../models/breakpoint.model";

// Setup breakpoints needed here
export const BREAKPOINTS: Breakpoints = [
    {width: 992, l_key: '1440x0'},
    {width: 768, l_key: '1024x0'},
    {width: 0, l_key: '768x0'}
];
export const HTML: HTMLElement = document.querySelector('html')!;
export const WBTNR_CONTAINER: HTMLElement | null = HTML.querySelector('#wbtnr');
export const LS_KEY: string = 'wbtnr_sdat';
