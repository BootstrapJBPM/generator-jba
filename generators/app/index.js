const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const config = require("./config");
const appinstall = require("./appinstall");
const systempath = require('path');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    for (let optionName in config.options) {
      this.option(optionName, config.options[optionName]);
    }
    this.appDetails = {};
    this.site = "";
    this.dounzip = true;
    this.path = process.cwd() + systempath.sep;
  }

  prompting() {
    this.log(
      yosay(
        `Yo! I\'m here to help build your  ${chalk.red(
          "jBPM Business Application"
        )}!`
      )
    );

    const defaultAppDetails = {
      capabilities: "bpm",
      packagename: "com.company",
      name: "business-application",
      version: "",
      options: ["kjar", "model", "service"]
    };

    this.site = this.options.site;
    this.dounzip = this.options.unzip;

    if (this.options.quick && this.options.quick == true) {
      this.appDetails = defaultAppDetails;
    } else {
      return this.prompt(config.prompts).then(answers => {
        this.answers = answers;

        this.appDetails.capabilities = this.answers.capabilities;
        this.appDetails.packagename = this.answers.packagename;
        this.appDetails.name = this.answers.name;
        this.appDetails.version = this.answers.version;

        var haveKJar = false;
        var haveDKJar = false;
        if (this.answers.options.some(e => e === "kjar")) {
          haveKJar = true;
        }
        if (this.answers.options.some(e => e === "dkjar")) {
          haveDKJar = true;
        }

        if (haveKJar && haveDKJar) {
          this.answers.options.shift();
        }

        this.appDetails.options = this.answers.options;

      });
    }
  }

  writing() {
    appinstall.getAndGenerate(this.site, this.dounzip, this.appDetails, this.path);
  }

};
