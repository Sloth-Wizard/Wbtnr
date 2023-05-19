export class Lazyloading {
    /**
     * Load images when in viewport using intersection observer API
     * 
     * @returns void
     */
    load_io() {
        let lazy_images: NodeListOf<HTMLImageElement> = document.querySelectorAll('img._wbtnr_jlzy');
        if (lazy_images) {
            if ('IntersectionObserver' in window) {
                let io = new IntersectionObserver((e, o) => {
                    e.forEach(i => {
                        if (i.isIntersecting) {
                            let l_img: HTMLImageElement = <HTMLImageElement>i.target;
                            l_img.src = l_img.dataset.src!;
                            l_img.classList.remove('_wbtnr_jlzy');

                            let figure: HTMLElement | null = l_img.closest('figure');
                            if (figure) figure.classList.add('loaded');

                            delete l_img.dataset.src;
                            io.unobserve(l_img);
                        }
                    });
                });

                lazy_images.forEach(image => {
                    io.observe(image);
                });
            } else { // io not available in the browser, use fallback func
                this._load();
            }
        }
    }

    /**
     * Load images when in viewport
     * 
     * @returns void
     */
    _load() {
        let lazy_images: NodeListOf<HTMLImageElement> = document.querySelectorAll('img._wbtnr_jlzy');
        if (lazy_images) {
            let trigger = () => {
                lazy_images.forEach(async (el) => {
                    if (el.classList.contains('_wbtnr_ldd')) return;
                    else {
                        let bcr: DOMRect = el.getBoundingClientRect();
                        if (bcr.top < window.innerHeight) {
                            const img_load_promise = new Promise(() => {
                                let img: HTMLImageElement = new Image();
                                img.onload = () => {
                                    el.src = img.src;
                                    el.classList.remove('_wbtnr_jlzy');

                                    let figure: HTMLElement | null = el.closest('figure');
                                    if (figure) figure.classList.add('loaded');

                                    delete el.dataset.src;
                                }

                                img.src = el.dataset.src!;
                            });

                            await img_load_promise;
                        }
                    }
                });
            }

            trigger();

            let reader = document.querySelector('._wbtnr_ep')!;
            reader.addEventListener('scroll', trigger);
            reader.addEventListener('resize', trigger);
        }
    }
}
