var express = require("express");
const hellosign = require("../utils/hellosign");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

/* Create embedded: creates signature request for a user and returns the sign_url */
router.post("/sign", function (req, res) {
  const { email, name, phone, address } = req.body;

  console.log(req.body);

  const options = {
    test_mode: 1,
    clientId: "6db525b39fc9671418cd857017ec54cd",
    title: "NDA with Acme Co.",
    subject: "The NDA we talked about",
    message:
      "Please sign this NDA and then we can discuss more. Let me know if you have any questions.",
    signers: [
      {
        name: name,
        email_address: email,
      },
    ],
    cc_email_addresses: ["azeezlukman95@gmail.com", "lawyer@example2.com"],
    custom_fields: [
      {
        name: "name",
        value: name,
      },
      {
        name: "email",
        value: email,
      },
      {
        name: "phone",
        value: phone,
      },
      {
        name: "address",
        value: address,
      },
    ],
    file_url: [
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.computerhope.com%2Fissues%2Fch001278.htm&psig=AOvVaw2aEPm27Z_8YbWyeOGCivN9&ust=1640297884171000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCJjvmfi3-PQCFQAAAAAdAAAAABAD",
    ],
  };

  hellosign.signatureRequest
    .createEmbedded(options)
    .then((response) => {
      const signatureId = response.signature_request.signatures[0].signature_id;
      console.log(signatureId);

      return hellosign.embedded.getSignUrl(signatureId);
    })
    .then((response) => {
      console.log(response);
      res.status(201).json({ data: response });
    })
    .catch((error) => {
      console.log(error);

      res.status(500).json({
        error,
      });
    });
});

module.exports = router;
