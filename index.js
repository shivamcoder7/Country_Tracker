import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db= new pg.Client({
  user: "postgres",
  database: "world",
  host: "localhost",
  password: "123456",
  port: 5432
});
db.connect();

const app = express();
const port = 3000;

let countries=[];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/", async (req, res) => {
  const result= await db.query("SELECT country_code FROM visited_countries");
  // console.log(result);
  let codes_array= result.rows;
  // console.log(codes_array);
  countries = codes_array.map((obj)=>obj.country_code);
  // console.log((countries));
  // console.log(typeof(countries));

  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
  });
  // console.log(countries);
  // res.send(countries);
});

app.post("/add",async  (req,res) => {
  const country= req.body.country;
  console.log(country);
  const result= await db.query("select country_code from countries where country_name=$1", [country]);
  if(result.rows.length!=0){
  const code= result.rows[0].country_code;
  console.log(code);
  await db.query("insert into visited_countries (country_code) values ($1)", [code]);
  // res.send(country);
  res.redirect("/");
}
});
app.post("/delete",async  (req,res) => {
  const input= req.body.country;
  console.log(input);
  const result= await db.query("select country_code from countries where country_name=$1", [input]);
  if(result.rows.length!=0){
  const code= result.rows[0].country_code;
  console.log(code);
  await db.query("delete from visited_countries where country_code=$1", [code]);
  // res.send(country);
  res.redirect("/");
}
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
