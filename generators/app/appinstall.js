const request = require('request');
const fs = require('fs');
const admZip = require('adm-zip');

var self = module.exports = {
  getAndGenerate: (appurl, dounzip, appdetails, path) => {
    console.log('\nGenerating your jBPM Business App ZIP using ' + appurl + '....');

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
  },
  doTheUnzip: (zipfile, path) => {
    var zip = new admZip(zipfile);
    zip.extractAllTo(path, true);
  }
};
