const User = require("../models/candidateSchema");
const jwt = require('jsonwebtoken');

const getAccessToken = async (code) => {
    const body = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: 'http://localhost:7001/api/linkedin/callback',
    });

    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body.toString()
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

const getUserData = async (accessToken) => {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!response.ok) {
        throw new Error(response.statusText);
    }

    return response.json();
};

const linkedInCallback = async (req, res) => {
    try {
        const { code } = req.query;

        // Get access token
        const accessToken = await getAccessToken(code);

        // Get user data using access token
        const userData = await getUserData(accessToken.access_token);

        if (!userData) {
            return res.status(500).json({
                 success: false, error: "Failed to fetch user data" });
        }

        let user = await User.findOne({ email: userData.email });

        if (!user) {
            user = new User({
                name: userData.name,
                email: userData.email,
                avatar: userData.picture || "",
                experience: userData.experience || 0,
                skills: userData.skills || [],
                location: userData.location || "",
                preferredJobRoles: userData.preferredJobRoles || [],
                linkedinProfile: userData.profileUrl || "",
            });

            await user.save();
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                experience: user.experience,
                skills: user.skills,
                location: user.location,
                preferredJobRoles: user.preferredJobRoles,
                linkedinProfile: user.linkedinProfile,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie('token', token, { httpOnly: true });

        res.redirect('http://localhost:3000/CandidateProfile');
    } catch (error) {
        console.error("LinkedIn Authentication Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(403).json({ success: false, message: "No token provided" });
        }

        const user = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

module.exports = {
    getUserData,
    linkedInCallback,
    getUser
};
