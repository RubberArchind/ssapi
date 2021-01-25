const playwright = require("playwright-aws-lambda");

module.exports = async (req, res) => {
  let browser = null;
  const { query } = req;
  try {
    if (query.url && isValidUrl(query.url)) {
      browser = await playwright.launchChromium({ headless: true });
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(query.url);
      await page.waitForSelector('#div');
      const screenshot = await page.screenshot({ type: 'jpg', fullPage: true ,timeout:60});
      res.setHeader("Content-Type", "image/jpg");
      res.status(200).send(screenshot);

    } else throw "Please provide a valid url";

  } catch (error) {
    res.status(500).send({
      status: "Failed",
      error
    });

  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

};

function isValidUrl(string) {
  try {
    new URL(string);
  } catch (_) {
    return false;
  }
  return true;
}