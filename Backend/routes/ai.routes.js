const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { protect } = require('../middleware/auth.middleware');
const Subject = require('../models/Subject');
const Task = require('../models/Task');
const Session = require('../models/Session');
const Goal = require('../models/Goal');
const Quiz = require('../models/Quiz');

// যদি API Key না থাকে, তবে ডামি রেসপন্স দিবে
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
// Use user's preferred model
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

// AI Route now protected to access user data
router.post('/ask', protect, async (req, res) => {
    try {
        if (!genAI) {
            return res.json({ answer: "AI সার্ভিসটি এখন অ্যাক্টিভ নেই। দয়া করে সার্ভারে API Key যোগ করুন।" });
        }
        
        const { prompt } = req.body;
        const userId = req.user.id;
        const userName = req.user.firstName ? `${req.user.firstName} ${req.user.lastName}` : req.user.username;

        // Fetch user data for context
        const [subjects, tasks, sessions, goals] = await Promise.all([
            Subject.find({ user: userId }),
            Task.find({ user: userId, completed: false }),
            Session.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
            Goal.find({ user: userId, current: { $lt: 100 } }) // Incomplete goals
        ]);

        // Construct context string
        const context = `
            User Profile:
            - Name: ${userName}
            - Current Subjects: ${subjects.map(s => s.name).join(', ') || 'None'}
            - Pending Tasks: ${tasks.map(t => `${t.title} (Due: ${t.deadline ? new Date(t.deadline).toDateString() : 'No date'})`).join(', ') || 'None'}
            - Recent Study Sessions: ${sessions.map(s => `${s.subject} for ${s.duration} mins on ${new Date(s.createdAt).toDateString()}`).join(', ') || 'None'}
            - Active Goals: ${goals.map(g => `${g.title} (Target: ${g.target} ${g.unit})`).join(', ') || 'None'}
        `;

        const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
        
        // Enhanced prompt with context
        const fullPrompt = `
            You are "StudyFlow AI", a personal study assistant for ${userName}.
            Here is the user's current study data:
            ${context}

            User's Question: "${prompt}"

            Instructions:
            1. Use the study data to give personalized advice if relevant.
            2. Be encouraging, concise, and helpful.
            3. AUTO-ACTION: If the user EXPLICITLY asks to create a task, add a subject, or set a goal, you MUST return a valid JSON object wrapped in triple pipes at the END of your response like this:
               |||{"action": "create_task", "data": {"title": "Task Name", "deadline": "YYYY-MM-DD", "priority": "medium"}}|||
               Supported actions: "create_task", "add_subject", "set_goal".
               For "create_task" required: title. optional: deadline, priority.
               For "add_subject" required: name.
               For "set_goal" required: title, target, unit, type.
            4. If no action is needed, just reply normally.
        `;

        // Corrected Model Selection Logic
        // We will try multiple models in order of preference based on user availability
        const candidates = [
            'gemini-2.5-flash',      // User verified model
            'gemini-2.5-flash-lite', // User verified model (higher RPM potential)
            'gemini-1.5-flash',      // Fallback
            'gemini-pro'             // Legacy support
        ];
        
        let text = null;
        let lastErr = null;
        let usedModel = null;
        
        // Loop through models until one works
        for (const m of candidates) {
            try {
                const activeModel = genAI.getGenerativeModel({ model: m });
                const result = await activeModel.generateContent(fullPrompt);
                const response = await result.response;
                text = response.text();
                usedModel = m;
                console.log(`✅ AI Success with model: ${m}`);
                break; // Stop loop if successful
            } catch (err) {
                console.log(`⚠️ AI Failed with ${m}:`, err.message);
                lastErr = err;
                // Continue to next model
            }
        }

        if (!text) {
             console.error('AI Fatal Error: All models failed.', lastErr);
             throw new Error('All AI models are currently unavailable. Please try again later.');
        }

        // Check for Auto-Action
        const actionMatch = text.match(/\|\|\|(.*?)\|\|\|/s);
        let actionResult = null;

        if (actionMatch) {
            try {
                const actionJson = JSON.parse(actionMatch[1]);
                console.log("🤖 AI Action Triggered:", actionJson);

                if (actionJson.action === 'create_task') {
                    const newTask = await Task.create({
                        user: userId,
                        title: actionJson.data.title,
                        deadline: actionJson.data.deadline || new Date(),
                        priority: actionJson.data.priority || 'medium'
                    });
                    actionResult = `Created task: "${newTask.title}"`;
                } 
                else if (actionJson.action === 'add_subject') {
                    const newSubject = await Subject.create({
                        user: userId,
                        name: actionJson.data.name
                    });
                    actionResult = `Added subject: "${newSubject.name}"`;
                }
                
                // Remove the JSON from the user-facing text
                text = text.replace(actionMatch[0], '').trim();
                text += `\n\n✅ ${actionResult}`;

            } catch (err) {
                console.error("AI Action Failed:", err);
                text += "\n\n(Note: I tried to perform an action but something went wrong.)";
            }
        }
        
        // Send response with model info
        res.json({ 
            answer: text,
            model: usedModel,
            timestamp: new Date().toISOString(),
            actionPerformed: actionResult
        });
    } catch (error) {
        console.error('AI Error:', error);
        const message = error?.message?.includes('model')
            ? 'Unsupported Gemini model. Check GEMINI_MODEL env var.'
            : error?.message?.includes('API key')
            ? 'Invalid API key. Check GEMINI_API_KEY.'
            : 'AI processing failed';
        res.status(500).json({ message });
    }
});

// Generate Quiz Route
router.post('/quiz', protect, async (req, res) => {
    try {
        if (!genAI) {
            return res.json({ questions: [] });
        }
        
        const { topic } = req.body;
        
        const candidates = [
            'gemini-2.5-flash',
            'gemini-2.5-flash-lite',
            'gemini-1.5-flash'
        ];

        let text = null;
        let usedModel = null;

        for (const m of candidates) {
            try {
                const model = genAI.getGenerativeModel({ model: m });
                const prompt = `
                    Generate a 5-question multiple choice quiz about "${topic}".
                    Return strictly a JSON array without any markdown formatting.
                    Structure:
                    [
                        {
                            "question": "Question text?",
                            "options": ["A", "B", "C", "D"],
                            "correctAnswer": 0 // Index of correct option (0-3)
                        }
                    ]
                `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                text = response.text();
                usedModel = m;
                console.log(`✅ Quiz generated with: ${m}`);
                break;
            } catch (err) {
                 console.log(`⚠️ Quiz Gen failed with ${m}:`, err.message);
            }
        }

        if (!text) throw new Error('Failed to generate quiz with all available models');
        
        // Clean markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const questions = JSON.parse(text);

        // Save to Database
        if (req.user && req.user.id) {
            await Quiz.create({
                user: req.user.id,
                topic: topic,
                questions: questions
            });
            console.log("💾 Quiz saved to database");
        }
        
        res.json({ questions });
    } catch (error) {
        console.error('Quiz Gen Error:', error);
        const message = error?.message?.includes('model')
            ? 'Unsupported Gemini model. Check GEMINI_MODEL env var.'
            : error?.message?.includes('API key')
            ? 'Invalid API key. Check GEMINI_API_KEY.'
            : 'Quiz generation failed';
        res.status(500).json({ message });
    }
});



// Health check to verify AI readiness
router.get('/health', (req, res) => {
    const availableModels = [
        { name: 'gemini-2.5-flash', rateLimit: '5 RPM ✅', recommended: true },
        { name: 'gemini-3-flash', rateLimit: '5 RPM ⚡' },
        { name: 'gemini-2.5-flash-lite', rateLimit: '10 RPM ⚡' },
        { name: 'gemini-1.5-flash', rateLimit: 'Stable ✓' },
        { name: 'gemini-1.5-pro', rateLimit: 'Stable ✓' },
    ];
    
    res.json({ 
        active: !!genAI, 
        defaultModel: DEFAULT_MODEL,
        hasKey: !!process.env.GEMINI_API_KEY,
        availableModels,
        status: genAI ? '✅ Ready' : '❌ No API Key'
    });
});

module.exports = router;