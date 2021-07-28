#!/usr/bin/env node
// vim: set ft=javascript:

/* eslint-disable no-unused-expressions */
// noinspection BadExpressionStatementJS
require('yargs')
  .usage('Manage your Contentful driven components migrations')
  .commandDir('./commands', {extensions: ["ts"]})
  .recommendCommands()
  .demandCommand(1, 'Please provide a valid command from the list above')
  .argv;
