import CodeBlock from "../models/CodeBlock.js";

// Seeds the MongoDB database with four predefined coding exercises for a "CodeBlock" model.
export const seedDatabase = async () => {
  await CodeBlock.deleteMany({});
  await CodeBlock.insertMany([
    {
      title: "Async Case",
      description: "Practice async/await with a simple data fetch.",
      templateCode: `async function fetchData() {
                // TODO: Fetch data from '/api/data' and return it
            }`,
      solutionCode: `async function fetchData() {
                const response = await fetch('/api/data');
                const data = await response.json();
                return data;
            }`,
    },
    {
      title: "Event Loop",
      description: "Understand how JavaScript handles the event loop.",
      templateCode: `console.log('Start');
            
            // TODO: Schedule a callback
            
            console.log('End');`,
      solutionCode: `console.log('Start');
            
            setTimeout(() => {
                console.log('Callback');
            }, 0);
            
            console.log('End');`,
    },
    {
      title: "Promises",
      description: "Resolve a promise with success message.",
      templateCode: `const promise = new Promise((resolve, reject) => {
                // TODO: Resolve the promise with 'Success'
            });
            
            // TODO: Handle the promise result`,
      solutionCode: `const promise = new Promise((resolve, reject) => {
                resolve('Success');
            });
            
            promise.then((message) => {
                console.log(message);
            });`,
    },
    {
      title: "Closure Magic",
      description: "Master closures by creating a private variable.",
      templateCode: `function outer() {
                // TODO: Define a private variable
                
                // TODO: Return a function that accesses the private variable
            }`,
      solutionCode: `function outer() {
                const secret = 'JS Magic';
                
                return function inner() {
                return secret;
                };
            }
            
            const getSecret = outer();
            console.log(getSecret());`,
    },
  ]);

  console.log("Database seeded successfully");
};
