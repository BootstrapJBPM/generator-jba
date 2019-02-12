const packagejs = require("../../package.json");
const BaseGenerator = require("generator-jhipster/generators/generator-base");
const chalk = require("chalk");
const config = require("./config");
const appinstall = require("./appinstall");
const systempath = require("path");
const figlet = require("figlet")

module.exports = class extends BaseGenerator {
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

  get initializing() {
    return {
      displayLogo() {
        this.log(chalk.yellow(
          figlet.textSync("jBPM  Business  Apps", {
            horizontalLayout: "full"
          })
        ));
        this.log(
          `\nWelcome to the ${chalk.bold.yellow(
            "JHipster jBPM Business Apps"
          )} generator! ${chalk.yellow(`v${packagejs.version}\n`)}`
        );
      }
    };
  }

  prompting() {
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
    appinstall.getAndGenerate(
      this.site,
      this.dounzip,
      this.appDetails,
      this.path
    );
  }
};
