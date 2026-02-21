const express = require("express");
const router = express.Router();
const { Log } = require("../middleware/logger");

// GET /api/logs
// Query params: ?type=LOGIN&limit=50&page=1&username=admin&date=2026-02-21
router.get("/", async (req, res) => {
    try {
        const { type, username, date, limit = 50, page = 1 } = req.query;
        const filter = {};
        if (type && type !== "ALL") filter.type = type;
        if (username) filter.username = new RegExp(username, "i");
        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setDate(end.getDate() + 1);
            filter.timestamp = { $gte: start, $lt: end };
        }
        const total = await Log.countDocuments(filter);
        const logs = await Log.find(filter)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));
        res.json({ logs, total, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/logs/stats
// Returns counts grouped by type for the last 7 days
router.get("/stats", async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const stats = await Log.aggregate([
            { $match: { timestamp: { $gte: sevenDaysAgo } } },
            { $group: { _id: "$type", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);
        const todayLogins = await Log.countDocuments({
            type: "LOGIN",
            status: "SUCCESS",
            timestamp: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        });
        res.json({ stats, todayLogins });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/logs/clear (admin only — for demo purposes)
router.delete("/clear", async (req, res) => {
    try {
        await Log.deleteMany({});
        res.json({ message: "All logs cleared" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
