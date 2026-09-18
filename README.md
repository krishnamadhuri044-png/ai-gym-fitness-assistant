# AI Gym & Fitness Assistant

An AI-powered Gym & Fitness Assistant designed to provide personalized workout guidance, diet planning, calorie tracking, fitness habit analysis, performance evaluation, conversational assistance, and smart gym recommendations.

## 🚀 Project Overview

The AI Gym & Fitness Assistant is an all-in-one AI fitness ecosystem that helps users manage and improve their fitness journey.

The system includes:

* 🏋️ AI Gym Trainer
* 🥗 AI Dietician & Calorie Coach
* 🤖 Virtual Gym Buddy
* 📊 Pose-to-Performance Analyzer
* 📅 AI Fitness Habit Tracker
* 💪 Smart Gym Assistant
* 📍 Gym Recommender & Planner
* 📈 Fitness Progress & Analytics
* 👨‍💼 Admin Dashboard

## ✨ Features

### 1. AI Gym Trainer

Uses computer vision technologies such as OpenCV and MediaPipe to analyze exercise movements.

Features include:

* Exercise detection
* Repetition counting
* Posture analysis
* Form correction
* Real-time feedback
* Personalized workout guidance

Supported exercises can include:

* Squats
* Push-ups
* Bicep curls
* Lunges
* Shoulder press

### 2. AI Dietician & Calorie Coach

Provides personalized diet recommendations based on:

* BMI
* Weight
* Fitness goals
* Dietary preferences
* Activity level
* Calorie requirements

Features:

* Meal recommendations
* Calorie tracking
* Nutritional tracking
* Grocery list generation

### 3. Virtual Gym Buddy

An AI conversational assistant that provides:

* Fitness guidance
* Workout motivation
* Personalized suggestions
* Progress discussions
* Conversational support
* Sentiment-aware interactions

### 4. AI Fitness Habit Tracker

Tracks user fitness behavior and provides:

* Workout streaks
* Workout completion
* Missed workout tracking
* Habit progress
* Motivational notifications
* Behavior-based recommendations

### 5. Pose-to-Performance Analyzer

Analyzes workout performance using movement information.

Generates a Performance Score based on factors such as:

* Form
* Range of motion
* Consistency
* Movement efficiency

Weekly progress reports help users monitor improvement.

### 6. Smart Gym Assistant

Provides an architecture for AI + IoT integration.

The system can work with simulated gym equipment data and is designed to support technologies such as:

* MQTT
* Node-RED

It can monitor:

* Equipment performance
* Resistance
* Repetitions
* Workout intensity
* Rest requirements

### 7. Gym Recommender & Planner

Recommends:

* Gyms
* Workout programs
* Fitness challenges

Recommendations can consider:

* Fitness goals
* Location
* Fitness level
* Workout preferences
* Historical activity

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   FastAPI Backend   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │ AI Trainer  │  │ AI Dietician│  │ AI Chatbot  │
       └─────────────┘  └─────────────┘  └─────────────┘
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    PostgreSQL DB    │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Analytics Dashboard │
                    └─────────────────────┘
```

## 🛠️ Technology Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* Axios
* Recharts / Plotly

### Backend

* Python
* FastAPI
* Pydantic
* SQLAlchemy

### AI / Machine Learning

* OpenCV
* MediaPipe
* scikit-learn
* TensorFlow / PyTorch
* NLP / LLM APIs

### Database

* PostgreSQL

### IoT

* MQTT
* Node-RED

### Storage

* AWS S3 / Firebase compatible architecture

## 📁 Project Structure

```text
ai-gym-fitness-assistant/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── hooks/
│       └── utils/
│
├── backend/
│   └── app/
│       ├── models/
│       ├── schemas/
│       ├── routes/
│       ├── services/
│       ├── ai/
│       │   ├── workout/
│       │   ├── diet/
│       │   ├── behavior/
│       │   ├── chatbot/
│       │   └── recommender/
│       ├── auth/
│       ├── database.py
│       ├── config.py
│       └── main.py
│
├── tests/
│
├── docs/
│   ├── architecture.md
│   ├── workflow.md
│   ├── api.md
│   └── testing.md
│
├── .env.example
├── .gitignore
├── README.md
└── docker-compose.yml
```

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-gym-fitness-assistant.git
cd ai-gym-fitness-assistant
```

### Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create the environment file:

```bash
copy .env.example .env
```

Configure the required database and API credentials in `.env`.

Start the backend:

```bash
uvicorn app.main:app --reload
```

Backend API:

```text
http://localhost:8000
```

FastAPI documentation:

```text
http://localhost:8000/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on the local development URL shown by Vite.

## 🔐 Environment Variables

Create a `.env` file based on `.env.example`.

Example:

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
OPENAI_API_KEY=your_api_key
```

**Never commit `.env` or API keys to GitHub.**

## 🧪 Testing

Run backend tests with:

```bash
pytest
```

Tests cover important application functionality such as:

* Authentication
* User profiles
* BMI calculation
* Workout management
* Performance analysis
* Diet functionality
* Calorie tracking
* Habit tracking
* Chat functionality
* Authorization

## 📊 Analytics

The application provides analytics for:

* Weight progression
* BMI progression
* Calories consumed
* Calories burned
* Workout frequency
* Workout duration
* Repetition progress
* Performance score
* Habit consistency

## 🔮 Future Enhancements

* Real gym equipment integration
* Advanced exercise recognition
* Wearable device integration
* Cloud deployment
* Real-time IoT equipment control
* Advanced behavioral prediction
* Mobile application
* More exercise models

## 📄 Project Documentation

Additional documentation is available in the `docs/` directory:

* Architecture
* Workflow
* API documentation
* Testing documentation

## 🎯 Project Objective

The objective is to create a unified AI-powered fitness ecosystem that acts as a smart personal trainer, dietician, motivator, and data-driven fitness manager.

The project specification identifies the major components as workout detection, diet planning, behavior tracking, IoT-based gym assistance, conversational AI, performance analysis, and gym recommendation.
