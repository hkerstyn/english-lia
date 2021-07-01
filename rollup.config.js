import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';


export default [{
  input: 'lul/bundle.js',
  output: {
    file: 'lul.js',
    format: 'es'
  },
  watch: {
    clearScreen: false,
  },
}, {
  input: 'grabber/bundle.js',
  output: {
    file: 'grabber.js',
    format: 'es'
  },
  watch: {
    clearScreen: false,
  },
},
{
  input: 'consys/bundle.js',
  output: {
    file: 'consys.js',
    format: 'es'
  },
  //  plugins: [
  //    resolve(),
  //    babel({ babelHelpers: 'bundled' })
  //  ],
  watch: {
    clearScreen: false,
  },
},
{
  input: 'base/bundle.js',
  output: {
    file: 'base.js',
    format: 'es'
  },
  watch: {
    clearScreen: false,
  },
}
];
