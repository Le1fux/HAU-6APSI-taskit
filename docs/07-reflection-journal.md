# TaskIt

## Reflection journal

**Name:** Leif Levinson C. Basilio
**Course / Class Code:** 6APSI / 2240
**Student Number:** 20974408
**School Email:** lcbasilio2@student.hau.edu.ph
**GitHub:** [Le1fux](https://github.com/Le1fux)

## A. The road so far

### JavaScript fundamentals

The part I use the most now is working with arrays and objects, especially
methods such as `.map()` and `.filter()` to display and work with collections of
data instead of handling every item separately.

### React

Components, props, state, hooks, and routing all gave me trouble at some point.
State and props flowing between components took real repetition before they
stopped feeling arbitrary. I understand components and routing better now, but
deciding where state should live and how it should flow between components is
still the shakiest part for me.

### Styling and design

I use Tailwind for styling and am becoming more comfortable with it, although I
still sometimes need to look up class names and experiment with responsive
classes to get the layout right.

## B. What clicked, and what is still shaky

### One concept that finally clicked

React state made more sense when I connected it to the TaskIt quiz. Values such
as the current question, score, and revealed answer change while the user
interacts with the application. That is why they need to be managed as state
instead of being ordinary variables.

### One concept that is still confusing

I still struggle most with deciding where state should live. I sometimes know
that multiple components need the same information, but I am not always sure
whether the state should stay in the current component, move to its parent, or be
passed down through props.

### A problem I solved

One problem I worked through was getting the quiz score to update correctly after
an answer was marked right. I checked the console and the state values, then
traced where the score was being changed. I found that the state update was
relying on the previous value incorrectly, so I changed the update to use the
previous state. Testing the change immediately showed me why the score had not
been behaving as expected.

## C. How I work

### How I get unstuck

My default is trial and error in the console: I poke at the code directly and see
what breaks or fixes it instead of reading documentation first. This works when
the problem is small, but it can waste time when I am guessing instead of
understanding the actual cause. I need to get better at checking documentation
earlier.

### One habit to keep and one to change

I want to keep breaking problems into smaller pieces and testing changes instead
of trying to build everything at once. I want to change my habit of relying on
trial and error for too long before checking documentation or examining the
actual error carefully.

## D. Connecting it to the final project

### The skill TaskIt relies on most

TaskIt relies most heavily on React's state-and-props flow. Materials, questions,
and quiz results need to be shared correctly across the Materials, Material
Detail, Quiz, and Results routes. This is exactly the part of React that is still
shaky for me.

### The part I am least prepared for

Backend persistence and file handling are the parts of the plan I am least
confident building. Reading a real file and deciding whether summarization
happens client-side or through an API call is new territory for me. I will start
with a small file-reading experiment, check the documentation when I get stuck,
and test that part separately before connecting it to the rest of TaskIt.

### What I want to learn by project completion

By the end of TaskIt, I want to be able to say that I can build a React
application from my own plan instead of only following examples. I especially
want to understand state and props well enough to decide where data belongs,
connect routes without getting lost, and handle user-provided study material
without relying on trial and error for every step.
