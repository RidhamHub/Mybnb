exports.pageNotFound = (req, res) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        currentPage: '404',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,// Pass user information to the template
    });
}