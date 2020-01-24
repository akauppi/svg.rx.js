# npm

## dry-run

To see what would get published:

```
$ npm pack
npm notice 
npm notice 📦  svg.rx.js@0.0.7-alpha.1
npm notice === Tarball Contents === 
npm notice 15.7kB src/dragging.js
npm notice 161B   src/main.js    
npm notice 2.6kB  package.json   
npm notice 952B   CHANGELOG.md   
npm notice 7.3kB  README.md      
npm notice 1.1kB  LICENSE.txt    
npm notice === Tarball Details === 
npm notice name:          svg.rx.js                               
npm notice version:       0.0.7-alpha.1                           
npm notice filename:      svg.rx.js-0.0.7-alpha.1.tgz             
npm notice package size:  11.3 kB                                 
npm notice unpacked size: 27.8 kB                                 
npm notice shasum:        d37f9d21778b8e86f3f65b958dcee00886305dd1
npm notice integrity:     sha512-wjgC5B9f5HiQZ[...]/IC4+lu3m2a7w==
npm notice total files:   6                                       
npm notice 
svg.rx.js-0.0.7-alpha.1.tgz
```

>Q: What's the difference between this and `npm publish --dry-run`?


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

