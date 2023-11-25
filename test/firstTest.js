const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');
const enquirer = require('enquirer');
const { assert } = require('chai');
require('dotenv').config();
const copyPaste = require('copy-paste');
const path = require('path');

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

async function clickCancelButton(driver) {
  try {
    const cancelButton = await driver.findElement(By.css('.se-popup-button.se-popup-button-cancel'));

    if (cancelButton) {
      await cancelButton.click();
    } else {
      console.log('Cancel button is not displayed.');
    }
  } catch (error) {
    console.error('Error handling pop-up:', error.message);
  }
}

async function createBlog(driver) {
  try {
    // Clicking on "Do not register"
    try {
      await driver.findElement(By.xpath('//*[@id="new.dontsave"]')).click();
    } catch (error) {
      // NoSuchElementException
      console.log('no element found', error.message);
    }

    await driver.sleep(1000);


    // Navigating to Naver Post
    const url = 'https://post.naver.com';
    await driver.get(url);
    await driver.sleep(2000);

    // Clicking on the "Write Post" button
    const postBtn = await driver.findElement(By.xpath('//*[@id="header"]/div[1]/a[3]'));
    await postBtn.click();
    await driver.sleep(3000);

    const txtFilePath = 'C:\\Users\\salah\\Documents\\reactjs\\selenium\\title.txt';
    const lines = fs.readFileSync(txtFilePath, 'utf-8').split('\n');
    const header = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const post = {};

      for (let j = 0; j < header.length; j++) {
        post[header[j]] = values[j];
      }

      const titleDirectory = post['title_2'];
      const imgFileDirectory = post['img_directory'];
      const txtFileDirectory = post['txt_directory'];

    

      const contentList = fs.readFileSync(txtFileDirectory, 'utf-8').split('\n');
      const bloggerTitle = titleDirectory;
      const bloggerTitle2 = bloggerTitle.replace("\ufeff", "");

      const contentDesc = fs.readFileSync(txtFileDirectory, 'utf-8');
      const tistoryTitle = String(bloggerTitle2);

      // Naver Post Title Entry
      const iframes = await driver.findElements(By.tagName('iframe'));
      await driver.switchTo().frame(iframes[0]);

      const tagTitle = await driver.findElement(By.xpath("//textarea[@placeholder='제목']"));
      await tagTitle.click();
      await driver.sleep(1000);
      const title = String(tistoryTitle);
      await driver.sleep(1000);
      await driver.actions().sendKeys(title).perform();
      await driver.actions().sendKeys(Key.NULL).perform();
      await driver.sleep(1000);

      // Content Entry
      const tagContent = await driver.findElement(By.xpath("//div[@class='se_editView']"));
      await tagContent.click();
      await driver.sleep(1000);

      // Introduction
      const content1 = String(contentList[0]);
      await driver.actions().sendKeys(content1).perform();
      await driver.sleep(1000);

      // Body
      for (let j = 1; j < contentList.length - 1; j++) {
        const content2 = String(contentList[j]);
        await driver.actions().sendKeys(content2).perform();
        await driver.sleep(1000);
      }

      // Adding image
      if (imgFileDirectory !== 'no_image') {
        // Adding image
        const tagAddImg = await driver.findElement(By.xpath("//button[@class='se-2d62a39d se-ff2750f7 se-l-icon-plus']"));
        await tagAddImg.click();
        await driver.sleep(1000);

        // Switching to the image upload iframe
        const iframes = await driver.findElements(By.tagName('iframe'));
        await driver.switchTo().frame(iframes[2]);
        await driver.sleep(1000);

        // Uploading the image
        const tagFileUpload = await driver.findElement(By.xpath("//input[@type='file']"));
        await tagFileUpload.sendKeys(imgFileDirectory);
        await driver.sleep(1000);

        // Waiting for the image to upload
        await driver.sleep(5000);

        // Switching back to the main iframe
        await driver.switchTo().defaultContent();
        await driver.sleep(1000);
      }

      // Posting
      const tagPostBtn = await driver.findElement(By.xpath("//button[@class='se-3e1641a2 se-ff2750f7 se-ff2750f7-primary-large']"));
      await tagPostBtn.click();
      await driver.sleep(5000);

      // Writing to the Excel file (if needed)
      // healthNaverPosting[i]['naver_posting'] = 'O';

      // Waiting before moving on to the next post
      await driver.sleep(2000);
    }

    // Switch back to the default content
    await driver.switchTo().defaultContent();
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

      const img = `Tez-Yoz.png`
      const txt = 'C:\\Users\\salah\\Documents\\reactjs\\selenium\\title.txt';

      await createBlog(driver, img, txt);

      console.log('Test completed successfully');
    } catch (error) {
      assert.fail('Test failed: ' + error.message);
    } finally {
      if (driver) {
        await driver.quit();
        console.log('WebDriver quit');
      }
    }
  });
});
