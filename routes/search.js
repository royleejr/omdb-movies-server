const express = require("express");
const router = express.Router();
const axios = require("axios");
require("dotenv").config();

//created set for when the user looks for more results than just the exact title name, we will search for titles that include the input and more.
let movieIdsSet = new Set();
let searchTitle = "";
let newData = [];
let extraPage = 1;
//toggle is so the we don't create a new set when there hasn't been any intial data results because movie title is too short and produces no results.
let toggle = false;

router.get("/id/:id", (req, res) => {
  axios
    .get(
      `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&i=${req.params.id}&type=movie`
    )
    .then((response) => {
      if (response.data) {
        res.send(response.data).status(200);
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/:title/:page", (req, res) => {
  const { title, page } = req.params;
  axios
    .get(
      `http://www.omdbapi.com/?apikey=${process.env.API_KEY}&s=${title}&type=movie&page=${page}`
    )
    .then((response) => {
      //only want to rest the set when we are dealing with a new move title search and not just different pages for the same movie title search.
      if (title !== searchTitle && searchTitle !== "" && toggle) {
        movieIdsSet = new Set();
      }
      if (response.data.Search) {
        response.data.Search.forEach((movie) => {
          movieIdsSet.add(movie.imdbID);
        });
        res.send(response.data.Search);

        if (!toggle) {
          toggle = true;
        }
      } else {
        if (title !== searchTitle && searchTitle !== "") {
          extraPage = 1;
        }
        //I noticed if you search without using an asterisk for the title the search results only return movies that have the specific word and not movies that include those letters.
        //So I will be doing another request after the more specific search runs out of results to give results that include the letters in the search.
        fetchNonExactData(title, res);
      }

      if (searchTitle !== title) {
        searchTitle = title;
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

const fetchNonExactData = (title, res) => {
  axios
    .get(
      `http://www.omdbapi.com/?apikey=c457f6e5&s=${title}*&type=movie&page=${extraPage}`
    )
    .then((response) => {
      if (response.data.Search) {
        //checking to see if the results have any duplicates from the more specific search.
        if (movieIdsSet.size > 0) {
          let newArray = response.data.Search.filter((movie) => {
            return !movieIdsSet.has(movie.imdbID);
          });
          newArray.forEach((movie) => {
            newData.push(movie);
          });
        } else {
          response.data.Search.forEach((movie) => {
            newData.push(movie);
          });
        }
        //if there are 10 unique items it'll just send the data.
        if (newData.length === 10) {
          res.send(newData);
          newData.forEach((movie) => {
            movieIdsSet.add(movie.imdbID);
          });
          newData = [];
          extraPage++;
        }
        //if there are more than 10 items, we will slice so it sends just 10 and save the rest.
        else if (newData.length > 10) {
          const sendData = [];
          for (let i = 0; i < 10; i++) {
            sendData.push(newData[i]);
          }
          const slicedData = newData.slice(10);
          newData = slicedData;

          sendData.forEach((movie) => {
            movieIdsSet.add(movie.imdbID);
          });
          extraPage++;
          res.send(sendData);
        }
        //if there are less than 10, we will make another call.
        else {
          extraPage++;
          newData.forEach((movie) => {
            movieIdsSet.add(movie.imdbID);
          });
          fetchNonExactData(title, res);
        }
        if (!toggle) {
          toggle = true;
        }
      } else {
        //no more data
        res.send(response.data);

        if (toggle) {
          toggle = false;
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = router;
