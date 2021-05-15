/**
 * Function to append Covin's opinion to a note.
 *
 * @param {string} appointments
 */
export const appendPhoenixsOpinionToNote = (note, answer) => {
  const appendedNote = `${
    note ? `${note}\n\n` : ''
  }Covin's opinion (Dated: ${new Date()
    .toDateString()
    .substring(4)}):\n${answer}`;

  return appendedNote;
};
