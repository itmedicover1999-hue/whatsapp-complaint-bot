const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Directs Puppeteer to install Chrome in project directory instead of home cache
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};