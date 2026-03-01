import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors());

// THE 11-HERO REGISTRY (JavaScript Format)
const heroRegistry = {
    'LF': { name: 'The Loverfighter', suit: 'Red/Gold heart combat suit', glow: 'fire-gold', quote: 'I fight for love.' },
    'CR': { name: 'The Cosmic Rebel', suit: 'Navy/UV stardust suit', glow: 'cosmic neon', quote: 'I carve new paths.' },
    'GG': { name: 'The Glam Guardian', suit: 'Maroon/Silver elegance suit', glow: 'glam pink', quote: 'I stand in grace.' },
    'JW': { name: 'The Joy Warrior', suit: 'Rainbow pride energy suit', glow: 'rainbow', quote: 'Liberation in motion.' },
    'TR': { name: 'The Transcend', suit: 'White/Gold ascension suit', glow: 'white-gold', quote: 'I rise above.' },
    'PR': { name: 'The Protector', suit: 'Steel-Blue/Gold fortified suit', glow: 'steel-blue', quote: 'I guard the essence.' },
    'SH': { name: 'The Shadow Healer', suit: 'Black/Violet mystery suit', glow: 'violet', quote: 'I mend the unseen.' },
    'VS': { name: 'The Visionary', suit: 'Silver/Indigo foresight suit', glow: 'indigo', quote: 'I see what others miss.' },
    'MK': { name: 'The Memory Keeper', suit: 'Violet/Gold nostalgic suit', glow: 'golden', quote: 'I carry the stories.' },
    'FB': { name: 'The Flamebearer', suit: 'Orange/Gold fiery suit', glow: 'orange-gold', quote: 'I burn through doubt.' },
    'MR': { name: 'The Mirror', suit: 'Silver/Iridescent reflective suit', glow: 'silver-iridescent', quote: 'Truth in clarity.' }
};

app.post('/generate', async (req, res) => {
    const { prompt, faceImage, hero_type, model_version } = req.body;
    const authHeader = req.headers['x-sensi-key'];

    // Security Check
    if (authHeader !== process.env.SENSI_FORGE_SHARED_SECRET) {
        return res.status(403).json({ success: false, message: "Unauthorized Forge Access" });
    }

    try {
        // Here you will call Replicate. For now, we return success to test connection.
        console.log(`Forging hero: ${hero_type} with prompt: ${prompt}`);
        
        // Return dummy data or actual Replicate call here
        res.json({ 
            success: true, 
            image: "https://sensianduniq.com/wp-content/uploads/placeholder.png", // Placeholder
            status: "Resonance Established" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Sensi Forge Server active on port ${port}`);
});
