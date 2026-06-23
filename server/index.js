import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as db from './db.js';
import { generateReport, validateStartupInput } from '../src/utils/reportGenerator.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database is clean. No preseeded startups.

// User Routes
app.get('/api/user', async (req, res) => {
  try {
    const user = await db.getUser();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/upgrade', async (req, res) => {
  try {
    const user = await db.updateUser({ subscription: 'pro', analysisCredits: Infinity });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/user/reset', async (req, res) => {
  try {
    const user = await db.updateUser({ subscription: 'free', analysisCredits: 1 });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Startup Routes
app.get('/api/startups', async (req, res) => {
  try {
    const startups = await db.getStartups();
    res.json(startups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/startups', async (req, res) => {
  try {
    const { name, websiteUrl } = req.body;
    
    // Validate
    const validation = validateStartupInput(name, websiteUrl);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const user = await db.getUser();
    if (user.analysisCredits !== Infinity && user.analysisCredits <= 0) {
      return res.status(403).json({ error: "Credit limit reached. Please upgrade to Pro." });
    }

    // Check if Gemini API is available for real analysis
    let report;
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      console.log(`Running real Gemini AI Due Diligence for "${name}"...`);
      try {
        const ai = new GoogleGenerativeAI({ apiKey });
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const prompt = `Analyze the startup "${name}" with website "${websiteUrl || 'Not Provided'}" and return a complete due diligence report.
The output MUST be a valid JSON object matching this structure EXACTLY. Return ONLY the JSON:
{
  "name": "${name}",
  "industry": "Determine industry (e.g. AI / Software, FinTech, CleanTech / Energy)",
  "fundingStage": "Seed Stage or Growth Stage",
  "websiteUrl": "${websiteUrl || 'https://' + name.toLowerCase() + '.com'}",
  "dateAnalyzed": "${new Date().toISOString().split('T')[0]}",
  "recommendation": "One of: Strong Invest, Invest, Investigate Further, High Risk, Avoid",
  "scores": { "team": 85, "market": 80, "product": 82, "competition": 75, "financial": 70, "risk": 68, "overall": 78 },
  "executiveSummary": { "problem": "...", "solution": "...", "investmentThesis": "..." },
  "executiveSummarySimple": { "problem": "...", "solution": "...", "investmentThesis": "..." },
  "founderAnalysis": { "score": 85, "background": "...", "experience": "...", "strengths": ["...", "..."], "weaknesses": ["...", "..."], "missingHires": "..." },
  "founderAnalysisSimple": { "score": 85, "background": "...", "experience": "...", "strengths": ["...", "..."], "weaknesses": ["...", "..."], "missingHires": "..." },
  "marketAnalysis": { "tam": 50000, "sam": 15000, "som": 2500, "score": 80, "trends": "...", "growthPotential": "..." },
  "marketAnalysisSimple": { "tam": 50000, "sam": 15000, "som": 2500, "score": 80, "trends": "...", "growthPotential": "..." },
  "productAnalysis": { "score": 82, "differentiation": "...", "moat": "...", "defensibility": "...", "innovation": 85 },
  "productAnalysisSimple": { "score": 82, "differentiation": "...", "moat": "...", "defensibility": "...", "innovation": 85 },
  "competitorAnalysis": { "score": 75, "direct": ["Competitor A", "Competitor B"], "indirect": ["Competitor C"], "features": [{ "featureName": "Feature X", "startupValue": true, "competitor1": false, "competitor2": true }], "advantages": ["...", "..."], "weaknesses": ["...", "..."] },
  "competitorAnalysisSimple": { "score": 75, "direct": ["Competitor A", "Competitor B"], "indirect": ["Competitor C"], "features": [{ "featureName": "Feature X", "startupValue": true, "competitor1": false, "competitor2": true }], "advantages": ["...", "..."], "weaknesses": ["...", "..."] },
  "businessModelAnalysis": { "score": 78, "streams": ["...", "..."], "pricing": "...", "segments": ["...", "..."], "scalability": "...", "economics": "..." },
  "businessModelAnalysisSimple": { "score": 78, "streams": ["...", "..."], "pricing": "...", "segments": ["...", "..."], "scalability": "...", "economics": "..." },
  "financialAnalysis": { "score": 70, "revenueGrowth": "...", "burnRate": "...", "runway": "...", "marginAnalysis": "...", "projections": [{ "year": "2024", "revenue": 100, "burn": 120 }] },
  "financialAnalysisSimple": { "score": 70, "revenueGrowth": "...", "burnRate": "...", "runway": "...", "marginAnalysis": "...", "projections": [{ "year": "2024", "revenue": 100, "burn": 120 }] },
  "riskAssessment": [{ "category": "...", "name": "...", "level": "High/Critical/Medium/Low", "description": "..." }],
  "riskAssessmentSimple": [{ "category": "...", "name": "...", "level": "High/Critical/Medium/Low", "description": "..." }],
  "redFlags": [{ "flagName": "...", "description": "..." }],
  "redFlagsSimple": [{ "flagName": "...", "description": "..." }],
  "bullBear": { "bull": ["...", "..."], "bear": ["...", "..."] },
  "bullBearSimple": { "bull": ["...", "..."], "bear": ["...", "..."] },
  "questions": [{ "id": 1, "category": "Technology", "question": "...", "explanation": "..." }],
  "investmentMemo": "Markdown formatted VC investment memo goes here..."
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        // Clean JSON formatting from markdown code blocks
        const cleanedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        report = JSON.parse(cleanedText);
      } catch (aiError) {
        console.error("Gemini analysis failed, falling back to rule-based generator:", aiError);
        report = generateReport({ name, websiteUrl });
      }
    } else {
      console.log(`Running synthesized AI Due Diligence for "${name}" (Local fallback)...`);
      report = generateReport({ name, websiteUrl });
    }

    // Set standard ID
    report.id = name.toLowerCase().replace(/[^a-z0-9]/g, "") + '_' + Date.now().toString().slice(-4);

    // Save
    await db.addStartup(report);

    // Deduct credits
    if (user.analysisCredits !== Infinity) {
      await db.updateUser({ analysisCredits: Math.max(0, user.analysisCredits - 1) });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/startups/:id', async (req, res) => {
  try {
    await db.deleteStartup(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Signals Route
app.get('/api/startups/:id/signals', async (req, res) => {
  try {
    const id = req.params.id;
    // Generate some dynamic mock signals based on the startup
    const signals = [
      {
        id: 'sig1',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        type: 'Domain Activity',
        title: 'WHOIS Database Update',
        content: 'Domain lease extended. Server nameservers updated with active cloud network mappings.',
        status: 'neutral'
      },
      {
        id: 'sig2',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        type: 'Social Sentiment',
        title: 'Spike in Dev Mentions',
        content: 'Activity index raised by 18% on GitHub discussions and community forums mentioning product usage.',
        status: 'positive'
      },
      {
        id: 'sig3',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
        type: 'Regulatory Filing',
        title: 'Trademark Registration Published',
        content: 'New trademark filed under intellectual property category for international branding protections.',
        status: 'positive'
      },
      {
        id: 'sig4',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 240).toISOString(), // 10 days ago
        type: 'Job Board Activity',
        title: 'New Hiring Posting Detected',
        content: 'Opened engineering positions looking for senior backend development and cloud scaling specialists.',
        status: 'neutral'
      }
    ];
    res.json(signals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Comments Routes
app.get('/api/startups/:id/comments', async (req, res) => {
  try {
    const comments = await db.getComments(req.params.id);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/startups/:id/comments', async (req, res) => {
  try {
    const { text, author } = req.body;
    const comment = {
      id: 'c_' + Date.now().toString(),
      text,
      author: author || 'VC Analyst',
      timestamp: new Date().toISOString()
    };
    await db.addComment(req.params.id, comment);
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/startups/:id/comments/:commentId', async (req, res) => {
  try {
    await db.deleteComment(req.params.id, req.params.commentId);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Voting Routes
app.get('/api/startups/:id/votes', async (req, res) => {
  try {
    const votes = await db.getVotes(req.params.id);
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/startups/:id/vote', async (req, res) => {
  try {
    const { voteType } = req.body; // 'invest', 'watch', 'pass', or null (to clear)
    const votes = await db.castVote(req.params.id, voteType);
    res.json(votes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deal Calculator Routes
app.get('/api/deal-calculator/scenarios', async (req, res) => {
  try {
    const scenarios = await db.getDealScenarios();
    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/deal-calculator/scenarios', async (req, res) => {
  try {
    const { name, preMoney, roundSize, optionPool, liqPrefMultiplier, isParticipating } = req.body;
    const scenario = {
      id: 'sc_' + Date.now().toString(),
      name,
      preMoney,
      roundSize,
      optionPool,
      liqPrefMultiplier,
      isParticipating,
      timestamp: new Date().toISOString()
    };
    await db.saveDealScenario(scenario);
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI Chatbot Route (Conversational Due Diligence Co-pilot)
app.post('/api/chat', async (req, res) => {
  try {
    const { startupId, message, history } = req.body;
    
    // Retrieve startup details
    const startups = await db.getStartups();
    const startup = startups.find(s => s.id === startupId);
    
    if (!startup) {
      return res.status(404).json({ error: "Startup not found in database." });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      console.log(`Sending chatbot query to Gemini for "${startup.name}"...`);
      try {
        const ai = new GoogleGenerativeAI({ apiKey });
        const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        // Assemble conversation history for prompt
        const formattedHistory = history.map(h => 
          `${h.sender === 'user' ? 'Investor' : 'Co-pilot'}: ${h.text}`
        ).join('\n');

        const systemInstructions = `You are VentureIQ's AI Startup Due Diligence Co-pilot, a top-tier venture capital analyst. 
You are evaluating the startup "${startup.name}" (${startup.industry}) which has a consensus recommendation of "${startup.recommendation}".
Here is the complete JSON due diligence report of the startup:
${JSON.stringify(startup, null, 2)}

Your tone is critical, analytical, objective, and professional. 
Review TAM/SAM/SOM, Founder background, Product Moat, Unit Economics, Burn/Runway, and Red Flags.
Answer the investor's questions with specific data points from the report.
If they ask for simulated scenarios (e.g. "what if key founder leaves", "what if burn rate doubles"), run the logic based on the numbers in the report and highlight critical failure modes.
Keep responses concise, using bullet points and bold formatting where appropriate.
If the investor talks about unrelated topics, politely redirect them back to the diligence of "${startup.name}".`;

        const chatPrompt = `${systemInstructions}\n\nChat History:\n${formattedHistory}\n\nInvestor: ${message}\nCo-pilot:`;
        
        const result = await model.generateContent(chatPrompt);
        const text = result.response.text();
        
        return res.json({ reply: text });
      } catch (aiError) {
        console.error("Gemini Chat failed, falling back to local rule-based responder:", aiError);
      }
    }

    // Local Rule-Based Chatbot Responder
    console.log(`Running local rule-based chatbot query for "${startup.name}"...`);
    const cleanMsg = message.toLowerCase();
    let reply = "";

    if (cleanMsg.includes("burn") || cleanMsg.includes("runway") || cleanMsg.includes("cash") || cleanMsg.includes("financial") || cleanMsg.includes("revenue") || cleanMsg.includes("projection")) {
      const fin = startup.financialAnalysis;
      const projStr = fin.projections ? fin.projections.map(p => `Year ${p.year}: Rev: Rs ${p.revenue}cr, Burn: Rs ${p.burn}k`).join(', ') : '';
      reply = `### Financial Analysis for **${startup.name}**
- **Monthly Burn**: ${fin.burnRate || 'N/A'}
- **Current Runway**: ${fin.runway || 'N/A'}
- **Revenue Growth**: ${fin.revenueGrowth || 'N/A'}
- **Margin Analysis**: ${fin.marginAnalysis || 'N/A'}
- **Projections Profile**: ${projStr}

**Co-pilot Assessment**: The burn rate requires close inspection. Under current cash allocations, the runway remains ${fin.runway}. If query load or operational expansion increases burn by 25%, the runway will decrease proportionally. We suggest grilling the founders on their path to cash-flow neutrality in the upcoming screening.`;
    } 
    else if (cleanMsg.includes("risk") || cleanMsg.includes("red flag") || cleanMsg.includes("threat") || cleanMsg.includes("danger") || cleanMsg.includes("weakness") || cleanMsg.includes("bear")) {
      const flags = startup.redFlags.map(f => `- **${f.flagName}**: ${f.description}`).join('\n');
      const assessments = startup.riskAssessment.map(r => `- **[${r.level}] ${r.category}**: ${r.name} - ${r.description}`).join('\n');
      reply = `### Risk Matrix Assessment for **${startup.name}**
Here are the automated red flags and risk vectors detected in our due diligence:

**Critical Red Flags:**
${flags}

**Operational & Market Risks:**
${assessments}

**Co-pilot Recommendation**: The primary concern is ${startup.redFlags[0]?.flagName || 'market dependency'}. An investor should demand a detailed mitigation plan from the startup team regarding these regulatory or operational exposures before issuing a term sheet.`;
    } 
    else if (cleanMsg.includes("team") || cleanMsg.includes("founder") || cleanMsg.includes("experience") || cleanMsg.includes("background") || cleanMsg.includes("hire") || cleanMsg.includes("management")) {
      const f = startup.founderAnalysis;
      const strengths = f.strengths.map(s => `- ${s}`).join('\n');
      const weaknesses = f.weaknesses.map(w => `- ${w}`).join('\n');
      reply = `### Management Board Evaluation
The leadership team at **${startup.name}** scores **${f.score || 80}/100** on our capability index:
- **Founders**: ${f.background}
- **Sector Experience**: ${f.experience}

**Key Strengths:**
${strengths}

**Identified Weaknesses:**
${weaknesses}

- **Missing Critical Hires**: *${f.missingHires || 'None specified'}*

**Co-pilot Insight**: While the team exhibits strong technical credibility, they lack depth in ${f.missingHires || 'global scale operations'}. We recommend asking how they plan to fill these organizational gaps with their next funding round.`;
    }
    else if (cleanMsg.includes("tam") || cleanMsg.includes("sam") || cleanMsg.includes("som") || cleanMsg.includes("market") || cleanMsg.includes("size") || cleanMsg.includes("growth")) {
      const m = startup.marketAnalysis;
      reply = `### Market Analysis & Sizing for **${startup.name}**
- **Total Addressable Market (TAM)**: Rs ${m.tam}cr (Global Opportunity)
- **Serviceable Addressable Market (SAM)**: Rs ${m.sam}cr (Regional Reach)
- **Serviceable Obtainable Market (SOM)**: Rs ${m.som}cr (3-Year Capture Target)
- **Market Trends**: ${m.trends}
- **Growth Potential**: ${m.growthPotential}

**Co-pilot Insight**: A TAM of Rs ${m.tam}cr represents a substantial playing field. However, capturing the ${m.som}cr SOM relies heavily on competing with incumbent players. The CAGR trends remain strong, suggesting a high-growth sector catalyst.`;
    }
    else if (cleanMsg.includes("moat") || cleanMsg.includes("product") || cleanMsg.includes("defens") || cleanMsg.includes("patent") || cleanMsg.includes("innov")) {
      const p = startup.productAnalysis;
      reply = `### Product & Technology Defensibility Moat
- **Product Differentiation**: ${p.differentiation}
- **Defensibility Moat**: ${p.moat}
- **Legal Defensibility / Patents**: ${p.defensibility}
- **Innovation Rating**: ${p.innovation}/100

**Co-pilot Insight**: The startup's defensibility lies in its **${p.moat}**. Without patents or long-term contracts, switching barriers could be low, exposing the product to pricing pressure from competitor clones.`;
    }
    else if (cleanMsg.includes("compet") || cleanMsg.includes("rival") || cleanMsg.includes("peer") || cleanMsg.includes("matrix")) {
      const comp = startup.competitorAnalysis;
      const direct = comp.direct.join(', ');
      const advantages = comp.advantages.map(a => `- ${a}`).join('\n');
      const weaknesses = comp.weaknesses.map(w => `- ${w}`).join('\n');
      reply = `### Competitive Dispersion Matrix
- **Direct Competitors**: ${direct}
- **Indirect Competitors**: ${comp.indirect ? comp.indirect.join(', ') : 'None'}

**Strategic Advantages relative to peers:**
${advantages}

**Peer-level Weaknesses:**
${weaknesses}

**Co-pilot Insight**: Competing against ${comp.direct[0] || 'incumbents'} will require high capital efficiency. The team must leverage their ${comp.advantages[0]} to capture early market share.`;
    }
    else {
      reply = `### VentureIQ AI Diligence Co-pilot &bull; **${startup.name}**
Hello! I am your interactive due diligence co-pilot. I have scanned the full report of **${startup.name}** (Industry: *${startup.industry}* | Recommendation: *${startup.recommendation}*).

I can answer in-depth queries regarding:
1. 💸 **Financials & runway calculations** (burn rates, projections)
2. ⚠️ **Risk factors & red flag analysis**
3. 👥 **Founder background & management experience**
4. 📈 **Market sizing** (TAM, SAM, SOM) and competitor moats
5. 📊 **What-if stress testing** (e.g. cash flow changes, regulatory bans)

What aspect of **${startup.name}**'s business model would you like to stress-test?`;
    }

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`VentureIQ backend server is running on port ${PORT}`);
});
