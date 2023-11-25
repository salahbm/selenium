const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');
const enquirer = require('enquirer');
const { assert } = require('chai');
require('dotenv').config();
const copyPaste = require('copy-paste');
const path = require('path');
const imgFile = path.resolve(__dirname, '../Tez-Yoz.png');
const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

async function loginToNaver(driver) {
  await driver.get('https://nid.naver.com/nidlogin.login?mode=form&url=https%3A%2F%2Fwww.naver.com');

  while (true) {
    try {
      await sleep(1000);

      const nid = process.env.MY_NAVER_USERNAME;
      const npw = process.env.MY_NAVER_PASSWORD;

      if (!nid || !npw) {
        console.error('Missing Naver credentials.');
        assert.fail('Missing Naver credentials');
      }

      copyPaste.copy(nid, () => {});
      await driver.findElement(By.id('id')).sendKeys(Key.CONTROL + 'v');
      await sleep(1000);

      copyPaste.copy(npw, () => {});
      await driver.findElement(By.id('pw')).sendKeys(Key.CONTROL + 'v');
      await sleep(500);

      await driver.findElement(By.className('btn_text')).click();
      const currentUrl = await driver.getCurrentUrl();

      if (currentUrl === 'https://www.naver.com/') {
        break;
      }
    } catch (error) {
      console.error('No such element:', error.message);
    }
  }
}

let copiedText;

async function readAndCopyFileToClipboard(filePath) {
  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    let fileContent;

    if (fileExtension === '.png' || fileExtension === '.jpg' || fileExtension === '.jpeg') {
      fileContent = fs.readFileSync(filePath, 'base64');
    } else {
      fileContent = fs.readFileSync(filePath, 'binary');
      fileContent = Buffer.from(fileContent, 'binary').toString('utf-8');
    }

    copyPaste.copy(fileContent, (err, text) => {
      if (err) {
        console.error(`Error copying file content: ${err.message}`);
        return;
      }
      copiedText = text;
    });
  } catch (error) {
    console.error(`Error reading or copying file content: ${error.message}`);
  }
}



async function createBlog(driver) {
  try {
    // Clicking on "Do not register"
    try {
      await driver.findElement(By.xpath('//button[@id="new.dontsave"]')).click();
    } catch (error) {
      // NoSuchElementException
      console.log('No element found for "Do not register".');
    }

    await sleep(1000);
    // Navigating to Naver Post
    const url = 'https://post.naver.com';
    await driver.get(url);
    await sleep(2000);

    // Clicking on the "Write Post" button
    const postBtn = await driver.findElement(By.xpath('//*[@id="header"]/div[1]/a[3]'));
    await postBtn.click();
    await driver.wait(
      until.elementLocated(By.css('.in_layer')),
      5000
    );
    
    // Close the popup
    const closeButton = await driver.wait(
      until.elementLocated(By.css('.__se_pop_close')),
      5000
    );
    await closeButton.click();
    
    // Wait until the popup is no longer visible
    await driver.wait(
      until.stalenessOf(closeButton),
      5000
    );
    

    // Example header content
    const headerContent = 'This is my first header by Selenium!!!';

    // Naver Post Title Entry
    const iFrames = await driver.findElements(By.tagName('iframe'));
    await driver.switchTo().frame(iFrames[0]);

    const tagTitle = await driver.wait(
      until.elementLocated(By.xpath("//textarea[@placeholder='제목']")),
      5000
    );
    await tagTitle.click();

    await sleep(1000);
    await driver.actions().sendKeys(headerContent).perform();
    await sleep(1000);


    const contentList = [
      "Introduction: This is my blog post.",
      "Body Paragraph 1: Here is some content for the first paragraph.",
      "Body Paragraph 2: Adding more content to the second paragraph.",
      "Conclusion: Wrapping up the blog post with a conclusion.",
    ];
    
    // Replace 'path/to/your/image.jpg' with the actual path to your image file
    
    try {
      // Content Entry
      const tagContent = await driver.findElement(By.xpath("//div[@class='se_editView']"));
      await tagContent.click();
      await sleep(1000);
  
      // Body
      for (let j = 0; j < contentList.length ; j++) {
        const content = String(contentList[j]);
        await driver.actions().sendKeys(content,'\n~~~~~~~~\n').perform();
        await sleep(100);
      }
      
      // Switching to the image upload iframe
      const iframes = await driver.findElements(By.tagName('iframe'));
      await driver.switchTo().frame(iframes[2]);
      await sleep(1000);

      
      // Switching back to the main iframe
      await driver.switchTo().defaultContent();
      await sleep(1000);
  
      // Posting
      const openPostBtn = await driver.findElement(By.id('se_top_publish_btn'));
      await openPostBtn.click();
      await sleep(1000);
      const postBtn = await driver.findElement(By.className('btn_publish'));
      await postBtn.click();
      await sleep(1000);
    } catch (error) {
      console.log('Error creating blog with image:', error.message);
    }
  } catch (error) {
    console.log('Error creating blog:', error.message);
  }
}



describe("Automated Blogging on Naver", function () {
  this.timeout(300000);
  let driver;

  it("Should login to Naver, create a blog, and post content", async function () {
    try {
      driver = await new Builder().forBrowser('MicrosoftEdge').build();
      await loginToNaver(driver);
      assert.isTrue(await driver.wait(until.urlIs('https://www.naver.com/'), 5000), 'Login successful');

      // const img = `Tez-Yoz.png`
      // const txt = 'C:\\Users\\salah\\Documents\\reactjs\\selenium\\title.txt';

      await createBlog(driver);
    } catch (error) {
      assert.fail('Test failed: ' + error.message);
    } finally {
      if (driver) {
        await driver.quit();
      }
    }
  });
});
