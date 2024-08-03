const { Telegraf, Scenes, session } = require('telegraf');
const token = "7282294046:AAE1yawEjPg0Rj3cO9xgCsfU6C2lTxGplxs"
const bot = new Telegraf(token);
const { Stage } = Scenes;
const stage = new Stage();
bot.use(session());
bot.use(stage.middleware());
console.log(`bot ready`);
module.exports = {
  bot,
  Scenes,
  stage
}