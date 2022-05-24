const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "cricketMatchDetails.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();


app.get("/players/", async (request, response) => {
  const getPlayerQuery = `
    SELECT
      *
    FROM
     player_details
      ORDER BY
      player_name;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);


  app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT
      *
    FROM
     player_details
    WHERE
      player_id = ${playerId};`;
  const player = await db.get(getPlayerQuery);
  response.send(player);
});


app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const {
     playerName, 
  } = playerDetails;
  const updatePlayerQuery = `
    UPDATE
     player_details
    SET
       player_name = '${playerName}',  
    WHERE
       player_id = ${playerId};`;
  await db.run(updatePlayerQuery);
  response.send("District Details Updated");
});



app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const getMatchQuery = `
    SELECT
      *
    FROM
     match_details
    WHERE
     match_id = ${matchId};`;
  const match = await db.get(getMatchQuery);
  response.send(match);
});



 app.get("/players/:playerId/matches", async (request, response) => {
  const getPlayerQuery = `
    SELECT
      *

    FROM
      match_details INNER JOIN player_match_score ON match_details.match_id = player_match_score.player_match_id
      ORDER BY
     match_id;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);


   app.get("/matches/:matchId/players", async (request, response) => {
  const getPlayerQuery = `
    SELECT
     player_details.player_id,
     player_details.player_name,

    FROM
      player_details 
      INNER JOIN player_match_score ON player_details.player_id = player_match_score.player_id
       INNER JOIN match_details ON match_details.match_id = player_match_score.player_match_id
      ORDER BY
     player_id;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);


  






  app.get("/players/:playerId/playerScores", async (request, response) => {
  const getPlayerQuery = `
    SELECT
    player_details.player_id,
    player_details.player_name,
      player_match_score.score,	
       player_match_score.fours,	
        player_match_score.sixes,
    FROM
      player_details INNER JOIN  player_match_score ON player_details.player_id = player_match_score.player_id
      ORDER BY
     player_id ;`;
  const playerArray = await db.all(getPlayerQuery);
  response.send(playerArray);


  

module.exports = app;


