'use strict';

// A helper function to easily create and stringify quiz JSON for the database.
const createQuiz = (questions) => JSON.stringify({ questions });

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // --- BADGES (Must be created before they can be awarded) ---
    await queryInterface.bulkInsert('Badges', [
      { id: 1, name: 'React Rookie', icon: 'react', description: 'Complete the "React for Beginners" course.', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: 'Node.js Navigator', icon: 'node', description: 'Complete the "Node.js Essentials" course.', createdAt: new Date(), updatedAt: new Date() },
      { id: 3, name: 'Quiz Whiz', icon: 'quiz', description: 'Pass your first quiz.', createdAt: new Date(), updatedAt: new Date() },
    ], {});

    // --- COURSES ---
    await queryInterface.bulkInsert('Courses', [
      { id: 1, title: 'React for Beginners', description: 'From components to hooks, become a React expert.', createdAt: new Date(), updatedAt: new Date() },
      { id: 2, title: 'Node.js Essentials', description: 'Build powerful backends with Node.js and Express.', createdAt: new Date(), updatedAt: new Date() }
    ], {});

    // --- LESSONS (with rich content) ---
    await queryInterface.bulkInsert('Lessons', [
      // React Lessons (courseId: 1)
      { 
        title: 'Intro to JSX', 
        content: '{"videoId":"JvC7aA24m4Q", "description":"JSX is a syntax extension for JavaScript that lets you write HTML-like markup inside a JavaScript file. It makes creating complex UI trees more readable and maintainable."}', 
        lessonType: 'video', 
        courseId: 1, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Components & Props', 
        content: '{"videoId":"uvEAvxWvwOs", "description":"Components are the core building blocks of React. Learn how to create reusable UI elements and pass data to them using props."}', 
        lessonType: 'video', 
        courseId: 1, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Understanding State', 
        content: '{"text":"State is one of the most fundamental concepts in React. It is a JavaScript object that holds data for a component. When a component\'s state object changes, the component re-renders. This is what allows you to create dynamic and interactive applications. The `useState` hook is the primary way to add state to functional components."}', 
        lessonType: 'text', 
        courseId: 1, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'React Knowledge Check', 
        content: createQuiz([
          { question: "What does JSX stand for?", options: ["JavaScript XML", "JSON Extension", "Java Syntax"], answer: "JavaScript XML" },
          { question: "How do you pass data to a component?", options: ["State", "Props", "Functions"], answer: "Props" },
          { question: "What hook manages state in a component?", options: ["useEffect", "useContext", "useState"], answer: "useState" },
          { question: "Can you use a class component in modern React?", options: ["Yes", "No"], answer: "Yes" },
          { question: "What command creates a new React app?", options: ["npm new react-app", "npx create-react-app", "react new"], answer: "npx create-react-app" },
        ]), 
        lessonType: 'quiz', 
        courseId: 1, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      
      // Node Lessons (courseId: 2)
      { 
        title: 'Intro to Node.js', 
        content: '{"videoId":"SccSCuHhOw0", "description":"Node.js is a JavaScript runtime built on Chrome\'s V8 engine. It allows you to build fast and scalable server-side applications using JavaScript, a language you already know from the frontend."}', 
        lessonType: 'video', 
        courseId: 2, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Your First Express Server', 
        content: '{"videoId":"N2-FyBBxOZA", "description":"Express.js is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. Learn how to set up your first server in minutes."}', 
        lessonType: 'video', 
        courseId: 2, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'What is Middleware?', 
        content: '{"text":"In the context of Express.js, middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. These functions can execute any code, make changes to the request and the response objects, and end the request-response cycle. It\'s the backbone of any Express application."}', 
        lessonType: 'text', 
        courseId: 2, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
      { 
        title: 'Node.js Knowledge Check', 
        content: createQuiz([
          { question: "What is Node.js?", options: ["A frontend framework", "A JavaScript runtime", "A database"], answer: "A JavaScript runtime" },
          { question: "What is the most popular framework for Node.js?", options: ["React", "Angular", "Express"], answer: "Express" },
          { question: "What object represents the HTTP request?", options: ["req", "res", "next"], answer: "req" },
          { question: "What does `npm` stand for?", options: ["Node Package Manager", "New Project Maker", "Node Project Manager"], answer: "Node Package Manager" },
          { question: "Can Node.js access the file system?", options: ["Yes", "No"], answer: "Yes" },
        ]), 
        lessonType: 'quiz', 
        courseId: 2, 
        createdAt: new Date(), 
        updatedAt: new Date() 
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // This function tells Sequelize how to undo the seeding.
    // It's important to undo in the reverse order of creation to avoid errors.
    await queryInterface.bulkDelete('userbadges', null, {});
    await queryInterface.bulkDelete('userprogresses', null, {});
    await queryInterface.bulkDelete('Badges', null, {});
    await queryInterface.bulkDelete('Lessons', null, {});
    await queryInterface.bulkDelete('Courses', null, {});
  }
};

