# Create Learning Paths

This project takes in data from two CSV files (student tests data and domains data), and outputs a "learning path" for each student. The learning path assigns the student work in the domain in which they're weakest, and gradually builds up work in each domain as the student's abilities get stronger.

## Getting Started

This project uses Node.js, Mocha and Chai for testing, and the Node csv-parse package.

Install dependencies using 'npm install' or 'yarn install'

### Running the program

-Make sure student test data is saved as student_tests.csv (with headers as the first row of data) and domain data is saved as domain_order.csv (with headers at the begining of each row).

-Also, delete the contents of csvPaths/paths_output.csv if there's anything in there before running the program.

To Run:

npm start


## Running the tests

npm test
