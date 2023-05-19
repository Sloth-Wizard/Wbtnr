import { SeriesFoff } from '../../../models/episodes.model'

export class ScannerFoff {
    /**
     * ### Scan the generated database and return an object with all the data
     * 
     * @returns The series
     */
    async scan()/*: Promise<Partial<SeriesFoff>>*/ {
        const response = await fetch('../../../data/ali.foff')
        console.log(response.text())
    }
}
