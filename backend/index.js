const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bodyParser = require('body-parser');
const cors = require("cors");
const fs = require('fs');
const { log } = require("console");
const path = require('path');

const app = express();

const allowedOrigin = 'http://localhost:5173'; {/* I have to edit his path later */ }
app.use(cors({
  origin: allowedOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

// app.use(cors())

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Set the views directory (optional, default is 'views')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

const uri = "mongodb://localhost:27017/";
mongoose.connect(uri, { dbName: 'VehicleMng', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Is Running");
});

const NewOccurance = new mongoose.Schema({
  phone: String,
  Applicant: String,
  Street: String,
  CPF: String,
  CEP: String,
  Neighbourhood: String,
  City: String,
  Reference: String,
  Description: String,
  Request: String,
  av_garison: [],
  occurance_Number: Number,
  occurance_Code: String,
  Status: String,
  Time: String,
  Arrivaltime: String,
  MadeBy: String,
  DispatchBy: String,
  InformedOfArrivalBy: String,
  ClosedBy: String,
  registrationDate: { type: Date, default: Date.now },
  changedBy: String,
  DescriptionDateTime: { type: String, default: '' },
  RequestDateTime: { type: String, default: '' },
  dateTime: String
})

const occurrenceEditSchema = new mongoose.Schema({
  OccurenceId: { type: String, required: true },
  request: { type: String },
  description: { type: String },
  changedBy: { type: String, required: true },
  dateTime: { type: String, required: true },
  changingVar: { type: String, required: true }
});


const NewGarisson = new mongoose.Schema({
  StaffName: String,
  VehcleName: String,
  Av_garison: String,
  Status: Boolean,
});

const StaffSchema = new mongoose.Schema({
  Name: String,
  SurName: String,
  WarName: String,
  Status: Boolean
})

const VechcleSchema = new mongoose.Schema({
  VehicleNumber: String,
  Plate: String,
  Brand: String,
  Model: String,
  Status: Boolean,
});

const ApplicantSchema = new mongoose.Schema({
  Name: String,
  CPF: String,
  Address: String,
  Refrences: String,
});

const StreetSchma = new mongoose.Schema({
  Stret: String,
  ZipCode: String,
  Neigbourhood: String,
  City: String
}
)

const occuranceSchema = new mongoose.Schema({
  Code: String,
  Description: String,
  OBS: String,
});

const ResigisterNormalUserSchema = new mongoose.Schema({
  username: String,
  password: String,
  designation: String,
  isAdmin: Boolean,
});

const reportSchema = new mongoose.Schema({
  IdOfOccurence: String,
  formFields: Object,
  address: String,
  description: String

});

const OccurenceSavedSchema = new mongoose.Schema({
  IdOfOccurence: String,
  formFields: Object,
  address: String,
  description: String
});

const StaffModel = mongoose.model("staffs", StaffSchema);
const VechcleModel = mongoose.model("vehcle", VechcleSchema);
const ApplicantsModel = mongoose.model("Applicant", ApplicantSchema);
const StrretModel = mongoose.model("Street", StreetSchma);
const occuranceModel = mongoose.model("Occurance", occuranceSchema);
const NewOccuranceModel = mongoose.model("NewOccurance", NewOccurance);
const NewGarissonModel = mongoose.model("NewGarisson", NewGarisson);
const reportSchemaModel = mongoose.model("reportSchema", reportSchema);
const ResigisterNormalUserSchemaModel = mongoose.model(
  "ResigisterNormalUserSchema",
  ResigisterNormalUserSchema
);
const OccurenceSavedSchemaModel = mongoose.model(
  "OccurenceSavedSchema",
  OccurenceSavedSchema
);

app.get("/", async (req, res) => {

  res.json("helloword");
});




// For Post

app.post("/newGarisson", async (req, res) => {
  const data = await NewGarissonModel.create(req.body);
  res.json("Saved");
});

app.post("/newOccurance", async (req, res) => {
  // Check if req.body.time is empty
  if (!req.body.Time) {
    // Add current time in ISO format to req.body.time
    req.body.Time = new Date().toISOString();
  }

  try {
    const data = await NewOccuranceModel.create(req.body);
    res.json("Saved");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "An error occurred while saving data" });
  }
});

// app.post('/occurrence/edit/history', async (req, res) => {
//   const { OccurenceId, request, description, changedBy, changingVar } = req.body;

//   const currentDate = new Date();

//   const dateFormatter = new Intl.DateTimeFormat('en-GB', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit'
//   });

//   const timeFormatter = new Intl.DateTimeFormat('en-GB', {
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });

//   const formattedDate = dateFormatter.format(currentDate);
//   const formattedTime = timeFormatter.format(currentDate);

//   const dateTime = `${formattedDate} at ${formattedTime}`;

//   const occurrence = new NewOccuranceModel({ request, description, dateTime, changedBy });

//   try {
//     const savedOccurrence = await occurrence.save();
//     res.status(201).send(savedOccurrence);
//   } catch (err) {
//     res.status(400).send(err);
//   }
// });

app.post('/occurrence/edit/history', async (req, res) => {
  const { OccurenceId, request, description, changedBy, changingVar } = req.body;

  const currentDate = new Date();

  const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const timeFormatter = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const formattedDate = dateFormatter.format(currentDate);
  const formattedTime = timeFormatter.format(currentDate);

  const dateTime = `${formattedDate} at ${formattedTime}`;

  try {
    const occurrence = await NewOccuranceModel.findById(OccurenceId);

    if (!occurrence) {
      return res.status(404).send({ message: 'Occurrence not found' });
    }

    if (changingVar === 'request') {
      occurrence.Request = request;
      occurrence.RequestDateTime = dateTime;
      occurrence.changedBy = changedBy;
    } else if (changingVar === 'description') {
      occurrence.Description = description;
      occurrence.DescriptionDateTime = dateTime;
      occurrence.changedBy = changedBy;
    } else if (changingVar === 'both') {
      occurrence.Request = request;
      occurrence.RequestDateTime = dateTime;
      occurrence.Description = description;
      occurrence.DescriptionDateTime = dateTime;
      occurrence.changedBy = changedBy;
    }

    if (changingVar !== 'none') {
      const savedOccurrence = await occurrence.save();
      res.status(201).send(savedOccurrence);
    } else {
      res.status(400).send({ message: 'No changes to update' });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.post("/postoccurance", async (req, res) => {
  const data = await occuranceModel.create(req.body);
  res.json("Saved");
});

app.post("/poststreet", async (req, res) => {
  const data = await StrretModel.create(req.body);
  res.json("Saved");
});

app.post("/postApplicant", async (req, res) => {
  const data = await ApplicantsModel.create(req.body);
  res.json("Saved");
});

app.post("/postStaff", async (req, res) => {
  const data = await StaffModel.create(req.body);
  res.json("Saved");
});

app.post("/postVehicle", async (req, res) => {
  const data = await VechcleModel.create(req.body);
  res.json("Saved");
});

// For Get

app.get("/newGarissonData", (req, res) => {
  NewGarissonModel.find()
    .then(function (NewGarisson) {
      console.log(res.json(NewGarisson));
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getnewoccuranceAll", (req, res) => {
  const statusValues = ["0", "1", "2"]; // Array containing status values 0 and 2

  NewOccuranceModel.find({ Status: { $in: statusValues } })
    .then(function (NewOccurance) {
      res.json(NewOccurance);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

// app.get("/getnewoccuranceAll", (req, res) => {
//   const statusValues = ["0", "1", "2"];

//   NewOccuranceModel.aggregate([
//     { $match: { Status: { $in: statusValues } } },
//     {
//       $group: {
//         _id: "$occurance_Number",
//         doc: { $first: "$$ROOT" }
//       }
//     },
//     { $replaceRoot: { newRoot: "$doc" } }
//   ])
//     .then(NewOccurance => {
//       res.json(NewOccurance);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({ error: "Internal Server Error" });
//     });
// });

app.get("/getnewoccuranceAllStatus", (req, res) => {
  const { Status } = req.query;

  NewOccuranceModel.find({ Status: "1" })
    .then(function (NewOccurance) {
      console.log(res.json(NewOccurance));
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.put('/updateOccurance/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Request, Description } = req.body;

    // Find the occurrence by its ID
    const occurrenceToUpdate = await NewOccuranceModel.findById(id);

    if (!occurrenceToUpdate) {
      return res.status(404).json({ error: "Occurrence not found" });
    }

    // Update the observation and request fields
    occurrenceToUpdate.Description = Description;
    occurrenceToUpdate.Request = Request;

    // Save the updated occurrence
    const updatedOccurrence = await occurrenceToUpdate.save();

    return res.status(200).json({ message: "Occurrence updated successfully", occurrence: updatedOccurrence });
  } catch (error) {
    console.error("Error updating occurrence:", error);
    return res.status(500).json({ error: "An error occurred while updating the occurrence" });
  }
});


app.delete("/deleteOldOccurrences", async (req, res) => {
  const { phone, Applicant, Street, CPF, CEP, Neighbourhood, City, Reference, Description, Request, occurance_Number, occurance_Code } = req.body;

  try {
    // Construct the base query
    const baseQuery = {
      phone,
      Applicant,
      Street,
      CPF,
      CEP,
      Neighbourhood,
      City,
      Reference,
      Description,
      Request,
      occurance_Number,
      occurance_Code
    };

    // Check for records with status "1"
    const statusOneQuery = { ...baseQuery, Status: "1" };
    const statusZeroTwoQuery = { ...baseQuery, Status: { $in: ["0", "2"] } };

    const statusOneDocs = await NewOccuranceModel.find(statusOneQuery);

    if (statusOneDocs.length > 0) {
      console.log('found >', statusOneDocs.length)
      // Check if there are records with status "0" or "2"
      const statusZeroTwoDocs = await NewOccuranceModel.find(statusZeroTwoQuery);

      if (statusZeroTwoDocs.length > 0) {
        console.log('found >>', statusZeroTwoDocs.length)

        // Delete records with status "0" or "2"
        const deleteResult = await NewOccuranceModel.deleteMany(statusZeroTwoQuery);
        res.status(200).json({ message: "Old occurrences with status 0 or 2 deleted successfully.", deletedCount: deleteResult.deletedCount });
      } else {
        res.status(404).json({ message: "No matching occurrences with status 0 or 2 found." });
      }
    } else {
      res.status(404).json({ message: "No matching occurrences with status 1 found." });
    }
  } catch (error) {
    console.error("Error deleting old occurrences:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




// get with id
app.get("/getnewoccuranceAll/:id", (req, res) => {
  const id = req.params.id;

  NewOccuranceModel.findById(id)
    .then(function (NewOccurance) {
      console.log(res.json(NewOccurance));
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getnewoccurance", (req, res) => {
  NewOccuranceModel.countDocuments()
    .then(function (NewOccurance) {
      console.log(res.json(NewOccurance));
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getoccurance", (req, res) => {
  occuranceModel
    .find({})
    .then(function (Occurance) {
      res.json(Occurance);
    })
    .catch(function (err) {
      console.log(err);
    });
});


app.get("/getoccurencebyphonenumber/:id", (req, res) => {
  const { id } = req.params;

  NewOccuranceModel
    .findOne({ phone: id })
    .then(function (Occurance) {
      console.log(Occurance);
      if (Occurance) {
        res.json(Occurance);
      } else {
        res.status(404).json({ message: "No occurrence found with status 0 or 2." });
      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});


app.get("/getStreet", (req, res) => {
  StrretModel.find({})
    .then(function (Street) {
      res.json(Street);
    })
    .catch(function (err) {
      console.log(err);
    });
});


app.get("/getApplicants", (req, res) => {
  ApplicantsModel.find({})
    .then(function (Applicant) {
      res.json(Applicant);
    })
    .catch(function (err) {
      console.log(err);
    });
});

// used in dashboard
app.get("/getVehcle", (req, res) => {
  VechcleModel.find({})
    .then(function (vehcle) {
      res.json(vehcle);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getVehcleStatus", (req, res) => {
  VechcleModel.find({ Status: true })
    .then(function (vehcle) {
      res.json(vehcle);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getStaffStatus", (req, res) => {
  StaffModel.find({ Status: true })
    .then(function (staffs) {
      res.json(staffs);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getStaff", (req, res) => {
  StaffModel.find({})
    .then(function (staffs) {
      res.json(staffs);
    })
    .catch(function (err) {
      console.log(err);
    });
});

// put
app.put("/updateVehicle/:id", (req, res) => {
  const id = req.params.id;
  console.log("id is ", id);
  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: false };

  VechcleModel.findByIdAndUpdate(id, updateFields, { new: true }) //cherkhani
    .then((vehicle) => {
      if (!vehicle) {
        return res.status(404).json({ error: "vehicle not found" });
      }
      res.json(vehicle);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/updateStaff", async (req, res) => {
  try {
    const dataArray = req.body.dataArray;
    console.log("Array of IDs:", dataArray);

    // Update the status field of documents in the Staff collection
    const updateResult = await StaffModel.updateMany(
      { _id: { $in: dataArray } }, // Find documents with IDs in dataArray
      { $set: { Status: false } } // Update status field to false
    );

    console.log("Update result:", updateResult);

    res.status(200).json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Garrson used in dashboard
app.get("/getGarrisonTrue", (req, res) => {
  NewGarissonModel.find({ Status: true })
    .then(function (NewGarisson) {
      res.json(NewGarisson);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getGarrisonFalse", (req, res) => {
  NewGarissonModel.find({ Status: false })
    .then(function (NewGarisson) {
      res.json(NewGarisson);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/getGarrisonFalse", (req, res) => {
  NewGarissonModel.find({ Status: false })
    .then(function (NewGarisson) {
      res.json(NewGarisson);
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.put("/occuranceDispatch/:id", (req, res) => {
  const { DispatchBy } = req.body;
  const id = req.params.id;
  console.log("id is ", id);

  const updateFields = { Status: "0", DispatchBy: DispatchBy };

  NewOccuranceModel.findByIdAndUpdate(id, updateFields, { new: "1" })
    .then((NewOccurance) => {
      if (!NewOccurance) {
        return res.status(404).json({ error: "vehicle not found" });
      }
      res.json(NewOccurance);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/occuranceDispatchGarison/:id", async (req, res) => {
  const id = req.params.id
  const dataArray = req.body.dataArray;
  console.log('Array of IDs:', dataArray);
  const updateFields = { av_garison: dataArray };

  // console.log("av_garison is " , av_garison);

  // Assuming you want to update specific fields in the Staff model

  NewOccuranceModel.findByIdAndUpdate(id, updateFields, { av_garison: [] })
    .then((NewOccurance) => {
      if (!NewOccurance) {
        return res.status(404).json({ error: "vehicle not found" });
      }
      res.json(NewOccurance);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/getGarrison", (req, res) => {
  NewGarissonModel.find({ Status: true })
    .then(function (NewGarisson) {
      res.json(NewGarisson);
    })
    .catch(function (err) {
      console.log(err);
    });
});


app.get("/getnewoccuranceAllStatus/:id", (req, res) => {
  const id = req.params.id
  NewOccuranceModel.find({ _id: id })
    .then(function (garrison) {
      if (!garrison) {
        return res.status(404).json({ error: 'Garrison not found' });
      }
      // Assuming "aversion_garrion" is a key in the garrison object
      // console.log("garssion is " , garrison)
      const aversion_garrion = garrison[0];
      console.log(aversion_garrion)
      res.json(aversion_garrion);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/getnewoccuranceOpenCases", (req, res) => {
  const statusValues = ["0", "1", "2"]; // Array containing status values 0 ,1, 2

  NewOccuranceModel.find({ Status: { $in: statusValues } })
    .then(function (NewOccurance) {
      res.json(NewOccurance);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})

//used in Dashboard and closing
app.get("/getnewoccuranceAllStatusWithZeroAndTwo", (req, res) => {
  const statusValues = ["0", "2"]; // Array containing status values 0 and 2

  NewOccuranceModel.find({ Status: { $in: statusValues } })
    .then(function (NewOccurance) {
      res.json(NewOccurance);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/getnewoccuranceAllStatusWithZero", (req, res) => {
  const statusValues = ["0"]; // Array containing status values 0 

  NewOccuranceModel.find({ Status: { $in: statusValues } })
    .then(function (NewOccurance) {
      res.json(NewOccurance);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

//get all staff true or false
app.get("/getAllStaff", (req, res) => {
  StaffModel.find().then(function (staffs) {
    res.json(staffs)
  }).catch(function (err) {
    console.log(err)
  })
})

//occurnce garision arrived 

app.put("/occuranceDispatcharrivegarrison/:id", (req, res) => {
  const OccurenceId = req.params.id
  const { garissonIds } = req.body
  console.log("garsion are ", garissonIds);
  console.log("occurenceid is ", OccurenceId)

  const currentTime = new Date(); // Get the current date and time


  const updateFields = {
    $set: {}
  };

  // Constructing the arrayFilters based on garissonIds
  const arrayFilters = garissonIds.map((id, index) => ({ [`elem${index}.id`]: id }));

  // Setting the 'disabled' key to true for matching Ids
  garissonIds.forEach(id => {
    updateFields.$set[`av_garison.$[elem${garissonIds.indexOf(id)}].disabled`] = true;
    updateFields.$set[`av_garison.$[elem${garissonIds.indexOf(id)}].ArrivalTime`] = currentTime;
  });


  const options = {
    arrayFilters,
    new: true // Return the updated document after update
  };


  NewOccuranceModel.findByIdAndUpdate(OccurenceId, updateFields, options)
    .then(updatedDocument => {
      console.log("Updated document:", updatedDocument);
      res.status(200).json({ message: "Occurrence updated successfully", data: updatedDocument });
      // Respond with updatedDocument or any other desired response
    })
    .catch(error => {
      console.error("Error updating document:", error);
      // Handle error appropriately
      res.status(500).json({ error: "Internal Server Error" });

    });

});

app.get("/getnewoccuranceocurrencesgarissonwithtruedisabled/:id", (req, res) => {
  const OccurrenceId = req.params.id;
  console.log('hitp')
  NewOccuranceModel.findById(OccurrenceId)
    .then(occurrence => {
      if (!occurrence) {
        return res.status(404).json({ error: "Occurrence not found" });
      }

      // Filter av_garison array to include only objects with disabled set to true
      const filteredGarison = occurrence.av_garison.filter(item => item.disabled === true);
      console.log("filted item are ", filteredGarison)
      res.status(200).json(filteredGarison);
    })
    .catch(error => {
      console.error("Error retrieving occurrence:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.put("/occuranceDispatcharrive/:id", (req, res) => {
  const id = req.params.id;
  console.log("id is ", id);
  const { InformedOfArrivalBy } = req.body
  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: '2', InformedOfArrivalBy: InformedOfArrivalBy };

  NewOccuranceModel.findByIdAndUpdate(id, updateFields, { new: "0" })
    .then((NewOccurance) => {
      if (!NewOccurance) {
        return res.status(404).json({ error: "vehicle not found" });
      }
      res.json(NewOccurance);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/occuranceclosed/:id", (req, res) => {
  const { ClosedBy } = req.body
  const id = req.params.id;
  console.log("id is ", id);
  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: "3", ClosedBy: ClosedBy };

  NewOccuranceModel.findByIdAndUpdate(id, updateFields, { Status: "2" }) //checking only occurence closing
    .then((NewOccurance) => {
      if (!NewOccurance) {
        return res.status(404).json({ error: "vehicle not found" });
      }
      res.json(NewOccurance);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/saveOccurence/:id", async (req, res) => {
  console.log("API called");
  console.log("req.params.id", req.params.id);
  console.log(req.body.formFields);
  console.log("description", req.body.description);

  try {
    const formFields = req.body.formFields;
    const description = req.body.description;
    const IdOfOccurence = req.params.id;

    // Check if the document exists
    let occurrence = await OccurenceSavedSchemaModel.findOne({ IdOfOccurence: IdOfOccurence });

    if (occurrence) {
      // Update existing document
      console.log(occurrence.formFields);
      occurrence.formFields = formFields
      occurrence.description = description
      await occurrence.save();

      console.log(`Updated document with IdOfOccurence: ${IdOfOccurence}`);
      res.status(200).json({ message: `Updated document with IdOfOccurence: ${IdOfOccurence}` });
    } else {
      // Create new document
      const dataToSave = {
        IdOfOccurence: IdOfOccurence,
        formFields: formFields,
        description: description
      };
      const newOccurrence = new OccurenceSavedSchemaModel(dataToSave);
      await newOccurrence.save();
      console.log(`Created new document with IdOfOccurence: ${IdOfOccurence}`);
      res.status(201).json({ message: `Created new document with IdOfOccurence: ${IdOfOccurence}` });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }

});

app.get("/getSaveOccurence", (req, res) => {
  OccurenceSavedSchemaModel.find()
    .then(function (SavedData) {
      res.json(SavedData);
    })
    .catch(function (err) {
      console.log(err);
    });
})


app.delete("/saveOccurenceDelete/:id", async (req, res) => {
  const idToDelete = req.params.id
  OccurenceSavedSchemaModel.findOneAndDelete({ IdOfOccurence: idToDelete })
    .then(() => {
      res.status(200).json({ message: "Saved OCCurenceDelteted" })
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    })
})


///closing occurence and making garission available
app.put("/updataGarrisonToTrue/:id", (req, res) => {
  const id = req.params.id;
  console.log("id is ", id); //new occurrences id
  // Assuming you want to update specific fields in the Staff model
  NewOccuranceModel.findById(id).then((doc) => {
    if (!doc) {
      return res.status(404).json({ error: 'occurrence not found' });
    }
    const garissonIds = doc.av_garison.map((item) => item.garissonId);
    const updateFields = { Status: true };
    NewGarissonModel.updateMany({ _id: { $in: garissonIds } }, updateFields, { new: false })
      .then((updatedGarrissons) => {
        if (!updatedGarrissons) {
          return res.status(404).json({ error: 'garrissons not found or not updated' });
        }
        res.json(updatedGarrissons);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
      });
  });
});


//gettinng all garissons

app.get("/getGarrisonAll", (req, res) => {
  NewGarissonModel.find()
    .then(function (NewGarisson) {
      res.json(NewGarisson);
    })
    .catch(function (err) {
      console.log(err);
    });
});

//SearchBar Api

app.get("/SearchedOccurences/:id", (req, res) => {

  const data = req.params.id.toString()

  NewOccuranceModel.find({ Applicant: data })
    .then(function (NewOccurance) {
      res.json(NewOccurance);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

//Time setted

app.put("/occuranceDispatchTime/:id", (req, res) => {
  const id = req.params.id;
  console.log("id is ", id);

  const dateNow = new Date();
  const isoDateTime = dateNow.toISOString();
  const updateFields = { Time: isoDateTime };

  NewOccuranceModel.findByIdAndUpdate(id, updateFields, { new: true })
    .then((updated) => {
      if (!updated) {
        return res.status(404).json({ error: "vehicle not found" });
      }
      res.json(updated);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/getnewoccuranceAllStatusWithZero/:id", (req, res) => {
  const id = req.params.id;
  console.log("api hitted for arrival time")
  const dateNow = new Date();

  const isoDateTime = dateNow.toISOString();

  const updateFields = { Arrivaltime: isoDateTime };

  NewOccuranceModel.findByIdAndUpdate(id, updateFields, { new: true })
    .then(function (NewOccurance) {
      res.json(NewOccurance);
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.put("/updataGarrisonStat", (req, res) => {
  const { VehcleName } = req.body;

  console.log("VehcleName is ", VehcleName);
  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: true };

  NewGarissonModel.findOneAndUpdate(VehcleName, updateFields, { new: false })
    .then((NewGarisson) => {
      if (!NewGarisson) {
        return res.status(404).json({ error: "av_garison not found" });
      }
      res.json(NewGarisson);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

//Dashboard backend for total occurencnes in a day ,month and yearn

// Get occurrence count for today
app.get("/occurrences/today", async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
    const count = await NewOccuranceModel.countDocuments({
      registrationDate: { $gte: startOfDay, $lt: endOfDay },
    });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get occurrence count for this month
app.get("/occurrences/month", async (req, res) => {
  try {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );
    const count = await NewOccuranceModel.countDocuments({
      registrationDate: { $gte: startOfMonth, $lt: endOfMonth },
    });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get occurrence count for this year
app.get("/occurrences/year", async (req, res) => {
  try {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfYear = new Date(new Date().getFullYear() + 1, 0, 1);
    const count = await NewOccuranceModel.countDocuments({
      registrationDate: { $gte: startOfYear, $lt: endOfYear },
    });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});



app.delete("/deleteGarrisonStatus", (req, res) => {
  NewGarissonModel.deleteMany()
    .then((result) => {
      res.json({ deletedCount: result.deletedCount });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
})



app.put("/statustrueStaff", (req, res) => {

  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: true };

  StaffModel.updateMany({ Status: false }, updateFields)
    .then((NewGarisson) => {
      if (!NewGarisson) {
        return res.status(404).json({ error: 'vehicle not found' });
      }
      res.json(NewGarisson);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

app.put("/statustrueVehcle", (req, res) => {

  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: true };

  VechcleModel.updateMany({ Status: false }, updateFields)
    .then((NewGarisson) => {
      if (!NewGarisson) {
        return res.status(404).json({ error: 'vehicle not found' });
      }
      res.json(NewGarisson);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});





app.put("/newGarisonInActive/:id", (req, res) => {
  const id = req.params.id;
  console.log("id is ", id);
  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: false };

  NewGarissonModel.findByIdAndUpdate(id, updateFields, { Status: true })
    .then((NewGarisson) => {
      if (!NewGarisson) {
        return res.status(404).json({ error: 'vehicle not found' });
      }
      res.json(NewGarisson);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.put("/newGarisonActive/:id", (req, res) => {
  const id = req.params.id;
  console.log("id is ", id);
  // Assuming you want to update specific fields in the Staff model
  const updateFields = { Status: true };

  NewGarissonModel.findByIdAndUpdate(id, updateFields, { Status: false })
    .then((NewGarisson) => {
      if (!NewGarisson) {
        return res.status(404).json({ error: 'vehicle not found' });
      }
      res.json(NewGarisson);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.put("/updateGarrisoninServiceNew", async (req, res) => {
  try {
    const dataArray = req.body.dataArray;
    console.log('Array of IDs:', dataArray);

    // Update the status field of documents in the Staff collection
    const updateResult = await NewGarissonModel.updateMany(
      { _id: { $in: dataArray } }, // Find documents with IDs in dataArray
      { $set: { Status: false } } // Update status field to false
    );

    console.log('Update result:', updateResult);

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.put("/updataGarrison", async (req, res) => {
  try {
    const dataArray = req.body.dataArray;
    console.log('Array of IDs:', dataArray);

    // Update the status field of documents in the Staff collection
    const updateResult = await NewGarissonModel.updateMany(
      { _id: { $in: dataArray } }, // Find documents with IDs in dataArray
      { $set: { Status: false } } // Update status field to false
    );

    console.log('Update result:', updateResult);

    res.status(200).json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete("/deleteOccuranceAv_garison/:id", (req, res) => {
  const id = req.params.id;
  const indexToDelete = req.body.index;

  NewOccuranceModel.findByIdAndUpdate(
    id,
    { av_garison: splice(indexToRemove, 1) }
  )
    .then((result) => {
      if (!result) {
        return res.status(404).json({ error: 'Document not found' });
      }
      console.log(result);
      res.status(200).json({ message: 'Document updated successfully', data: result });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});


app.post("/createreport", (req, res) => {

  reportSchemaModel.create(req.body)
  res.json("Created")
})

app.post("/userLogin", async (req, res) => {
  // console.log("data received is ", req.body);
  try {
    const { username, password, isAdmin } = req.body;
    let user;

    if (!isAdmin) {
      user = await ResigisterNormalUserSchemaModel.findOne({
        username: username,
      });
    } else {
      user = await ResigisterNormalUserSchemaModel.findOne({
        username: username,
        isAdmin: true,
      });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Compare hashed passwords (bcrypt or similar should be used for hashing)
    const isPasswordValid = (password === user.password); // This should be replaced with bcrypt.compare

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT token
    const token = jwt.sign({
      username: user.username,
      password: user.password
    }, "secret123");

    return res.status(200).json({ success: true, message: "Login successful", user: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error", user: false });
  }
});

app.post("/admin/dashboard/registerUser", async (req, res) => {
  const { username } = req.body;
  const existingUser = await ResigisterNormalUserSchemaModel.findOne({
    $or: [{ username }],
  });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const dataSendToDb = { ...req.body, isAdmin: false }

  const data = await ResigisterNormalUserSchemaModel.create(dataSendToDb);

  res.json("Saved");
});

//displaying User
app.get("/admin/dashboard/viewitems/getRegisteredUser", async (req, res) => {
  const data = await ResigisterNormalUserSchemaModel.find({});
  res.json(data);
});

app.delete("/deleteoccurrence/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Assuming ResigisterNormalUserSchemaModel is the model for occurrences
    // Replace it with your actual occurrence model
    await ResigisterNormalUserSchemaModel.findByIdAndDelete(id);
    res.json({ message: "Occurrence deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the occurrence" });
  }
});


app.put("/updateOccurence/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password, designation } = req.body;

    // Assuming ResigisterNormalUserSchemaModel is the model for occurrences
    // Replace it with your actual occurrence model
    await ResigisterNormalUserSchemaModel.findByIdAndUpdate(id, { username: username, password: password, designation: designation }, { new: true })
    res.json({ message: "Occurrence updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the occurrence" });
  }
});

// We are updating occurence in services New
app.put("/updateOccurenceInServices", async (req, res) => {
  try {
    const { OccurenceIdForUpdate } = req.body;
    const { phone, Applicant, Street, Neighbourhood, City, Reference, av_garison, occurance_Number, occurance_Code, CEP, CPF, Request, Description } = req.body.post

    let Av_garisonMixed = [];
    try {
      const res = await NewOccuranceModel.findById(OccurenceIdForUpdate);
      Av_garisonMixed.push(...res.av_garison);
      Av_garisonMixed.push(...av_garison);

    } catch (error) {
      console.error("Error:", error);
    }

    const updateField = {
      phone: phone,
      Applicant: Applicant,
      Street: Street,
      Neighbourhood: Neighbourhood,
      City: City,
      Reference: Reference,
      av_garison: Av_garisonMixed,
      occurance_Number: occurance_Number,
      occurance_Code: occurance_Code,
      Description: Description,
      Request: Request,
      CEP: CEP,
      CPF: CPF
    }
    NewOccuranceModel.findByIdAndUpdate(OccurenceIdForUpdate, { ...updateField }, { new: true })
      .then((response) => {
        return res.status(200).json({ response: "data updated" })
      })

  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the occurrence" });
    console.log(error);
  }

});

app.get("/occurencewithstatusthree", (req, res) => {
  NewOccuranceModel.find({ Status: "3" })
    .then(function (NewOccurance) {
      console.log(res.json(NewOccurance));
    })
    .catch(function (err) {
      console.log(err);
    });

})

app.get('/view-pdf/new/:id', async (req, res) => {
  const id = req.params.id;
  const { ReportCreatedBy } = req.query;

  try {
    const occurrence = await NewOccuranceModel.findById(id);
    const report = await reportSchemaModel.findOne({ IdOfOccurence: occurrence._id });

    let changingVar;

    if ((occurrence.DescriptionDateTime !== '') && (occurrence.RequestDateTime !== '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.DescriptionDateTime}</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.RequestDateTime}</li>
      `
    } else if ((occurrence.DescriptionDateTime == '') && (occurrence.RequestDateTime !== '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> Ainda não editado</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.RequestDateTime}</li>
      `
    } else if ((occurrence.DescriptionDateTime !== '') && (occurrence.RequestDateTime == '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.DescriptionDateTime}</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> Ainda não editado</li>
      `
    } else if ((occurrence.DescriptionDateTime == '') && (occurrence.RequestDateTime == '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> Ainda não editado</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> Ainda não editado</li>
      `
    }

    const changingVarWithoutBackticks = changingVar.replace(/`/g, '');

    res.render('partialreport', { occurrence, ReportCreatedBy, changingVar: changingVarWithoutBackticks });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Error occurred');
  }
});

app.get('/create-downloadable-pdf/new/:id', async (req, res) => {
  const id = req.params.id;
  const ReportCreatedBy = req.query.ReportCreatedBy; // Extracting from query parameters

  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = date.toLocaleDateString(undefined, options);
  const timeString = date.toLocaleTimeString();

  try {
    const occurrence = await NewOccuranceModel.findById(id);
    const report = await reportSchemaModel.findOne({ IdOfOccurence: occurrence._id });

    res.render('downloadable', { occurrence, report, ReportCreatedBy, dateString, timeString });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Error occurred');
  }
});

app.get('/create-pdf/new/:id', async (req, res) => {
  const id = req.params.id;
  const ReportCreatedBy = req.query.ReportCreatedBy; // Extracting from query parameters

  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = date.toLocaleDateString(undefined, options);
  const timeString = date.toLocaleTimeString();

  try {
    const occurrence = await NewOccuranceModel.findById(id);
    const report = await reportSchemaModel.findOne({ IdOfOccurence: occurrence._id });

    let changingVar;

    if ((occurrence.DescriptionDateTime !== '') && (occurrence.RequestDateTime !== '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.DescriptionDateTime}</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.RequestDateTime}</li>
      `
    } else if ((occurrence.DescriptionDateTime == '') && (occurrence.RequestDateTime !== '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> Ainda não editado</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.RequestDateTime}</li>
      `
    } else if ((occurrence.DescriptionDateTime !== '') && (occurrence.RequestDateTime == '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> ${occurrence.changedBy} em ${occurrence.DescriptionDateTime}</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> Ainda não editado</li>
      `
    } else if ((occurrence.DescriptionDateTime == '') && (occurrence.RequestDateTime == '')) {
      changingVar = `
      <li><strong>Descrição:</strong> ${occurrence.Description}</li>
      <li><strong>Descrição Editado Por:</strong> Ainda não editado</li>
      <li><strong>Solicitação:</strong> ${occurrence.Request}</li>
      <li><strong>Solicitação Editado Por:</strong> Ainda não editado</li>
      `
    }

    const changingVarWithoutBackticks = changingVar.replace(/`/g, '');

    res.render('advancereport', { occurrence, report, ReportCreatedBy, dateString, timeString, changingVar: changingVarWithoutBackticks });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).send('Error occurred');
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Define the route to serve the PDF file dynamically based on the ID
app.get('/pdf/:id', (req, res) => {
  const pdfId = req.params.id;
  const pdfPath = path.join(__dirname, 'public', `pdf-${pdfId}.pdf`);

  // Check if the file exists
  fs.access(pdfPath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('File not found:', pdfPath);
      return res.status(404).send('File not found');
    }

    // Send the file if it exists
    res.sendFile(pdfPath, (err) => {
      if (err) {
        console.error('Error sending the file:', err);
        res.status(500).send('Error sending the file');
      }
    });
  });
});

app.post('/create-pdf/:id', async (req, res) => {
  const id = req.params.id;
  const { ReportCreatedBy } = req.body;

  try {
    const occurrence = await NewOccuranceModel.findById(id);
    const report = await reportSchemaModel.findOne({ IdOfOccurence: occurrence._id });

    // Return the required data
    res.json({ occurrence, report, ReportCreatedBy });
  } catch (err) {
    console.error('Error generating data:', err);
    return res.status(500).send('Error generating data');
  }
});
