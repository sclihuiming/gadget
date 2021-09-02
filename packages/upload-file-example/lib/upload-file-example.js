"use strict";

const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

async function uploadFile() {
  const formData = new FormData();
  formData.append("files", fs.createReadStream("./files/v0.5.17.d19bba12.sol"));
  formData.append("compiler", "v0.7.0+commit.9e61f92b.js");
  formData.append("optimizer", 0);
  formData.append("runs", 0);
  //   const headers = formData.getHeaders();
  const res = await axios.post(
    "http://192.168.21.148:9019/api/solidity/contract/compile",
    formData,
    {
      headers: { ...formData.getHeaders() },
    }
  );
  console.log(res.data);
}

uploadFile();
