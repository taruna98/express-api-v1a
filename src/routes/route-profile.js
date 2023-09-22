const router = require('express').Router();
const { profile, about, portfolio } = require('../controllers');

// profile
router.get('/profile', profile.getDataProfile);
router.get('/profile/:id', profile.getDataProfileByID);
router.post('/profile/add', profile.addDataProfile);
router.post('/profile/edit', profile.editDataProfile);
router.post('/profile/delete/', profile.deleteDataProfile);

// about
router.get('/about', about.getDataAbout);
router.get('/about/:id', about.getDataAboutByID);
router.post('/about/add', about.addDataAbout);
router.post('/about/edit', about.editDataAbout);
router.post('/about/delete/', about.deleteDataAbout);

// portfolio
router.get('/portfolio', portfolio.getDataPortfolio);
router.get('/portfolio/:id', portfolio.getDataPortfolioByID);
router.post('/portfolio/add', portfolio.addDataPortfolio);
router.post('/portfolio/edit', portfolio.editDataPortfolio);
router.post('/portfolio/delete/', portfolio.deleteDataPortfolio);

module.exports = router;