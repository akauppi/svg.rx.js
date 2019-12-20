# npm

## dry-run

To see what would get published:

```
$ npm publish --dry-run
npm notice 
npm notice 📦  svg.rx.js@0.0.6-alpha
npm notice === Tarball Contents === 
npm notice 15.9kB src/svg.rx.js
npm notice 1.8kB  package.json 
npm notice 813B   CHANGELOG.md 
npm notice 7.9kB  README.md    
npm notice 1.1kB  LICENSE.txt  
npm notice === Tarball Details === 
npm notice name:          svg.rx.js                               
npm notice version:       0.0.6-alpha                             
npm notice package size:  11.4 kB                                 
npm notice unpacked size: 27.4 kB                                 
npm notice shasum:        2410514b2382ce1e8b006512d81d5444938879e5
npm notice integrity:     sha512-bLPPcAcqdeAL9[...]9gtwqYmk2NYhg==
npm notice total files:   5                                       
npm notice 
+ svg.rx.js@0.0.6-alpha
```

## Use of dist-tags

>By default, running npm publish will tag your package with the latest dist-tag. To use another dist-tag, use the --tag flag when publishing.
<sub>[source](https://docs.npmjs.com/adding-dist-tags-to-packages)</sub>

To publish a pre-version (not suitable for production use):

```
$ npm publish --tag next
```


## References

- [npm Publishing Tutorial](https://blog.risingstack.com/nodejs-at-scale-npm-publish-tutorial/) (RisingStack, 2016?)
- [Adding dist-tags to packages](https://docs.npmjs.com/adding-dist-tags-to-packages) (npmjs docs)
- [Prereleases and npm](https://medium.com/@mbostock/prereleases-and-npm-e778fc5e2420) (blog, Jan 2016) 

