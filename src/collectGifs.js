const https = require('https');

function sendRequest(url, callback)
{
    let parsed_data = "";
    let responsedata = "";
    https.get(url, (response) =>{

        response.on('data',(chunk) => {
            responsedata += chunk;
        });

        response.on('end', () => {
            parsed_data = JSON.parse(responsedata);
            callback(parsed_data);
        })
    }).on("error",(caught)=>{
        console.log(`Error was: ${caught.message}`);
    });
}

function parseKeyword(key)
{
    let invalid = " ^&*()+=!@#$~`;:'\"[]{}\\|" /* list of invalid characters in KeyWords, replaced by spaces */
    for (let i = 0; i < invalid.length; i ++)
    {
        key.replace(invalid[i], "%20"); /* Replace invalid character with ascii space */
    }

    return key; /* return our freshly parsed keyword! */
}

const collectSuggestions = (keyword) => new Promise((resolve, reject) => {
  try {
    sendRequest(`https://discordapp.com/api/v6/gifs/suggest?q=${parseKeyword(keyword)}`, data => {
      resolve(data);
    });
    } catch(e) {
        reject(e);
    }
});

async function selectGif(keyword, callback)
{
  let suggestions = await collectSuggestions(keyword); /* Collect list of suggestions for `keyword` */
  let chosenSuggestion = suggestions[Math.round(Math.random(0, suggestions.length))]; /* Choose a random suggestion to search for */
    sendRequest(`https://discordapp.com/api/v6/gifs/search?q=${chosenSuggestion}n&media_format=gif&provider=tenor`, data => {
        let gifURL = data[Math.Round(Math.random(0, data.length))]; /* Select a random gif JSON object */
        callback(chosenSuggestion, gifURL); /* Hit up out callback function with the suggestion name and JSON object */
    });
}

