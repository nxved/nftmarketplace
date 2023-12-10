import { IncomingForm } from "formidable";
import fs from "fs";
import axios from "axios";
const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("****************************")
      console.log(req.body)
        // Assuming the JSON object is attached to the "file" field

        // Call pinJSONToIPFS to pin the JSON object to Pinata
       const pinataResponse = await pinJSONToIPFS(req.body);
       console.log(pinataResponse.data.IpfsHash)

        res.status(200).json({ success: true, message: "NFT creation successful", data : pinataResponse.data.IpfsHash });

        // ... rest of the code
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  } else {
    res.status(405).end();
  }
}

export const pinJSONToIPFS = async (metadata) => {
  // Your existing pinJSONToIPFS logic here
  const data = JSON.stringify({
    pinataContent: {
      // Use metadata properties here
      name: metadata.name,
      description: metadata.description,
      image: metadata.image,
    },
    pinataMetadata: {
      name: "metadata.json",
    }
  });

  try {
    const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.PINATA_JWT}`
      }
    });
    console.log(res.data);
    return { status: res.status, data: res.data };
  } catch (error) {
    console.log(error);
  }
};
