import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Case } from "./case.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect("mongodb://localhost:27017/login")
  .then(() => {
    console.log(`Success: Connected to database`);
    app.listen(3000, () => {
      console.log(`Success: Server started in http://localhost:3000`);
    });
  })
  .catch((error) => {
    console.log(`Failure: Unable to connect to database\n${error}`);
  });

app.get("/", (req, res) => {
  Case.find({})
    .then((results) => {
      res.status(200).json({ message: "Retrieved the cases", data: results });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Unable to retrieve the case  " });
    });
});

app.post("/", (req, res) => {
  console.log(req.body);
  const { date, caseNumber, partyName, status } = req.body;

  const caseData = { date, caseNumber, partyName, status };
  console.log(caseData);
  Case.create(caseData)
    .then(() => {
      res.status(201).json({ caseNumber, message: "Case added" });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ message: "Unable to add case" });
    });
});

app.put("/", (req, res) => {
  const { date, caseNumber, partyName, status } = req.body;
  const searchCondition = { caseNumber };
  const caseData = { date, partyName, status };

  Case.findOneAndUpdate(searchCondition, caseData)
    .then(() => {
      res.status(201).json({ message: "Case edited" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Unable to edit case" });
    });
});

app.post("/update", async (req, res) => {
  const { casenumber, partyName, status, date } = req.body;

  try {
    const response = await Case.findOneAndReplace(
      { caseNumber: casenumber },
      {
        caseNumber: casenumber,
        date: date,
        status: status,
        partyName: partyName,
      }
    ).then((result) => {
      res.json({ message: "updated" });
    });
  } catch (e) {
    res.json({ message: "not found" }).status(500);
  }
});

app.post("/delete", (req, res) => {
  const { caseNumber } = req.body;

  Case.findOneAndDelete(caseNumber)
    .then(() => {
      res.status(200).json({ message: "Case deleted" });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Failed to delete the case" });
    });
});
