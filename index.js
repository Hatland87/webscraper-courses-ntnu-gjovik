const puppeteer = require('puppeteer');
var fs = require('fs');



const url = 'https://www.ntnu.no/studier/emnesok#semester=2020&gjovik=true&trondheim=false&alesund=false&faculty=-1&institute=-1&multimedia=false&english=false&phd=false&courseAutumn=false&courseSpring=false&courseSummer=false&pageNo=1&season=autumn&sortOrder=ascTitle';
const url2 = 'https://www.ntnu.no/studier/emnesok#semester=2020&gjovik=true&trondheim=false&alesund=false&faculty=1211&institute=881&multimedia=false&english=false&phd=false&courseAutumn=true&courseSpring=false&courseSummer=false&pageNo=3&season=autumn&sortOrder=ascTitle'
async function getCourses () {
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  });

  try {
    const page = await browser.newPage();
    await page.goto(url);
    await page.waitFor('button.fetchmore')
    
    try {
      while (page.$eval('button.fetchmore', b => b.hidden)) {
        await page.waitFor('button.fetchmore')
        await page.waitFor(200)
        await page.click('button.fetchmore')
        console.log('click')
      } 
    } catch (error) {
      console.log(error)
    }

    await page.waitFor(300)

    let data = await page.evaluate(() =>
      Array.from(document.querySelectorAll('tr.courserow'))
        .map(row => ({
          code: row.querySelector('td.coursecode').innerText,
          name: row.querySelector('td.coursename').innerText
        }))
    )


    console.log(data.length)

    var file = fs.createWriteStream('data.txt');
    file.on('error', function(err) { /* error handling */ });
    data.forEach(function(v) { file.write(v.code + ',' + v.name + '\n'); });
    file.end();

  
  } catch (error) {
    console.log(error)
  } finally{
    await browser.close();
  }

  
}
getCourses()
