---
title: Krush AI
excerpt: Krush AI-powered fashion assistant helps users find the perfect clothing fit with ease. Simply upload an image, and the AI analyzes your body proportions to suggest accurate clothing sizes and provides direct links to matching outfits. No more guesswork—just personalized, data-driven recommendations for a better shopping experience.

iframe: https://krush-ai.vercel.app/
demo: https://krush-ai.vercel.app/
src: https://github.com/rohitsingh2814/KRUSH_AI

info:
  idea: The basic idea behind Krush AI is to help people find clothes that actually fit and look good on them without the stress of trial-and-error shopping. Many people struggle to choose outfits that match their body type, size, or style, and this platform solves that problem by giving personalized recommendations using AI.
  tech: [React.js, TailwindCSS, Express.js, Node.js, MongoDB, JWT, Axios]
---

## Features

- AI Body Shape Analysis
- Personalized Clothing Recommendation
- Manual Style Quiz
- User Profile
- Affiliate Links to E-commerce
- Customizable User Experience
- History and Save for Later 

I built Krush AI because I wanted to create a platform that helps people find clothes that truly fit and suit their style. The most critical part of this project is accurately analyzing user body measurements and preferences to provide personalized outfit recommendations.

## Authentication.

I created this login page with `JWT` auth token.
It handles user `login` by sending `credentials` to your `backend API`.

> In short, This code logs in a user, stores their data locally, handles errors, and navigates them to the dashboard.

```js
const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Login failed. Please try again.');
      } else {
        // Save user data to localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(data.user));
        // If you add JWT support, also save: localStorage.setItem('authToken', data.token);
        onLogin(data.user, ''); // You can use a real token if you add JWT support
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
```

### Questionnaire

> [handleAnswer code on github](https://github.com/rohitsingh2814/KRUSH_AI/blob/main/src/components/Questionnaire.js#L161) 

Then I added an `questions` method for the `questionnaire`, which initializes all the questions and sets up the structure to handle user inputs. I also created a `handleAnswer()` method, which processes both click-based and text-based responses. If any input is not given, it `auto-advance` to next question after a short delay (only if not a text input)
```js
const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    
    // Auto-advance to next question after a short delay (only if not a text input)
    const currentQ = questions.find(q => q.id === questionId);
    const selectedOption = currentQ?.options.find(opt => opt.value === answer);
    
    if (!selectedOption?.isTextInput) {
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
        } else {
          // If this is the last question, automatically submit
          handleSubmit();
        }
      }, 500);
    }
  };
```


## Setup

```md
git clone https://github.com/rohitsingh2814/KRUSH_AI.git
cd KRUSH_AI

npm install i
npm install express mongoose
npm install bcrypt
```

> [see App.js setup](https://github.com/rohitsingh2814/KRUSH_AI/blob/main/src/App.js)

Overall, Krush AI combines AI-powered body analysis with a user-friendly interface to provide personalized clothing recommendations. 

The project allowed me to work on front-end development, handle user inputs, and integrate smart recommendation logic. 

It’s a practical example of how `technology` can make fashion more accessible and personalized, and it showcases my skills in `full-stack` development, `UI/UX design`, and `AI integration`.