const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Hi i am root");
});

//INDEX ROUTE
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//NEW ROUTE
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//SHOW ROUTE
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  res.render("listings/show.ejs", { listing });
});

//CREATE ROUTE
app.post("/listings", async (req, res) => {
  let url = req.body.listing.image;
  let filename = "abc";
  req.body.listing.image = { url, filename };
  const newListing = new Listing(req.body.listing);
  console.log(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//EDIT ROUTE
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "Cozy Beachfront Cottage",
//     description:
//       "Escape to this charming beachfront cottage for a relaxing getaway. Enjoy stunning ocean views and easy access to the beach.",
//     image: {
//       filename: "listingimage",
//       url: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
//     },
//     price: 1500,
//     location: "Malibu",
//     country: "United States",
//   });
//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Successful Testing");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
