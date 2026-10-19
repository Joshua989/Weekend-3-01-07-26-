# IRO – Community Needs Questionnaire (Google Form design)

**Title:** IRO (Issues Reporting Outlet) – Student & Indigene Survey
**Target respondents:** AAUA students and indigenes of Akungba, Iwaro, Etioro, Ayegunle, Oke-Oka and neighbouring communities.
**Purpose:** Find out what issues arise between students and indigenes, how they are reported today, and what a web-based reporting outlet must offer to be trusted and used.

**Form description (shown to respondents):**
> This short survey is part of a CSC426 project at Adekunle Ajasin University, Akungba-Akoko. We are designing IRO, a website where students and indigenes can report issues that affect them and follow those reports until they are resolved. Your answers are anonymous and are used only for this project. It takes about 5 minutes.

**How to create the form:** open [script.google.com](https://script.google.com), create a new project, paste in [`createForm.gs`](createForm.gs), and run `createIroForm`. The script builds the form below, including the branching, and logs the edit and share links. You can also build it by hand from this document.

---

## Section 1 – About you (everyone)

| # | Question | Type | Options | Required |
|---|----------|------|---------|----------|
| 1 | Which of these best describes you? | Multiple choice (**branches**) | AAUA Student → Section 2 · Indigene / Resident of the host communities → Section 3 · Both (student and indigene) → Section 2 · Other (staff, trader, visitor) → Section 4 | Yes |
| 2 | Gender | Multiple choice | Male · Female · Prefer not to say | No |
| 3 | Age range | Multiple choice | Under 18 · 18–24 · 25–34 · 35–49 · 50 and above | Yes |

## Section 2 – Students only

| # | Question | Type | Options | Required |
|---|----------|------|---------|----------|
| 4 | Level | Multiple choice | 100 · 200 · 300 · 400 · 500 · Postgraduate | Yes |
| 5 | Faculty | Dropdown | Science · Arts · Education · Social Sciences · Law · Agriculture · Environmental Design & Management · Basic Medical Sciences · Administration & Management Sciences · Other | Yes |
| 6 | Where do you live? | Multiple choice | On-campus hostel · Off-campus in Akungba · Iwaro · Etioro · Ayegunle · Oke-Oka · Another town | Yes |

→ continue to Section 4

## Section 3 – Indigenes / residents only

| # | Question | Type | Options | Required |
|---|----------|------|---------|----------|
| 7 | Which community are you from or live in? | Multiple choice | Akungba · Iwaro · Etioro · Ayegunle · Oke-Oka · Other | Yes |
| 8 | Occupation | Multiple choice | Landlord / property owner · Trader / business owner · Commercial driver / okada rider · Farmer · Civil servant · Traditional / community leader · Artisan · Other | Yes |
| 9 | How long have you lived in the community? | Multiple choice | Less than 2 years · 2–5 years · 6–10 years · More than 10 years | Yes |

→ continue to Section 4

## Section 4 – Issues you have experienced (everyone)

| # | Question | Type | Options | Required |
|---|----------|------|---------|----------|
| 10 | In the past 12 months, which of these issues have you experienced or witnessed between students and indigenes? | Checkboxes | Security / theft / robbery · Accommodation & rent disputes · Land & property disputes · Harassment / assault · Cultural or festival conflicts (e.g. Oro, masquerade restrictions) · Sanitation & environmental issues · Water, power & utilities · Transport / okada disputes · Market prices & exploitation · Noise & night-time disturbance · None · Other | Yes |
| 11 | Which ONE issue affects you the most? | Short answer | – | No |
| 12 | How often do such issues happen around you? | Linear scale 1–5 | 1 = Rarely · 5 = Very often | Yes |
| 13 | Did you report the last issue you experienced? | Multiple choice | Yes · No · I have not experienced any issue | Yes |

## Section 5 – How issues are reported today (everyone)

| # | Question | Type | Options | Required |
|---|----------|------|---------|----------|
| 14 | Where do people currently report these issues? | Checkboxes | Student Union / SUG · Students' Affairs / Dean of Students · Campus security · Police · Oba / Baale / community chiefs · Landlord association · Social media / WhatsApp groups · Friends or family only · Nowhere | Yes |
| 15 | If you have not reported an issue before, why not? | Checkboxes | Did not know where to report · Fear of victimisation · Nothing would be done · Process is too slow · Did not want my identity known · It was too minor · Other | No |
| 16 | How satisfied are you with how issues are currently resolved? | Linear scale 1–5 | 1 = Very dissatisfied · 5 = Very satisfied | Yes |

## Section 6 – The proposed IRO platform (everyone)

| # | Question | Type | Options | Required |
|---|----------|------|---------|----------|
| 17 | Would you use a website to report issues and follow their progress? | Multiple choice | Yes · Maybe · No | Yes |
| 18 | How important is it that you can report **anonymously**? | Linear scale 1–5 | 1 = Not important · 5 = Very important | Yes |
| 19 | Which features would you want? | Checkboxes | Anonymous reporting · Ticket number to track my report · SMS / email updates · Upload photo or video evidence · Report in Yoruba as well as English · Emergency contact numbers · Public summary of resolved issues · Option to chat with the desk officer | Yes |
| 20 | Which device would you mostly use? | Multiple choice | Smartphone · Laptop / desktop · Feature phone (SMS only) · Cyber café | Yes |
| 21 | Who should handle reports sent through IRO? | Checkboxes | University management (Students' Affairs) · SUG · Community leaders · A joint town–gown committee · Police / security agencies | Yes |
| 22 | Any other suggestion for IRO? | Paragraph | – | No |

---

## Analysis plan

- Q1 splits every result into **student** and **indigene** views so the two groups can be compared.
- Q10 and Q11 rank the issue categories used in the app's *Category* list.
- Q13–Q16 measure the current reporting gap (the problem analysed in the Ishikawa diagram).
- Q17–Q21 confirm demand and prioritise the requirements listed in the SRS.
