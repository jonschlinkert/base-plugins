/*!
 * base-plugins <https://github.com/jonschlinkert/base-plugins>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

module.exports = function(app) {
  if (!app.plugins) {
    app.define('plugins', []);
  }

  /**
   * Define a plugin function to be called immediately upon init.
   * The only parameter exposed to the plugin is the application
   * instance.
   *
   * Also, if a plugin returns a function, the function will be pushed
   * onto the `plugins` array, allowing the plugin to be called at a
   * later point, elsewhere in the application.
   *
   * ```js
   * // define a plugin
   * function foo(app) {
   *   // do stuff
   * }
   *
   * // register plugins
   * var app = new Base()
   *   .use(foo)
   *   .use(bar)
   *   .use(baz)
   * ```
   * @name .use
   * @param {Function} `fn` plugin function to call
   * @return {Object} Returns the item instance for chaining.
   * @api public
   */

  app.mixin('use', function(fn) {
    var plugin = fn.call(this, this);
    if (typeof plugin === 'function') {
      this.plugins.push(plugin);
    }
    return this;
  });

  /**
   * Run all plugins
   *
   * ```js
   * var config = {};
   * app.run(config);
   * ```
   * @name .run
   * @param {Object} `value` Object to be modified by plugins.
   * @return {Object} Returns the item instance for chaining.
   * @api public
   */

  app.mixin('run', function(val) {
    this.plugins.forEach(function (fn) {
      if (typeof val.use === 'function') {
        val.use(fn);
      } else {
        fn.call(val, val);
      }
    });
    return this;
  });
};