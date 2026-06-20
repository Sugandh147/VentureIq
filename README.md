# VentureIQ — Smart Startup Due Diligence Co-Pilot

**VentureIQ** is an easy-to-use web application that helps investors (like angel investors and venture capital teams) decide whether to invest money in a startup. 

Think of it as a **smart assistant for investing**. Instead of reading through hundreds of pages of pitch decks and financial spreadsheets, VentureIQ analyzes startup profiles and web signals in seconds to give you a clear, structured breakdown of a business's health.

---

## 💡 What VentureIQ Does (In Simple Terms)

If you're looking at a startup to invest in, VentureIQ helps you in four key ways:

1. 📊 **Grades the Startup**: It rates the startup on a scale from 0 to 100 based on their **Team**, **Market**, **Product**, **Competition**, **Finances**, and **Risks**.
2. ⚠️ **Finds Hidden "Red Flags"**: It automatically warns you about danger signs, like the company spending money too fast, facing copyright lawsuits, or having too much competition.
3. 💬 **Tells You What to Ask the Founders**: It creates a list of custom, tough questions you should ask the founders in a meeting before writing them a check.
4. 💸 **Exit & Dilution Calculator**: A simulator that lets you model what happens to your investment. If the company gets sold for a certain amount in the future, it calculates exactly how much money goes back to the investors and how much stays with the founders.

---

## 🚀 Key Features

- **Search Real Startups or Add Your Own**: Look up detailed analysis reports for preloaded startups (like OpenAI, Zepto, CRED, Stripe, Snowflake, and Ather Energy) or type in any custom startup name and website to generate a report.
- **Double-Depth Summaries**: You can switch the reports between **"Simple English"** (easy-to-read summaries) and **"VC / Institutional"** (detailed financial and business jargon).
- **Interactive Charts**: Clean visual gauges that show scores and circles representing how big the startup's market is.
- **Free vs. Pro Accounts**: Start with a free account (1 analysis per month and basic details) or upgrade to **Pro** to unlock unlimited analyses, the Cap Table simulator, and 20 custom screening questions.

---

## 🛠️ How It's Built

- **Frontend**: **React** (a popular JavaScript tool for building user interfaces) and **Vite** (makes building and running the app super fast).
- **Styling**: Sleek, custom **Vanilla CSS** with support for **Dark & Light Mode** switching and smooth animations.
- **Icons**: Clean and simple graphics powered by **Lucide React**.

---

## 📁 Project Structure

Here is where the main parts of the project live:
- [App.jsx](file:///c:/Users/ACER/VentureIq/src/App.jsx): The main controller that manages tabs, theme settings, and page views.
- [components/](file:///c:/Users/ACER/VentureIq/src/components): Contains the different screens like the [LandingPage.jsx](file:///c:/Users/ACER/VentureIq/src/components/LandingPage.jsx), the main [Dashboard.jsx](file:///c:/Users/ACER/VentureIq/src/components/Dashboard.jsx), and the [DealCalculator.jsx](file:///c:/Users/ACER/VentureIq/src/components/DealCalculator.jsx).
- [utils/reportGenerator.js](file:///c:/Users/ACER/VentureIq/src/utils/reportGenerator.js): The core mathematical and simulated database logic that validates inputs and constructs startup reports.

---

## ⚙️ Getting Started (For Developers)

### Prerequisites
You will need [Node.js](https://nodejs.org/) installed on your computer.

### Installation

1. Navigate to the project directory:
   ```bash
   cd c:/Users/ACER/VentureIq
   ```
2. Install the required files:
   ```bash
   npm install
   ```

### Running Locally
To launch the app on your computer:
```bash
npm run dev
```
Then, open your web browser and go to `http://localhost:5173`.

### Building for Production
To bundle the app so it is ready to be uploaded to a live website:
```bash
npm run build
```


