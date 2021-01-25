const express = require('express'),
    app = express(),
    puppeteer = require('puppeteer');
app.get("/", async (request, response) => {
    try {
        const browser = await puppeteer.launch({          
            args: ['--no-sandbox', '--disable-setuid-sandbox', "--proxy-server='direct://'", '--proxy-bypass-list=*', ],
        });
        const page = (await browser.pages())[0];
        await page.setViewport({
            width: 1366,
            height: 768
        });
        url='';
        for(key in request.query){
          if(key=='url'){
            url+=request.query[key];
          }else{
            url+='&'+key+'='+request.query[key];
          }
        }        
        console.log(url)
        await page.goto(url); // Read url query parameter.
        await page.waitForSelector('#done');
        var element = await page.$('body'); 
        var image = await element.screenshot();
        await browser.close();
        response.set('Content-Type', 'image/png');
        response.send(image);
    } catch (error) {
        console.log(error);
    }
});
var listener = app.listen(3000, function() {
    console.log('Your app is listening on port ' + listener.address().port);
});