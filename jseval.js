
const playwright = require('playwright');
const fs = require("fs");
const sleep = require('sleep');
const { exec } = require('child_process');
const moment = require('moment');

const commander = require('commander');
const program = new commander.Command();

program
  .option('--url <url>', 'set url')
  .option('--sleep <seconds>', 'set sleep', 0 )
  .option('--evaluate <script>', 'set script to evaluate')
  .option('--output', 'output to stdout')
  .option('--file <file>', 'output to file', '')
  .option('--headless', 'enables headless', false )
  // .option('--quiet', 'disable logs')
  .option('--log', 'enables log')
  .parse(process.argv)
  ;
  // if (! process.argv.slice(2).length) program.help() ;

(async function(){

  const browser = await playwright.chromium.launch({
      // headless: false,
      headless: program.headless ? true : false ,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ],
  });

  const context = await browser.newContext({ viewport: null })

  // // har
  // const context = await browser.newContext({ viewport: null, recordHar: { path: "./tmp.har" } })

  // // cookies
  // const cookies = fs.readFileSync('tradingview_cookies.json', 'utf8')
  // const deserializedCookies = JSON.parse(cookies)
  // await context.addCookies(deserializedCookies)

  const page = await context.newPage()

  if (program.log) console.log(moment().format(), "go to url...");
  await page.goto(program.url, {waitUntil: 'domcontentloaded'});

  if (program.log) console.log(moment().format(), "waiting for url load...");
  await page.waitForLoadState('load');

  if (program.log) console.log(moment().format(), "sleeping...");
  await sleep.sleep(program.sleep);

  if (program.log) console.log(moment().format(), "evaluating passed script...");
  // eval(program.evaluate);

  var obj = {
    evaluate: program.evaluate
  };

  var data = await page.evaluate((obj) => {
    return eval(obj.evaluate);
  }, obj);

  if (program.output) console.log(data);
  if (program.file) fs.writeFileSync(program.file, data);

  if (program.log) console.log(moment().format(), "closing context...");
  await context.close()

  if (program.log) console.log(moment().format(), "closing browser...");
  await browser.close()

  if (program.log) console.log(moment().format(), "exiting...");

})();

// e.g.
// node geturls.js --url 'https://www.tradingview.com/ideas/bitcoin/' --evaluate 'JSON.stringify(Array.from(document.querySelectorAll("div.tv-feed-layout__card-item[data-widget-type=\"idea\"] > div > div > a")).map(a =>
// a.href))' --headless --output
