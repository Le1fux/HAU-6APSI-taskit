# TaskIt

## Midterm reflection journal

**Course / Class Code:** 6APSI / 2240
**GitHub:** [Le1fux](https://github.com/Le1fux)

## A. The frontend, in my own words

I covered most of the frontend in my Prelim Reflection Journal, so I will not
repeat it here. What I would add is that building TaskIt's design system showed
me that a project looks deliberate when design decisions are made once and
reused through tokens for colour, typography, spacing, and components.

## B. The backend half

With Node, I learned that a server is a program that keeps running and listens
on a port for incoming requests. Express lets me define routes, which tell the
server what code to run for a particular URL and HTTP method.

REST became clearer when I understood resources and verbs. The URL represents a
resource, and the HTTP method is the action performed on it: GET retrieves, POST
creates, PUT or PATCH changes, and DELETE removes. In the **REST API / Express
Activity**, I wrote a `POST /api/materials` endpoint. It accepted a material title
and content in the request body and returned the newly created material as JSON.

PostgreSQL showed me what SQL provides that a JavaScript array does not. An array
only holds data while the application is running, but PostgreSQL stores
structured data persistently and lets me query it after a restart. A useful query
was:

```sql
SELECT * FROM materials ORDER BY uploaded_at DESC;
```

This mattered because saved materials needed to be returned in a predictable
order, with the newest first.

The biggest surprise was connecting the frontend and API. An endpoint that
worked in Postman did not automatically work from my React form. The bug in the
next section showed me that a working backend endpoint is only one part of a
full-stack application.

## C. What clicked, and what is still shaky

### What clicked

The purpose of an Express route finally made sense. Before the backend lessons,
a URL felt like just a page address. The **REST API / Express Activity** showed
me that a route can represent a resource and connect a request to server-side
logic.

### What is still difficult

I still do not completely understand how to trace a failed POST request from the
React form through Express and into PostgreSQL without checking each layer
separately. I understand each part individually, but not yet the complete path
of one request.

### Backend bug I solved

The backend bug I am most proud of was a React-to-Express request problem. The
POST endpoint worked in Postman but failed from the React form. I compared the
successful and failed requests, checked the request body and `Content-Type`
header, and found that the frontend was sending JSON while the backend expected a
different format. Correcting the request format fixed the connection.

### Error message I recognize now

I recognize `Cannot read properties of undefined (reading 'map')` more quickly
now. I first encountered it while working with data in React. It usually means
`.map()` was called before the value was an array, so I check the initial value,
the API response, and the render timing.

## D. How I work

When I get stuck now, I first isolate which part of the application is causing
the problem. I check the browser console and Network tab, then the Express
terminal output, and finally the database. This is different from earlier in the
course, when I would change several things at once.

I also use AI tools to explain concepts, troubleshoot errors, and suggest code.
During the **Backend Integration Activity**, AI gave me request code that looked
correct but did not work because the request body format did not match what the
backend expected. I had to compare the actual request before finding the problem,
which taught me to verify AI-generated code instead of trusting it automatically.

I left the **Backend Integration Activity** too close to the deadline. The cost
was having to troubleshoot the frontend request, Express route, and database
connection at nearly the same time. For the final project, I want to keep
breaking work into smaller testable pieces, but stop waiting until the deadline
before connecting them.

## E. Looking forward to the final project

TaskIt relies heavily on the React component and state work from the planning
documents, especially the **Material Detail** and **Quiz** routes. The React
components and state activity taught me how to structure these screens and manage
changing information.

My biggest gap is confidently connecting React to my own Express API and
PostgreSQL database.

Two weeks from now, I will have a working `POST /api/materials` endpoint
connected to the **My Materials** form that saves a material row in PostgreSQL.
That gives me one concrete, testable feature instead of only saying that I have
started coding.
