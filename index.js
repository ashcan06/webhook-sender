import fetch from 'node-fetch';
import readline from 'readline';
import chalk from 'chalk';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const typingSpeed = 20;
let isRunning = false;

const colors = {
  info: chalk.cyan,
  success: chalk.green,
  error: chalk.red,
  prompt: chalk.yellow,
  text: chalk.magenta
};

const typeWriterEffect = async (text) => {
  for (const char of text) {
    process.stdout.write(colors.text(char));
    await new Promise((resolve) => setTimeout(resolve, typingSpeed));
  }
  console.log("");
};

const askQuestion = (question) => {
  return new Promise((resolve) => rl.question(colors.prompt(question), resolve));
};

const sendWebhook = async (webhookUrl, message, count) => {
  for (let i = 0; i < count; i++) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `${message} ` })
      });

      if (response.ok) {
        console.log(colors.success(`Webhook sent successfully.`));
      } else {
        console.error(colors.error(`Failed to send webhook. Status: ${response.status}`));
      }
    } catch (error) {
      console.error(colors.error(`Error while sending webhook: ${error.message}`));
    }
  }
};

const startSender = async () => {
  if (isRunning) {
    console.log(colors.error("Webhook sender is already running."));
    return;
  }
  isRunning = true;

  await typeWriterEffect("Welcome to the Webhook Sender!");

  const webhookUrl = await askQuestion("Enter Webhook URL: ");
  const message = await askQuestion("Enter message to send: ");
  const numberOfRequests = parseInt(await askQuestion("Number of messages to send: "), 10);

  console.log(colors.info(`\nSending ${numberOfRequests} messages to ${webhookUrl}...\n`));
  await sendWebhook(webhookUrl, message, numberOfRequests);
  console.log(colors.success("\nAll messages sent!"));

  isRunning = false;
};

const main = async () => {
  await typeWriterEffect("Starting Webhook Sender Tool...");
  while (true) {
    const command = await askQuestion("\nEnter command (start/exit): ");
    if (command.toLowerCase() === 'start') {
      await startSender();
    } else if (command.toLowerCase() === 'exit') {
      console.log(colors.info("Exiting the tool..."));
      rl.close();
      break;
    } else {
      console.log(colors.error("Invalid command. Please enter 'start' or 'exit'."));
    }
  }
};

main();
