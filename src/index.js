const csv = require('csvtojson');
const builder = require('xmlbuilder');
const fs = require('fs');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const cliProgress = require('cli-progress');
const lodash = require('lodash');


const csvFilePath = process.argv[2];
const outputFileName = process.argv[3];

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

async function convertCsvToKml(threads) {
    const extractors = []

    try {
        const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
        const jsonArray = await csv().fromFile(csvFilePath, {});
        const kmlBuilder = builder.create('kml', { version: '1.0', encoding: 'UTF-8' })
            .att('xmlns', 'http://www.opengis.net/kml/2.2')
            .ele('Document');

        progressBar.start(jsonArray.length, 0)

        const processes = lodash.chunk(jsonArray, Math.ceil(jsonArray.length / threads)).map((chunk) => {
            const extractor = new Extractor()


            const tasks = chunk.map(async (row) => {
                const placemark = kmlBuilder.ele('Placemark');

                placemark.ele('name', row['Titel']);
                placemark.ele('description', `${row['Notiz']}\n\n${row['URL']}`);

                const coordinates = await extractor.getCoordinates(row['URL'])

                if (coordinates) {
                    const point = placemark.ele('Point');
                    point.ele('coordinates', `${coordinates.longitude},${coordinates.latitude}`);
                }

                progressBar.increment()
            })

            extractors.push(extractor)
            extractor.start()

            return tasks
        });



        for (let i = 0; i < processes.length; i++) {
            for (const task of processes[i]) {
                await task()
            }
        }

        // for (const row of jsonArray) {
        //     const placemark = kmlBuilder.ele('Placemark');

        //     placemark.ele('name', row['Titel']);
        //     placemark.ele('description', `${row['Notiz']}\n\n${row['URL']}`);

        //     const coordinates = await extractor.getCoordinates(row['URL'])

        //     if (coordinates) {
        //         const point = placemark.ele('Point');
        //         point.ele('coordinates', `${coordinates.longitude},${coordinates.latitude}`);
        //     }

        //     progressBar.increment()
        // }

        extractors.forEach(async (extractor) => {
            await extractor.stop()
        })

        progressBar.stop()

        const kmlString = kmlBuilder.end({ pretty: true });

        fs.writeFileSync(outputFileName, kmlString, 'utf8');
        console.log(`Die CSV-Datei wurde erfolgreich in "${outputFileName}" konvertiert.`);
    } catch (error) {
        console.error('Fehler beim Konvertieren der CSV-Datei:', error);
    }
}

convertCsvToKml(3);
