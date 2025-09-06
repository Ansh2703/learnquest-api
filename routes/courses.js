const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middleware/authMiddleware'); // Import our new middleware

// Route to get all courses (this one doesn't need to be protected)
router.get('/', async (req, res) => {
  try {
    const allCourses = await db.courses.findAll();
    res.json(allCourses);
  } catch (err) {
    console.error('Error fetching all courses:', err);
    res.status(500).send('Server Error');
  }
});

// Route to get a SINGLE course and the user's progress
// --- NEW: We've added 'authMiddleware' here! ---
// This means the user must be logged in to access this route.
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id; // We get the user ID from our middleware!

    // Find the course and include its lessons
    const course = await db.courses.findOne({
      where: { id: courseId },
      include: [db.lessons]
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    // Find which lessons this specific user has completed for this course.
    const completedLessons = await db.userProgress.findAll({
      where: {
        UserId: userId
      }
    });
    const completedLessonIds = completedLessons.map(p => p.LessonId);

    // We'll add a new 'isCompleted' property to each lesson object.
    const courseWithProgress = {
      ...course.toJSON(),
      Lessons: course.Lessons.map(lesson => ({
        ...lesson.toJSON(),
        isCompleted: completedLessonIds.includes(lesson.id)
      }))
    };

    res.json(courseWithProgress);

  } catch (err) {
    console.error('Error fetching course details with progress:', err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;