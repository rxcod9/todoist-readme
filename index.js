const core = require("@actions/core");
const axios = require("axios");
const Humanize = require("humanize-plus");
const fs = require("fs");
const exec = require("./exec");

const TODOIST_API_KEY = core.getInput("TODOIST_API_KEY");
const TODOIST_LENGTH = Number.parseInt(core.getInput("TODOIST_LENGTH")) || 10;
const PREMIUM = core.getInput("PREMIUM");

async function main() {
  // v8 => v9
  const tasks = await axios.post(
    "https://api.todoist.com/sync/v9/sync",
    {
      "resource_types": [
        "items",
        "projects",
        "sections"
      ],
      "sync_token": "*"
    },
    { headers: { Authorization: `Bearer ${TODOIST_API_KEY}` } }
  );
  await updateReadme(tasks.data);
}

let todoist = [];
let jobFailFlag = false;
const README_FILE_PATH = "./README.md";

async function updateReadme(data) {
  const { items, projects, sections } = data;

  todoist.push('| Task        | Project           | Section  |');
  todoist.push('| ------------- |:-------------:| -----:|');

  items.slice(0, TODOIST_LENGTH).forEach(itemEach => {
    let project = projects.find(projectEach => projectEach.id === itemEach.project_id);
    let section = sections.find(sectionEach => sectionEach.id === itemEach.section_id);
    let sectionName = section && section.name || 'Pending';
    todoist.push(`| ${itemEach.content}        | ${project.name}           | ${sectionName}  |`);
  });

  if (todoist.length == 0) return;

  if (todoist.length > 0) {
    // console.log(todoist.length);
    // const showTasks = todoist.reduce((todo, cur, index) => {
    //   return todo + `\n${cur}        ` + (((index + 1) === todoist.length) ? '\n' : '');
    // })
    const readmeData = fs.readFileSync(README_FILE_PATH, "utf8");

    const newReadme = buildReadme(readmeData, todoist.join("           \n"));
    if (newReadme !== readmeData) {
      core.info("Writing to " + README_FILE_PATH);
      fs.writeFileSync(README_FILE_PATH, newReadme);
      if (!process.env.TEST_MODE) {
        commitReadme();
      }
    } else {
      core.info("No change detected, skipping");
      process.exit(0);
    }
  } else {
    core.info("Nothing fetched");
    process.exit(jobFailFlag ? 1 : 0);
  }
}

// console.log(todoist.length);

const buildReadme = (prevReadmeContent, newReadmeContent) => {
  const tagToLookFor = "<!-- TODO-IST:";
  const closingTag = "-->";
  const startOfOpeningTagIndex = prevReadmeContent.indexOf(
    `${tagToLookFor}START`
  );
  const endOfOpeningTagIndex = prevReadmeContent.indexOf(
    closingTag,
    startOfOpeningTagIndex
  );
  const startOfClosingTagIndex = prevReadmeContent.indexOf(
    `${tagToLookFor}END`,
    endOfOpeningTagIndex
  );
  if (
    startOfOpeningTagIndex === -1 ||
    endOfOpeningTagIndex === -1 ||
    startOfClosingTagIndex === -1
  ) {
    core.error(
      `Cannot find the comment tag on the readme:\n<!-- ${tagToLookFor}:START -->\n<!-- ${tagToLookFor}:END -->`
    );
    process.exit(1);
  }
  return [
    prevReadmeContent.slice(0, endOfOpeningTagIndex + closingTag.length),
    "\n",
    newReadmeContent,
    "\n",
    prevReadmeContent.slice(startOfClosingTagIndex),
  ].join("");
};

const commitReadme = async () => {
  // Getting config
  const committerUsername = "Ramakant Gangwar";
  const committerEmail = "gangwar.ramakant@gmail.com";
  const commitMessage = "Todoist updated.";
  // Doing commit and push
  await exec("git", ["config", "--global", "user.email", committerEmail]);
  await exec("git", ["config", "--global", "user.name", committerUsername]);
  await exec("git", ["add", README_FILE_PATH]);
  await exec("git", ["commit", "-m", commitMessage]);
  // await exec('git', ['fetch']);
  await exec("git", ["push"]);
  core.info("Readme updated successfully.");
  // Making job fail if one of the source fails
  process.exit(jobFailFlag ? 1 : 0);
};

(async () => {
  await main();
})();
