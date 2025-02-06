# data visualisation project

## 0. submission details 
deadline: noon Tue 11/03/23

submit as PDF (A4 w/ margin at least 2cm) upto 3000 words

submit implementation and report in a .zip file named with the candidate nubmer

front page (not in word count): project title, candidate number, "I declare that, except where otherwise indicated, this mini-project is entirely my own work, and that it has not been previously submitted and/or assessed and is not due to be submitted on its entirety or inpart for any other course, module or assignment"

## 1. implementation (55 marks)
implement a visual analysis app/interactive data-driven story (narrative visualisation) in D3.js ready to be deployed and consumed by the intended audience.
any topic is fine.
design interface with usage scenario in mind
ensure interface and functionality either
- allow user to answer my proposed questions
- communicate a message(s)
### guidelines & requirements
- dataset must be public (link to them)
- visualisation should be standalone with `index.html`
- no custom backends allowed (only JS, D3.js, HTML, CSS)
### markscheme
1. Design (25 marks)
   - 2+ views/visualisation components
   - 1+ view must be innovative (significant extension of visualisation in coursework or novel visualisation component)
   - don't just reuse content from course. extend with different visual encoding or different interactivity
   - use different files for different visualisation components using functions to promote code reuse
2. Functionality (20 marks)
   - coordinate views with linked highlighting (messing w 1 view affects another)
   - 2+ UI widgets should allow data filtering, update views interactively or provide more info
3. Style & Polish (10 marks)
   - interface should be self-documenting
   - meaningful title
   - appropriate labels and displayed text for panels, axes, interactive HTML elements, legends, descriptions facilitating idiom interaction
   - use CSS for consistent styling

## 2. report (45 marks)
written report describing project with detail based on Visual Analysis Design (lectures)
submit a PDF. standalone document fully describing project < 3000 words. use screenshots.
### format
1. overview (5 marks)
   - teaser screenshot of visualisation
   - < 250 word summary of project. what is the problem? how do we address it? who is the audience?
2. data (5 marks)
   - link the datasource and assosciated metadata
   - describe original and derived data in domain specific and abstract language (dataset type, datatypes, range/cardinality). discuss data features and subsets used in the application. if the data has 20+ attributes and you will visualise them all, you may provide a high-level descriptor of groups of attributes
   - describe data preprocessing pipeline. this may be done in other languages.
3. goals & tasks (10 marks)
   - describe intended tasks in domain-specific and abstract language. aim for 4 tasks don't discuss visual encoding or interaction idioms chosen.
4. visualisation (20 marks)
   - describe visualisation interface built. what views are there? what do they let users do? per view, describe visual encoding choices, include rationale for design choices. analyse visual encoding of innovative view (detail) in terms of marks and channels. for other views, if covered in lectures, describe concisely - just explain how data abstraction is mapped to view elements
   - provide rationale for design choices of visual encoding and interaction including appropriate colour scheme choices. why are they appropriate in terms of course principles for chosen data and tasks?
5. usage scenario (5 marks)
   - include usage scenario walking through how visualisation can be used during interactive session illustrated with screenshots of system in action
6. credits (0 marks)
   - indicate inspiration, specifc D3.js code blocks consulted and changes made and their magnitude
