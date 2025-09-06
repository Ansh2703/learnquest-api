const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

// --- NEW: PROFILE ROUTE ---
// Fetches detailed data for the logged-in user's profile page.
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.users.findByPk(userId, {
      attributes: ['username', 'email', 'points'], // Don't send the password
      include: [{
        model: db.badges,
        attributes: ['name', 'icon', 'description'],
        through: { attributes: [] } // Don't include the join table data
      }]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile data:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- ENHANCED DASHBOARD ROUTE ---
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await db.users.findByPk(userId, { include: [db.lessons, db.badges] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const lessonsCompleted = user.Lessons.length;
    const badgesEarned = user.Badges.length;

    const allCourses = await db.courses.findAll({ include: [db.lessons] });
    const completedLessonIds = user.Lessons.map(l => l.id);
    
    const coursesWithProgress = allCourses.map(course => {
      const totalLessons = course.Lessons.length;
      const completedInCourse = course.Lessons.filter(l => completedLessonIds.includes(l.id)).length;
      const progress = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;
      return { id: course.id, title: course.title, description: course.description, progress };
    });

    res.json({
      totalPoints: user.points,
      lessonsCompleted,
      badgesEarned,
      courses: coursesWithProgress
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// --- ENHANCED PROGRESS ROUTE (with better badge logic) ---
router.post('/progress', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { lessonId, answers } = req.body;

        const user = await db.users.findByPk(userId, { include: [db.badges] });
        const lesson = await db.lessons.findByPk(lessonId, { include: [db.courses] });
        if (!user || !lesson) return res.status(404).json({ message: 'User or lesson not found.' });

        // ... (existing quiz and video logic) ...
        let pointsAwarded = 0;
        let quizResult = null;
        if (lesson.lessonType === 'quiz') {
            const quizData = JSON.parse(lesson.content);
            let correctAnswers = 0;
            quizData.questions.forEach((q, i) => {
                if (answers && answers[i] === q.answer) correctAnswers++;
            });
            const passed = correctAnswers >= 3;
            quizResult = { score: correctAnswers, passed, totalQuestions: quizData.questions.length };
            if (passed) {
                pointsAwarded = 50;
                // Award "Quiz Whiz" badge if it's their first quiz pass
                const hasQuizBadge = user.Badges.some(b => b.id === 3);
                if (!hasQuizBadge) {
                    await user.addBadge(3);
                }
            } else {
                return res.json({ message: 'Quiz failed. Try again!', quizResult });
            }
        } else {
            pointsAwarded = 25;
        }

        await lesson.addUser(user);
        user.points += pointsAwarded;
        await user.save();

        // Check for course completion badge
        const course = lesson.Course;
        const allCourseLessonIds = (await course.getLessons()).map(l => l.id);
        const userCompletedLessons = await db.userProgress.count({ where: { UserId: userId, LessonId: { [Op.in]: allCourseLessonIds } } });
        if (userCompletedLessons === allCourseLessonIds.length) {
            const badgeId = course.id === 1 ? 1 : 2; // 1 for React, 2 for Node
            await user.addBadge(badgeId);
        }

        res.json({ message: 'Progress saved!', newPoints: user.points, pointsAwarded, quizResult });
    } catch (err) {
        console.error('Error updating progress:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});


// Leaderboard route remains the same
router.get('/', async (req, res) => {
    try {
        const users = await db.users.findAll({
            attributes: ['username', 'points'],
            order: [['points', 'DESC']]
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});


module.exports = router;

