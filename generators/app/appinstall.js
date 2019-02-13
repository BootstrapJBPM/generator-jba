const request = require('request');
const fs = require('fs');
const admZip = require('adm-zip');
const chalk = require("chalk");

var self = module.exports = {
  getAndGenerate: (appurl, dounzip, appdetails, path) => {
    console.log('\nGenerating your jBPM Business App ZIP using ' + appurl + '....');

    self.urlExists(appurl, function (err, exists) {
      if (exists) {
        request({
              url: appurl,
              followAllRedirects: true,
              method: "POST",
              body: JSON.stringify(appdetails),
              headers: {
                'Content-Type': 'application/json'
              },
              rejectUnauthorized: false
            },
            function (error, response, body) {

              if (error != null) {
                console.log("Error performing request:" + error);
              }
            }
          ).pipe(fs.createWriteStream(path + appdetails.name + '.zip'))
          .on('finish', function () {
            console.log('done');
            if (dounzip) {
              console.log('\nUnzipping your jBPM Business App.....');
              self.doTheUnzip(path + appdetails.name + '.zip', path);
              console.log('done');
            }

          });
      } else {
        console.log(chalk.red("Cannot generate application:"));
        console.log(
          chalk.red(
            "Unable to contact " +
            appurl +
            ". Check if you are online!"
          )
        );
      }
    });
  },
  doTheUnzip: (zipfile, path) => {
    var zip = new admZip(zipfile);
    zip.extractAllTo(path, true);
  },
  urlExists: (url, cb) => {
    request({
        url: url,
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json"
        },
        rejectUnauthorized: false
      },
      function (err, res) {
        if (err) return cb(null, false);
        cb(null, /4\d\d/.test(res.statusCode) === false);
      }
    );
  }
};
