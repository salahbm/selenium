const { Builder, By, until, Key } = require('selenium-webdriver');
const fs = require('fs');
const enquirer = require('enquirer');
const { assert } = require('chai');
require('dotenv').config();
const copyPaste = require('copy-paste');
const path = require('path');
// sleep
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

      copyPaste.copy(nid, () => {  });
      await driver.findElement(By.id('id')).sendKeys(Key.CONTROL + 'v');
      await sleep(1000);

      copyPaste.copy(npw, () => {  });
      await driver.findElement(By.id('pw')).sendKeys(Key.CONTROL + 'v');
      await sleep(500)

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
  console.log(`file: firstTest.js:48 ~ filePath:`, filePath);

  try {
    const fileExtension = path.extname(filePath).toLowerCase();
    let fileContent;

    if (fileExtension === '.png' || fileExtension === '.jpg' || fileExtension === '.jpeg') {
      // For image files, read and convert to base64
      fileContent = fs.readFileSync(filePath, 'base64');
    } else {
      // For other files, read as binary and convert to utf-8
      fileContent = fs.readFileSync(filePath, 'binary');
      fileContent = Buffer.from(fileContent, 'binary').toString('utf-8');
    }

    copyPaste.copy(fileContent, (err, text) => {
      if (err) {
        console.error(`Error copying file content: ${err.message}`);
        return;
      }
      copiedText = text;
      console.log(`File content copied to the clipboard:\n${copiedText}`);
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




async function createBlog(driver, imageFilePath, txtFilePath) {
  await driver.get('https://blog.naver.com/salah_bm?Redirect=Write');

 await  clickCancelButton(driver)
 await sleep(5000);

  try {
    // Wait for the text element to be present
    const textElement = await driver.findElementBy.xpath('//span[@id="SE-85f5eb87-2476-4063-a939-cf4fbc416b74"]')

    // Copy and paste text
    readAndCopyFileToClipboard(txtFilePath);
    await textElement.sendKeys(Key.CONTROL + 'v');

    await sleep(3000);

    // Copy and paste image
    readAndCopyFileToClipboard(imageFilePath);
    await driver.findElement(By.id("SE-af6f8c9f-5008-4e1b-8fa1-e539b51232d6")).sendKeys(Key.CONTROL + 'v');

    await sleep(2000);
    await driver.findElement(By.className('publish_btn__Y5mLP')).click();
    await driver.findElement(By.className('confirm_btn__Dv9du')).click();
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
      console.log('WebDriver initialized successfully');

      // Step 1: Login to Naver
      console.log('Step 1: Login to Naver');
      await loginToNaver(driver);
      assert.isTrue(await driver.wait(until.urlIs('https://www.naver.com/'), 5000), 'Login successful');

      // Step 2: Create a blog and post content
      console.log('Step 2: Create a blog and post content');
      const img = `Tez-Yoz.png`
      const txt = 'C:\\Users\\salah\\Documents\\reactjs\\selenium\\title.txt';

      await createBlog(driver, img, txt);

      // const actualUrl = await driver.getCurrentUrl();
      // assert.isTrue(actualUrl.startsWith('https://blog.naver.com/salah_bm/'), 'Unexpected blog URL');

      console.log('Test completed successfully');
    } catch (error) {
      console.error('Test failed:', error);
      assert.fail('Test failed: ' + error.message);
    } finally {
      if (driver) {
        await driver.quit();
        console.log('WebDriver quit');
      }
    }
  });
});


// C:\Users\salah\Downloads\Tez-Yoz.png

// C:\Users\salah\Downloads\text.txt





// async function solveCaptcha(driver) {
//   const captchaImage = await driver.findElement(By.id('captchaimg')); 

//   const imageData = await captchaImage.takeScreenshot(true);
//   const file = 'screenshot.png';
//   fs.writeFileSync(file, imageData, 'base64');
  
//   // Perform OCR on the image data
//   const { data: { text } } = await Tesseract.recognize(
//     Buffer.from(imageData, 'base64'),
//     'kor',
//     { logger: info =>info } 
//   );

//   // Insert the answer into the input field
//   const questionElement = await driver.findElement(By.className('captcha_message'));
//   const questionText = await questionElement.getText();
//   // const answerInput = await driver.findElement(By.id('captcha'));
//   // Implement your logic to extract the answer from the text obtained from OCR
//   // const answer = extractAnswerFromText(text);

//   // Insert the answer into the input field
//   // await answerInput.sendKeys(answer);

// }

// function extractAnswerFromText(text) {
//   // Implement your logic to extract the answer from the OCR result (text)
//   // This could involve parsing the text, using regular expressions, or other methods
//   // Replace the following line with your actual logic
//   // return text.trim().toUpperCase(); 
// }