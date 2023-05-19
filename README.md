# Wbtnr

Creates a reader from an array of images.          
Create your own scanner or use the ones existing.     

## Configuration

Please set the configuration file according to what you need [here](https://github.com/AlexisADupuis/Wbtnr/tree/dev/src/ts/config)      
**/!\ Do not change the ```LS_KEY``` constant**

## Before starting

Follow these steps before previewing in your browser

```
npm i
npm run build
```

## The scanner

If you need to modify the scanner (you definitely will), it is located [here](https://github.com/AlexisADupuis/Wbtnr/tree/dev/src/ts/core/services/scanner)    

Always use a function called ```scan()``` to return the data to the core
```typescript
scan() {
    // Your logic
    // It must return a result of types
    let result: Array<Array<Array<EpisodeModel>>>|undefined = the_data_structure;

    return result;
}
```

## Data structure

The scanner should feed the reader an array like below
```
This contains all the episodes
[
    Each array is an episode containing the images
    [
        This array is one image of the whole episode, it contains objects for an image for each wanted breakpoints
        [
            The 1st object should also be the default image to be put in the image src
            {width: 992, path: "your-image.com/path/to/breakpoint/image/size-992.jpg", breakpoint: "1440x0"},
            {width: 768, path: "your-image.com/path/to/breakpoint/image/size-768.jpg", breakpoint: "1024x0"},
            {...}
        ],
        [
            ...
        ]
    ],
    [
        ...
    ],
    ...
]
```

## Contact if you encounter any issues

abeloos@dupuis.com
