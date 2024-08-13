const { NOVEL, addRating } = require('../models/novel');

exports.addRating = async (req, res) => {
  const novelId = req.params.id;
  const { userId, rating } = req.body;
  try {
    await addRating(novelId, userId, rating);
    res.status(200).json({ message: 'Rating added/updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRating = async (req, res) => {
  const novelId = req.params.id;
  const { userId } = req.query;
  try {
    const novel = await NOVEL.findById(novelId);
    if (!novel) {
      return res.status(404).json({ message: 'Novel not found' });
    }
    const userRating = novel.ratings.find(rating => rating.userId === userId);
    const userRatingValue = userRating ? userRating.rating : 0;
    res.status(200).json({ userRating: userRatingValue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
