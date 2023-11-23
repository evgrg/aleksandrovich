module.exports = async function startParser(bot) {  try {    const fs = require('fs');    const puppeteer = require('puppeteer');    const browser = await puppeteer.launch({      headless: false,      args: ['--window-size=2400,1300']    });    let message = '';    let i = 0;    setInterval(async () => {      const links = require('./db/links.json');      let link = links[i];      const page = await browser.newPage();      await page.setViewport({        width: 2400,        height: 1300,        deviceScaleFactor: 1,      });      await page.goto(link.link);      await page.setDefaultNavigationTimeout(60000);      await page.click('.input.text-input.size');      const elements = await page.$x('//*[@id=\"app\"]/main/div/div[1]/div[2]/div/div[2]/div/div[2]/div[1]/div/div[1]/div/div[2]/ul/li[2]');      await elements[0].click();      await page.waitForTimeout(5000);      const itemPrices = await page.$$eval('.item-money', prices => prices.map(price => price.textContent.trim()));      const itemImageHrefs = await page.$$eval('.item-image a', links => links.map(link => link.href));      await page.close();      itemPrices.forEach((item, index) => {        itemPrices[index] = item.replace('₽', '').replace(/\s+/g, ' ').trim();      });      // Вывод значений      //console.log(itemPrices);      //console.log(itemImageHrefs);      itemPrices.forEach((item, index) => {        let obj = item.split(' ');        //console.log(JSON.stringify(obj));        let price = Number(obj[0] + obj[1]);        if (!obj[2]) obj[2] = '123';        let cashback = (obj[2]).includes('%') ? Number(obj[2].replace('%', '')) : 0;        if (cashback && price <= link.price && cashback >= link.cashback) {          bot.sendMessage(-1002028596063, `❗️${itemImageHrefs[index]} ❗️\n Стоимость: ${price}₽\nКешбек: ${cashback}% (${obj[3]}₽)`, {            disable_web_page_preview: true          });        }      });    }, 30000);  } catch (e) {    console.log("Something went wrong: " + e.name);  }}