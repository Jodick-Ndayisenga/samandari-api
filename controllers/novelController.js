const { NOVEL } = require('../models/novel');

exports.getNovelPdfs = async (req, res) => {
  try {
    const query = {};
    Object.entries(req.query).filter(([key, value]) => {
      if (key === 'genre') query.genres = [value]
      else query[key] = value
    })

    console.log(query, req.query)
    const pdfs = await NOVEL.find(query);
    res.send(pdfs);
  } catch (e) {
    console.log(e);
    res.status(500).send('An error occurred while retrieving the files.');
  }
};

exports.getAuthors = async (req, res) => {
  try {
    const input = req.query.input;
    console.log(input, 'input')
    if (!input) {
      return res.status(400).send('Query input is required');
    }

    // Create a regular expression for a case-insensitive search
    const regex = new RegExp(input, 'i');

    const authors = await NOVEL.aggregate([
      { $match: { author: regex } }, // Match authors based on input
      { $group: { _id: '$author', count: { $sum: 1 } } }, // Group by author and count
      { $sort: { count: -1 } }, // Sort by count in descending order
      { $project: { author: '$_id', count: 1, _id: 0 } } // Project the result
    ]);

    console.log(authors, 'authors')
    res.send(authors);
  } catch (e) {
    console.log(e);
    res.status(500).send('An error occurred while retrieving authors.');
  }
};


exports.searchNovels = async (req, res) => {
  try {
    // Validate the query input
    const input = req.query.input;
    if (!input) {
      return res.status(400).send('Query input is required');
    }

    // Create a regular expression for a case-insensitive search
    const regex = new RegExp(input, 'i');

    // Fetch books by title and author in parallel
    const [titleMatches, authorMatches] = await Promise.all([
      NOVEL.find({ title: regex }), //, { title: 1, author: 1, filename: 1, rating: 1, _id: 1 }
      NOVEL.find({ author: regex }) //, { title: 1, author: 1, filename: 1, rating: 1, _id: 1 }
    ]);

    // Concatenate results from both searches
    let books = [...titleMatches, ...authorMatches];

    // Sort the books by rating in descending order
    books.sort((a, b) => b.rating - a.rating);

    // Remove duplicates based on title and author
    const booksMap = new Map();
    books.forEach(book => {
      const key = `${book.title}-${book.author}`;
      if (!booksMap.has(key)) {
        booksMap.set(key, book);
      }
    });
    
    books = Array.from(booksMap.values());

    console.log(books, 'Fetched books');
    res.send(books);
  } catch (e) {
    console.log(e, 'An error occurred while retrieving books');
    res.status(500).send('An error occurred while retrieving books.');
  }
};
