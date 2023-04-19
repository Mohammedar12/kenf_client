// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import emailjs from "@emailjs/nodejs";
import axios from "axios";
import FormData from 'form-data';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let body;
    try{
      body = JSON.parse(req.body);
    }
    catch(e){
      console.log(e);
      res.status(400).json({ status: 400, message: 'Bad request' });
      return;
    }
    if(!body.name || !body.email || !body.age || !body.contact_number || !body.country || !body.city || !body.media || !body.shearing_ways || !body.gender){
      res.status(400).json({ status: 400, message: 'Bad request' });
      return;
    }
    const formData = new FormData();
    formData.append("Gender",body.gender);
    formData.append("Name",body.name);
    formData.append("Email",body.email);
    formData.append("Contact_Number",body.contact_number);
    formData.append("Age",body.age);
    formData.append("Country",body.country);
    formData.append("City",body.city);
    formData.append("Media",body.media);
    formData.append("ShearingWays",body.shearing_ways);
    let googleSheetResponse;
    try{
      googleSheetResponse = await axios({
        method: "post",
        url: "https://script.google.com/macros/s/AKfycby3I9_Mc4LC7_6LCP3CpEzp4TcJy7CP-rC0gdRD1TadH5sH8Co428MvZ5neMBzjXhKUUQ/exec",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    catch(e){
      console.log(e);
      res.status(500).json({ status: 500, message: 'Internal server error' });
      return;
    }
    let templateParams = {
      name: "Ali",
      notes: "Check this out!",
    };
    let emailResponse;
    try{
      emailResponse = await emailjs.send("service_xfsmxkc","template_cw5z08o",templateParams,{
        publicKey: "CyUHYY4O7Y4REotp2"
      });
      res.status(200).json({ message: 'Successfully registered.' });
    }
    catch(e){
      console.log(e);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }
  } else {
    res.status(404).json({ status: 404, message: 'Not found' });
    return;
  }
}
