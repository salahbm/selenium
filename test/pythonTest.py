# # Importing necessary libraries
# from oauth2client.service_account import ServiceAccountCredentials
# import os
# from googleapiclient.discovery import build
# from httplib2 import Http
# from oauth2client import file, client, tools
# from googleapiclient.http import MediaFileUpload
# from __future__ import print_function
# import pickle
# import os.path
# from googleapiclient.discovery import build
# from google_auth_oauthlib.flow import InstalledAppFlow
# from google.auth.transport.requests import Request
# import warnings
# from selenium import webdriver
# from selenium.webdriver.support import expected_conditions as EC
# from selenium.webdriver.common.keys import Keys 
# from selenium.webdriver.common.action_chains import ActionChains
# from selenium.common.exceptions import NoSuchElementException, StaleElementReferenceException
# from bs4 import BeautifulSoup
# import time
# import pyperclip
# import requests
# import datetime
# import pymssql
# import pandas as pd
# from pandas.core.frame import DataFrame
# import matplotlib.pyplot as plt
# import chromedriver_autoinstaller
# import subprocess
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.alert import Alert
# import chromedriver_autoinstaller
# import subprocess
# import shutil 
# import xlrd
# import openpyxl 
# import pygsheets
# import csv
# import re
# import webbrowser
# import os
# import sys
# import urllib.request
# import json
# from pandas.io.json import json_normalize
# import hashlib
# import hmac
# import base64
# import numpy as np
# import autoit  # autoit must be installed

# # Suppressing warnings
# warnings.filterwarnings('ignore')

# # Uncomment the code below if you want to delete cookies and cache files
# # try:
# #     shutil.rmtree(r"c:\chrometemp")  # Delete cookies and cache files
# # except FileNotFoundError:
# #     pass

# # Launching Chrome with remote debugging port
# subprocess.Popen(r'C:\Program Files\Google\Chrome\Application\chrome.exe --remote-debugging-port=9222 --user-data-dir="C:\chrometemp"')

# # Setting up Chrome options
# option = Options()
# option.add_experimental_option("debuggerAddress", "127.0.0.1:9222")
# chrome_ver = chromedriver_autoinstaller.get_chrome_version().split('.')[0]
# try:
#     driver = webdriver.Chrome(f'./{chrome_ver}/chromedriver.exe', options=option)
# except:
#     chromedriver_autoinstaller.install(True)
#     driver = webdriver.Chrome(f'./{chrome_ver}/chromedriver.exe', options=option)

# # Maximizing window and setting up implicit wait
# driver.maximize_window()  # Maximize window
# time.sleep(3)
# driver.implicitly_wait(10)

# # Setting up ActionChains
# action = ActionChains(driver)

# # Navigating to Naver
# url = 'https://www.naver.com'
# driver.get(url)
# time.sleep(5)
# driver.implicitly_wait(10)

# # Clicking on the login link
# driver.find_element_by_class_name('link_login').click()
# time.sleep(1)
# driver.implicitly_wait(10)

# # Finding elements for ID and password
# tag_id = driver.find_element_by_name('id')
# tag_pw = driver.find_element_by_name('pw')
# driver.implicitly_wait(10)

# # Entering ID
# tag_id.click()
# pyperclip.copy('id') 
# tag_id.send_keys(Keys.CONTROL, 'v')
# time.sleep(2)
# driver.implicitly_wait(10)

# # Entering password
# tag_pw.click()
# pyperclip.copy('pw')
# tag_pw.send_keys(Keys.CONTROL, 'v')
# time.sleep(2)
# driver.implicitly_wait(10)

# # Clicking on the login button
# login_btn = driver.find_element_by_id('log.login')
# login_btn.click()
# time.sleep(1)
# driver.implicitly_wait(10)

# # Handling registration prompt
# try:
#     driver.find_element_by_xpath('//*[@id="new.dontsave"]').click()  # Clicking on "Do not register"
# except NoSuchElementException:
#     pass
# time.sleep(1)
# driver.implicitly_wait(10)

# # Navigating to Naver Post
# url = 'https://post.naver.com'
# driver.get(url)
# time.sleep(2)
# driver.implicitly_wait(10)

# # Clicking on the "Write Post" button
# post_btn = driver.find_element_by_xpath('//*[@id="header"]/div[1]/a[3]')
# post_btn.click()
# time.sleep(3)
# driver.implicitly_wait(10)

# # Handling pop-up
# # position = pyautogui.position()  # Get cursor position
# # print(pyautogui.size())  # Check screen size
# # while True:
# #     print("Current Mouse Position: ", pyautogui.position())
# #     time.sleep(1)

# # Automatically posting
# health_naver_posting = pd.read_excel('C:/Users/user/Desktop/folder/folder/blog_viewracle.xlsx')

# for i in range(1, 16):
#     url = 'https://post.editor.naver.com/editor'
#     driver.get(url)
#     time.sleep(1)
#     driver.implicitly_wait(10)
#     action = ActionChains(driver)

#     # Handling leaving site and pressing Enter
#     try:
#         alert = driver.switch_to.alert
#         message = alert.text
#         print("Alert shows following message: " + message)
#         time.sleep(1)
#         alert.accept()
#         time.sleep(1)
#         driver.implicitly_wait(10)
#         driver.get(url)
#         time.sleep(1)
#         driver.send_keys(Keys.ENTER)
#         driver.implicitly_wait(10)
#     except:
#         print("no alert")

#     # Handling another alert and dismissing it
#     try:
#         alert = driver.switch_to.alert
#         message = alert.text
#         print("Alert shows following message: " + message)
#         time.sleep(2)
#         alert.dismiss()
#         time.sleep(1)
#         driver.implicitly_wait(10)
#     except:
#         print("no alert")

#     time.sleep(1) 
#     driver.implicitly_wait(10)

#     title_directory = health_naver_posting.loc[i]['title_2']
#     img_file_directory = health_naver_posting.loc[i]['img_directory']
#     txt_file_directory = health_naver_posting.loc[i]['txt_directory']
#     img_dir = img_file_directory

#     f = open(txt_file_directory, 'r', encoding='utf-8')
#     f_2 = open(txt_file_directory, 'r', encoding='utf-8')

#     content_list = f.readlines()
#     blogger_title = title_directory
#     blogger_title_2 = blogger_title.replace("\ufeff", "") 

#     content_desc = f_2.read()
#     tistory_title = str(blogger_title_2)

#     # Naver Post Title Entry
#     iframes = driver.find_elements_by_tag_name('iframe')
#     driver.switch_to.frame(iframes[0])

#     tag_title = driver.find_element_by_xpath("//textarea[@placeholder='제목']")
#     tag_title.click()
#     time.sleep(1) 
#     title = str(tistory_title)
#     time.sleep(1) 
#     action.send_keys(title).perform()
#     action = ActionChains(driver)
#     time.sleep(1)
#     driver.implicitly_wait(10)

#     # Content Entry
#     tag_content = driver.find_element_by_xpath("//div[@class='se_editView']")
#     tag_content.click()
#     time.sleep(1)
#     driver.implicitly_wait(10)

#     # Introduction
#     content_1 = str(content_list[0])
#     action.send_keys(content_1).perform()
#     action = ActionChains(driver)
#     time.sleep(1)
#     driver.implicitly_wait(10)

#     # Body
#     for j in range(1, len(content_list) - 1):
#         content_2 = str(content_list[j])
#         action.send_keys(content_2).perform()
#         action = ActionChains(driver)
#         time.sleep(1)
#         driver.implicitly_wait(10)

#     # Adding image
#     if img_file_directory != 'no_image':
#         # Adding image
#         tag_add_img = driver.find_element_by_xpath("//button[@class='se-2d62a39d se-ff2750f7 se-l-icon-plus']") 
#         tag_add_img.click()
#         time.sleep(1)
#         driver.implicitly_wait(10)

#         # Switching to the image upload iframe
#         iframes = driver.find_elements_by_tag_name('iframe')
#         driver.switch_to.frame(iframes[2])
#         time.sleep(1)
#         driver.implicitly_wait(10)

#         # Uploading the image
#         tag_file_upload = driver.find_element_by_xpath("//input[@type='file']")
#         tag_file_upload.send_keys(img_file_directory)
#         time.sleep(1)
#         driver.implicitly_wait(10)

#         # Waiting for the image to upload
#         time.sleep(5)
#         driver.implicitly_wait(10)

#         # Switching back to the main iframe
#         driver.switch_to.default_content()
#         time.sleep(1)
#         driver.implicitly_wait(10)

#     # Posting
#     tag_post_btn = driver.find_element_by_xpath("//button[@class='se-3e1641a2 se-ff2750f7 se-ff2750f7-primary-large']") 
#     tag_post_btn.click()
#     time.sleep(5)
#     driver.implicitly_wait(10)

#     # Writing to the Excel file
#     health_naver_posting.loc[i, 'naver_posting'] = 'O'

#     # Waiting before moving on to the next post
#     time.sleep(2)
#     driver.implicitly_wait(10)

# # Exiting the browser
# driver.quit()
