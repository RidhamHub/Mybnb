const Home = require("../models/home");
const User = require("../models/user");
const path = require('path')
const rootDir = require('../utility/pathUtil')

exports.getIndex = (req, res, next) => {
    Home.find().then(registeredHomes => {
        console.log("Is logged In:", req.session);
        res.render('store/index', {
            registeredHomes: registeredHomes,
            pageTitle: 'Mybnb Home',
            currentPage: 'index',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,// Pass user information to the template
        });
    })
}

exports.getHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('store/home-list', {
            registeredHomes: registeredHomes,
            pageTitle: 'Home List',
            currentPage: 'Home',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,// Pass user information to the template
        });
    });
       
}



exports.getBookings = (req, res, next) => {
    
    res.render('store/bookings', {
        pageTitle: 'My Booking',
        currentPage: 'bookings',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,// Pass user information to the template
    });
    // console.log(registeredHomes);
}

exports.getFavouriteList = async (req, res, next) => {

    const userId = req.session.user._id;
    const user = await User.findById(userId).populate('favourites')
    // const favouriteHomes = user.favourite.map(fav => fav.houseId);
    res.render('store/favourite-list', {
        favouriteHomes: user.favourites, pageTitle: 'Favourite List',
        currentPage: 'favourites',
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,// Pass user information to the template
    });
}

exports.postAddToFavourite = async (req, res, next) => {
    const homeId = req.body.id;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (!user.favourites.includes(homeId)) {
        user.favourites.push(homeId);
        await user.save()
        
    }

    res.redirect("/favourites")
}

exports.postRemoveFavourite = async (req, res, next) => {
    const homeId = req.params.homeId;
    const userId = req.session.user._id;
    const user = await User.findById(userId);

    if (user.favourites.includes(homeId)) {
        user.favourites = user.favourites.filter(fav => fav != homeId);
        await user.save()
    }
    res.redirect('/favourites');
}


exports.getHomesDetails = (req, res, next) => {
   const homeId = req.params.homeId;
    // console.log("At Home ID:", homeId);
    Home.findById(homeId).then(home => {
        if (!home) {
            // console.log("Home not found with ID:", homeId);
            return res.redirect('/homes');
        }
        else {
            // console.log("Home Details Found:", home);
            res.render('store/home-detail', {
                home: home,
                pageTitle: 'Home Details',
                currentPage: 'Home',
                isLoggedIn: req.isLoggedIn,
                user: req.session.user,// Pass user information to the template
            });  
        }
        
    })


    // exports.getHouseRules = (req, res, next) => {
    //     if (!req.session.isLoggedIn) {
    //         return res.redirect('/login')
    //     }
        
    //         const homeId = req.params.homeId;
    //         const filePath = path.join(rootDir, 'rules', '${homeId}-rules.pdf');

    //         res.download(filePath, 'Rules.pdf');
        
    // }


}

