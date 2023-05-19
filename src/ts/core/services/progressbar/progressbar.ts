export class Progressbar {
    // Listen to scrolling and adapt the progressbar
    listen(bar: HTMLElement, reader: HTMLElement) {
        let track = () => {
            let percentage = 100 * reader.scrollTop / (reader.scrollHeight - reader.clientHeight);
            if (percentage >= 97) percentage = 100;
     
            percentage = Math.round(percentage);
            bar.style.width = percentage+'%';
        }
        track();

        reader.addEventListener('scroll', track);
    }
}
