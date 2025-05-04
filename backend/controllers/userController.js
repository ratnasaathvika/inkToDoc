const User = require('../models/User');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        
        // Build user object
        const userFields = {};
        if (username) userFields.username = username;
        if (email) userFields.email = email;

        let user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: userFields },
            { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}; 