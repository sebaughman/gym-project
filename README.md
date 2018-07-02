
## Project Summary

This app was a personal project built using React / Redux / Express / Node.js . The app was built for climbing gyms to utilize when employees set routes and desire climbers to rate them based off of difficulty and quality.

The app was built as a web app with mobile first in mind. I am currently working on porting it to react native.

## Walk Through

Create an account (Google oAuth) and choose whether you are a climber or a setter (they have different permissions)
---- login screen----

Once successfully authenticated, choose the gym you climb (or set) at. Material UI was used to autofill known gyms. Once a gym is added and selected, routes at that gym are displayed using React Table. Columns can be selected to sort based on their contents. If you have the role of setter, you can add a route. If you are a climber, there is no add Route button. 
-----dashbaord setter---- --- dashboard climber----


If a row is clicked, the user is taken to that routes page where they can Tick the route (I completed it),  add it to their Todo list, or comment on it. Ticking a route will prompt the user to rate its difficulty and quality.

----route page--- ---- tick popup----

If the "Add Route" button is clicked, the setter is prompted to enter the route info. Material UI was used for the form data including drop downs and date picker. Amazon S3 was used to store images.

----- add route popup----- drop down color------ datepicker----

Once a route is added and opened, if the setter is the creator of that route, they can either Edit the route or disable it. Disabling the route means it was taken down and the removal date will be set to the current date.

----- route view setter-----

The last page is the user's profile page. Here they can see all of their Ticked and Todo'ed routes.

---- profile page----



