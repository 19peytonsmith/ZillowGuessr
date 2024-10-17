# ZillowGuessr - The Zillow Listing Price Guessing Game

This is a work in progress web application hoping to be accessible to the public soon but serves currently as a project for me to learn React Native w/ Flask on the backend to perform the data-scraping job

## How to run

Once in the root directory:
Run the backend server using\
`python app.py`\
to create a **Get** endpoint to `/property_info` that will give you listing details for a random listing currently on Zillow that is **For Sale** used to retrieve the data needed on the frontend.

_Note:_
This runs a development server on port **5000**

Next, run the following commands\
`cd zillow-app`\
`npm start`\
to run the React Native frontend framework on port **3000** that runs the game web application
