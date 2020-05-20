const { getConnection } = require('../db');

const {
  formatDateToDB,
  processAndSavePhoto,
  deletePhoto
} = require('../helpers');

const { entrySchema, voteSchema, searchSchema } = require('./validations');

module.exports = {
  listEntries,
  newEntry,
  getEntry,
  deleteEntry,
  editEntry,
  voteEntry,
  getEntryVotes
};
