// Automation project: api/submit.js

import { Builder, By, until, Key } from 'selenium-webdriver';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000; // Choose a port for your API

app.use(cors());
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  const { header, body, username, pw } = req.body;

  let driver;

  try {
    driver = await new Builder().forBrowser('MicrosoftEdge').build();
    await loginToNaver(driver, username, pw);
    assert.isTrue(await driver.wait(until.urlIs('https://www.naver.com/'), 5000), 'Login successful');

    // Use the received data for blog creation
    await createBlog(driver, header, body);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (driver) {
      await driver.quit();
    }
  }

  res.status(200).json({ message: 'Request processed successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
