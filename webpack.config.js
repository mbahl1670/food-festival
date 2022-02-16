// const path = require("path");
// const webpack = require("webpack");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

// module.exports = {
//     devServer: {
//         static: {
//             directory:__dirname
//         }
//     },
//     entry: {
//         app: './assets/js/script.js',
//         events: "./assets/js/events.js",
//         schedule: "./assets/js/schedule.js",
//         tickets: "./assets/js/tickets.js"
//     },
//     output: {
//         filename: '[name].bundle.js',
//         path: __dirname + "/dist"
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.jpg$/i,
//                 use: [
//                     {
//                         loader: 'file-loader',
//                         options: {
//                             esModule: false,
//                             name (file) {
//                                 return "[path][name].[ext]"
//                             },
//                             publicPath: function(url) {
//                                 return url.replace("../", "/assets/")
//                             }
//                         }
//                     },
//                     {
//                         loader: 'image-webpack-loader'
//                     }
//                 ]
//             }
//         ]
//     },
//     plugins: [
//         new webpack.ProvidePlugin({
//             $: "jquery",
//             jQuery: "jquery"
//         }),
//         new BundleAnalyzerPlugin({
//             analyzerMode: "static" // the report outputs to an HTML file in the dist folder
//         })
//     ],
//     mode: 'development'
// };
const APP_PREFIX = 'FoodEvent-';     
const VERSION = 'version_01';
const CACHE_NAME = APP_PREFIX + VERSION
const FILES_TO_CACHE = [
  "./index.html",
  "./events.html",
  "./tickets.html",
  "./schedule.html",
  "./assets/css/style.css",
  "./assets/css/bootstrap.css",
  "./assets/css/tickets.css",
  "./dist/app.bundle.js",
  "./dist/events.bundle.js",
  "./dist/tickets.bundle.js",
  "./dist/schedule.bundle.js"
];

// Respond with cached resources
self.addEventListener('fetch', function (e) {
  console.log('fetch request : ' + e.request.url)
  e.respondWith(
    caches.match(e.request).then(function (request) {
      if (request) { // if cache is available, respond with cache
        console.log('responding with cache : ' + e.request.url)
        return request
      } else {       // if there are no cache, try fetching request
        console.log('file is not cached, fetching : ' + e.request.url)
        return fetch(e.request)
      }

      // You can omit if/else for console.log & put one line below like this too.
      // return request || fetch(e.request)
    })
  )
})

// Cache resources
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('installing cache : ' + CACHE_NAME)
      return cache.addAll(FILES_TO_CACHE)
    })
  )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      // `keyList` contains all cache names under your username.github.io
      // filter out ones that has this app prefix to create keeplist
      let cacheKeeplist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX);
      })
      // add current cache name to keeplist
      cacheKeeplist.push(CACHE_NAME);

      return Promise.all(keyList.map(function (key, i) {
        if (cacheKeeplist.indexOf(key) === -1) {
          console.log('deleting cache : ' + keyList[i] );
          return caches.delete(keyList[i]);
        }
      }));
    })
  );
});