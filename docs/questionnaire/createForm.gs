/**
 * IRO – Google Apps Script that builds the IRO survey as a Google Form.
 *
 * Usage: script.google.com → New project → paste this file → select
 * createIroForm → Run → grant permission. The edit link and the public
 * link are printed in View → Logs (Execution log).
 */
function createIroForm() {
  var form = FormApp.create('IRO (Issues Reporting Outlet) – Student & Indigene Survey');
  form.setDescription(
    'This short survey is part of a CSC426 project at Adekunle Ajasin University, Akungba-Akoko. ' +
    'We are designing IRO, a website where students and indigenes can report issues that affect them ' +
    'and follow those reports until they are resolved. Your answers are anonymous and are used only ' +
    'for this project. It takes about 5 minutes.');
  form.setCollectEmail(false);
  form.setProgressBar(true);

  // ---------- Section 1: About you ----------
  var q1 = form.addMultipleChoiceItem()
    .setTitle('Which of these best describes you?')
    .setRequired(true);
  form.addMultipleChoiceItem().setTitle('Gender')
    .setChoiceValues(['Male', 'Female', 'Prefer not to say']);
  form.addMultipleChoiceItem().setTitle('Age range').setRequired(true)
    .setChoiceValues(['Under 18', '18–24', '25–34', '35–49', '50 and above']);

  // ---------- Section 2: Students ----------
  var studentPage = form.addPageBreakItem().setTitle('Students');
  form.addMultipleChoiceItem().setTitle('Level').setRequired(true)
    .setChoiceValues(['100', '200', '300', '400', '500', 'Postgraduate']);
  form.addListItem().setTitle('Faculty').setRequired(true)
    .setChoiceValues(['Science', 'Arts', 'Education', 'Social Sciences', 'Law', 'Agriculture',
      'Environmental Design & Management', 'Basic Medical Sciences',
      'Administration & Management Sciences', 'Other']);
  form.addMultipleChoiceItem().setTitle('Where do you live?').setRequired(true)
    .setChoiceValues(['On-campus hostel', 'Off-campus in Akungba', 'Iwaro', 'Etioro',
      'Ayegunle', 'Oke-Oka', 'Another town']);

  // ---------- Section 3: Indigenes ----------
  var indigenePage = form.addPageBreakItem().setTitle('Indigenes / residents');
  form.addMultipleChoiceItem().setTitle('Which community are you from or live in?').setRequired(true)
    .setChoiceValues(['Akungba', 'Iwaro', 'Etioro', 'Ayegunle', 'Oke-Oka']).showOtherOption(true);
  form.addMultipleChoiceItem().setTitle('Occupation').setRequired(true)
    .setChoiceValues(['Landlord / property owner', 'Trader / business owner',
      'Commercial driver / okada rider', 'Farmer', 'Civil servant',
      'Traditional / community leader', 'Artisan']).showOtherOption(true);
  form.addMultipleChoiceItem().setTitle('How long have you lived in the community?').setRequired(true)
    .setChoiceValues(['Less than 2 years', '2–5 years', '6–10 years', 'More than 10 years']);

  // ---------- Section 4: Issues experienced ----------
  var issuesPage = form.addPageBreakItem().setTitle('Issues you have experienced');
  form.addCheckboxItem()
    .setTitle('In the past 12 months, which of these issues have you experienced or witnessed between students and indigenes?')
    .setRequired(true)
    .setChoiceValues(['Security / theft / robbery', 'Accommodation & rent disputes',
      'Land & property disputes', 'Harassment / assault',
      'Cultural or festival conflicts (e.g. Oro, masquerade restrictions)',
      'Sanitation & environmental issues', 'Water, power & utilities',
      'Transport / okada disputes', 'Market prices & exploitation',
      'Noise & night-time disturbance', 'None']).showOtherOption(true);
  form.addTextItem().setTitle('Which ONE issue affects you the most?');
  form.addScaleItem().setTitle('How often do such issues happen around you?').setRequired(true)
    .setBounds(1, 5).setLabels('Rarely', 'Very often');
  form.addMultipleChoiceItem().setTitle('Did you report the last issue you experienced?').setRequired(true)
    .setChoiceValues(['Yes', 'No', 'I have not experienced any issue']);

  // ---------- Section 5: Current reporting ----------
  form.addPageBreakItem().setTitle('How issues are reported today');
  form.addCheckboxItem().setTitle('Where do people currently report these issues?').setRequired(true)
    .setChoiceValues(['Student Union / SUG', "Students' Affairs / Dean of Students", 'Campus security',
      'Police', 'Oba / Baale / community chiefs', 'Landlord association',
      'Social media / WhatsApp groups', 'Friends or family only', 'Nowhere']);
  form.addCheckboxItem().setTitle('If you have not reported an issue before, why not?')
    .setChoiceValues(['Did not know where to report', 'Fear of victimisation',
      'Nothing would be done', 'Process is too slow', 'Did not want my identity known',
      'It was too minor']).showOtherOption(true);
  form.addScaleItem().setTitle('How satisfied are you with how issues are currently resolved?')
    .setRequired(true).setBounds(1, 5).setLabels('Very dissatisfied', 'Very satisfied');

  // ---------- Section 6: The IRO platform ----------
  form.addPageBreakItem().setTitle('The proposed IRO platform');
  form.addMultipleChoiceItem().setTitle('Would you use a website to report issues and follow their progress?')
    .setRequired(true).setChoiceValues(['Yes', 'Maybe', 'No']);
  form.addScaleItem().setTitle('How important is it that you can report anonymously?')
    .setRequired(true).setBounds(1, 5).setLabels('Not important', 'Very important');
  form.addCheckboxItem().setTitle('Which features would you want?').setRequired(true)
    .setChoiceValues(['Anonymous reporting', 'Ticket number to track my report',
      'SMS / email updates', 'Upload photo or video evidence',
      'Report in Yoruba as well as English', 'Emergency contact numbers',
      'Public summary of resolved issues', 'Option to chat with the desk officer']);
  form.addMultipleChoiceItem().setTitle('Which device would you mostly use?').setRequired(true)
    .setChoiceValues(['Smartphone', 'Laptop / desktop', 'Feature phone (SMS only)', 'Cyber café']);
  form.addCheckboxItem().setTitle('Who should handle reports sent through IRO?').setRequired(true)
    .setChoiceValues(["University management (Students' Affairs)", 'SUG', 'Community leaders',
      'A joint town–gown committee', 'Police / security agencies']);
  form.addParagraphTextItem().setTitle('Any other suggestion for IRO?');

  // ---------- Branching ----------
  // Q1 decides which profile section the respondent sees.
  q1.setChoices([
    q1.createChoice('AAUA Student', studentPage),
    q1.createChoice('Indigene / Resident of the host communities', indigenePage),
    q1.createChoice('Both (student and indigene)', studentPage),
    q1.createChoice('Other (staff, trader, visitor)', issuesPage)
  ]);
  // A page break's goTo controls where the section BEFORE it goes, so this
  // sends students past the indigene section straight to the issues section.
  indigenePage.setGoToPage(issuesPage);

  Logger.log('Edit link:   ' + form.getEditUrl());
  Logger.log('Share link:  ' + form.getPublishedUrl());
}
