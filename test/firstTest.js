const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const enquirer = require('enquirer');
const { assert } = require('chai');
require('dotenv').config();
const Tesseract = require('tesseract.js');

async function solveCaptcha(driver) {
  const captchaImage = await driver.findElement(By.id('captchaimg')); 

  const imageData = await captchaImage.takeScreenshot(true);
  const file = 'screenshot.png';
  fs.writeFileSync(file, imageData, 'base64');
  
  // Perform OCR on the image data
  const { data: { text } } = await Tesseract.recognize(
    Buffer.from(imageData, 'base64'),
    'kor',
    { logger: info =>info } 
  );

  // Insert the answer into the input field
  const questionElement = await driver.findElement(By.className('captcha_message'));
  const questionText = await questionElement.getText();
  console.log('====================================');
  console.log(questionText);
  console.log('====================================');
  // const answerInput = await driver.findElement(By.id('captcha'));
  // Implement your logic to extract the answer from the text obtained from OCR
  // const answer = extractAnswerFromText(text);

  // Insert the answer into the input field
  // await answerInput.sendKeys(answer);

}

function extractAnswerFromText(text) {
  // Implement your logic to extract the answer from the OCR result (text)
  // This could involve parsing the text, using regular expressions, or other methods
  // Replace the following line with your actual logic
  // return text.trim().toUpperCase(); 
}


async function loginNaver(driver, email, password) {
  await driver.get('https://nid.naver.com/nidlogin.login?mode=form&url=https://www.naver.com/');
  await driver.findElement(By.id('id')).sendKeys(email);
  await driver.findElement(By.id('pw')).sendKeys(password);
  await driver.findElement(By.className('btn_text')).click();
  await solveCaptcha(driver)
  // await driver.wait(until.urlIs('https://www.naver.com/'), 50000);
}

async function createBlog(driver, imageFilePath, txtFilePath) {
  await driver.get('https://blog.naver.com/salah_bm?Redirect=Write');
  const imageInput = await driver.findElement(By.name('image'));
  await imageInput.sendKeys(imageFilePath);

  const txtInput = await driver.findElement(By.name('txtContent'));
  await txtInput.sendKeys(await fs.promises.readFile(txtFilePath, 'utf-8'));

  // Add more steps as needed

  await driver.findElement(By.css('.button_blog')).click();
}

async function getUserInput() {
  const questions = [
    { type: 'input', name: 'imageFilePath', message: 'Enter the path to your image file:' },
    { type: 'input', name: 'txtFilePath', message: 'Enter the path to your text file:' },
  ];

  return await enquirer.prompt(questions);
}

describe("Automated Blogging on Naver", function() {
  this.timeout(3000000); // Adjust the timeout as needed

  let driver;


  it("Should login to Naver, create a blog, and post content", async function () {
    try {
      driver = await new Builder().forBrowser('MicrosoftEdge').build();
      console.log('WebDriver initialized successfully');

      // Get user input
      const userInput = await getUserInput();
      console.log('User input:', userInput);

      // Check for required environment variables
      const email = process.env.MY_NAVER_USERNAME
      const password = process.env.MY_NAVER_PASSWORD 
      if (!email || !password) {
        console.error('Missing Naver credentials.');
        assert.fail('Missing Naver credentials');
      }

      // Step 1: Login to Naver
      console.log('Step 1: Login to Naver');
      await loginNaver(driver, email, password);
      // assert.isTrue(await driver.wait(until.urlIs('https://www.naver.com/'), 5000), 'Login successful');

      // Step 2: Create a blog and post content
      // console.log('Step 2: Create a blog and post content');
      // await createBlog(driver, userInput.imageFilePath, userInput.txtFilePath);
      // const successMessageElement = await driver.wait(until.elementLocated(By.css('.blog-post-success-message')), 10000);
      // await driver.wait(until.elementIsVisible(successMessageElement), 10000);
      // assert.isTrue(await successMessageElement.isDisplayed(), 'Blog creation successful');

      console.log('Test completed successfully');
    } catch (error) {
      console.error('Test failed:', error);
      assert.fail('Test failed: ' + error.message);
    } finally {
      if (driver) {
        // await driver.quit();
        console.log('WebDriver quit');
      }
    }
  });
});


// C:\Users\salah\Downloads\Tez-Yoz.png

// this is selenium blog sample