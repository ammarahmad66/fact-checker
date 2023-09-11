import { SerpApiSearch } from "google-search-results-nodejs"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

  const serpApiKey = process.env.SERP_API_KEY
const search = new SerpApiSearch(serpApiKey)

let results;

export async function serpApi (req, res) {
  const {query} = req.params
  // results = search.json({q: query}, (data) => {
  //   res.send({data: data['organic_results']});
  // })
  
let data = JSON.stringify({
  "q": query,
  "num" : 8
});

let config = {
  method: 'post',
  url: 'https://google.serper.dev/search',
  headers: { 
    'X-API-KEY': '6b68ce0eb904368d176fa20b75d65971ef9d23b6', 
    'Content-Type': 'application/json'
  },
  data : data
};

axios(config)
.then((response) => {
  res.send(response.data)
})
.catch((error) => {
  console.log(error);
});
}
