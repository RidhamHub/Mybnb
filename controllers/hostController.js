const home = require("../models/home");
const Home = require("../models/home")
const fs = require('fs')

exports.getAddHome = (req, res, next) => {
    res.render('host/edit-home', {
        pageTitle: 'Add home to BNB',
        currentPage: 'addhome',
        editing: false,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,// Pass user information to the template
    });
}

exports.getEditHome = (req, res, next) => {
    const homeId = req.params.homeId;
    const editing = req.query.editing === 'true';
    Home.findById(homeId).then(home => {
        if (!home) {
            console.log("home not found with id : ", homeId)
            return res.redirect('/host/host-home-list');
        }
        else {
            console.log("HomeId , editing , home: ", homeId, editing, home)
            res.render('host/edit-home', {
                pageTitle: 'Edit your Home',
                currentPage: 'host-homes',
                editing: editing,
                homeId: homeId,
                home: home,
                isLoggedIn: req.isLoggedIn,
                user: req.session.user,// Pass user information to the template
            });
        }
    })

}

exports.getHostHomes = (req, res, next) => {
    Home.find().then(registeredHomes => {
        res.render('host/host-home-list', {
            registeredHomes: registeredHomes,
            pageTitle: 'Host Home List',
            currentPage: 'host-homes',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,// Pass user information to the template
        });
    });
    // console.log(registeredHomes);
}

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log(houseName, price, location, rating, description);
  console.log(req.file);

  if (!req.file) {
    return res.status(422).send("No image provided");
  }

  const photo = req.file.path;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });
  home.save().then(() => {
    console.log("Home Saved successfully");
  });

  res.redirect("/host/host-home-list");
};

exports.postEditHome = (req, res, next) => {
    // console.log('home regestration successfull for :', req.body)
    const { id, houseName, price, location, rating, description } = req.body
        
    home.findById(id).then((home) => {
        home.houseName = houseName;
        home.price = price;
        home.location = location;
        home.rating = rating;
        home.description = description;

        if (req.file) {
            fs.unlink(home.photo, (err) => {
                if (err) {
                    console.log("getting error while deleting old photo...", err)
                }
            });
            // home.photo = req.file.path;
            home.photo = req.file.path.replace(/\\/g, "/");
        }

        home.save().then(() => {
            console.log("Home updated successfully");
        }).catch(err => {
            console.error("Error finding home for edit:", err);
        });
        res.redirect('/host/host-home-list');

    }).catch(err => {
        console.error("Error finding home for edit:", err);
        res.redirect('/host/host-home-list');
    });

}

exports.postDeleteHome = (req, res, next) => {
    const homeId = req.params.homeId;
    console.log("Deleting home with ID: ", homeId);
    Home.findByIdAndDelete(homeId)
        .then(() => {
            console.log("Home deleted successfully:", homeId);
            // Remove from favourites too
            res.redirect('/host/host-home-list');
        })
        .catch(error => {
            console.error("Error deleting home or favourites:", error);
            res.redirect('/host/host-home-list');
        });
}

