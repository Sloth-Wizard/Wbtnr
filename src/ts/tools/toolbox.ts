export class Toolbox {
    /**
     * Disable the passed html element and add a class for styling
     * 
     * @param element
     * @returns void
     */
    disable_hel(element: HTMLElement) {
        element.setAttribute('disable', 'true');
        element.classList.add('disabled');
    }

    /**
     * Enable the passed html element and remove the disabled class
     * 
     * @param element
     * @returns void
     */
    enable_hel(element: HTMLElement) {
        element.removeAttribute('disable');
        element.classList.remove('disabled');
    }

    /**
     * Classic appending with additonnal check
     * 
     * @param html 
     * @param container 
     * @returns boolean
     */
    append(html: string, container: HTMLElement) {
        container.insertAdjacentHTML('beforeend', html);
        
        let chk = container.querySelector('.wbtnr__reader--episode');
        if (chk) return true;
        else return false;
    }
}