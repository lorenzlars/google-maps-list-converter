const csv = require('csvtojson');
const builder = require('xmlbuilder');
const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const cliProgress = require('cli-progress');
const lodash = require('lodash');

class Extractor {
    driver = null

    async start() {
        if (!this.driver) {
            const options = new chrome.Options();
            // options.addArguments('--headless');

            this.driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
        }
    }

    async stop() {
        await this.driver.quit();
    }

    async getCoordinates(url) {
        const regex = /\/@([-0-9.]+),([-0-9.]+),/;

        try {
            await this.driver.get(url);

            const isValidUrl = await this.driver.wait(async () => {
                const currentUrl = await this.driver.getCurrentUrl();

                return currentUrl.match(regex) !== null;
            }, 30000);

            if (!isValidUrl) {
                return null
            }

            const currentUrl = await this.driver.getCurrentUrl();
            const coordinates = currentUrl.match(regex);
            const latitude = coordinates[1];
            const longitude = coordinates[2];


            return { longitude, latitude };
        } catch (error) {
            console.error(error);

            return null
        }
    }

}