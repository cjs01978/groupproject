# The Daily Dawg 🐕

This is our Scheduling/Weather app for Georgia students. It is intended to provide accurate weather information and help students plan their schedules around it.

Group Members: Timothy Chung, Iris Choi, Ran Tan, Connor Slabiak

## Getting Started

First, create .env file in the project root with contents:

NEXT_PUBLIC_DOMAIN=http://localhost:3000/
NEXT_PUBLIC_API_DOMAIN=http://localhost:3000/api
MONGODB_URI=[MYCONNECTIONSTRING] 

# Then, run the development server:

```bash
npm install
npm install mongodb date-fns
npm install mongodb mongoose
npx install next-auth@beta
npx auth secret
npm i bcryptjs
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


