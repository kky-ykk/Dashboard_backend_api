import express from "express";
import Referal from "../model/referal.js";
import { jwtAuthMiddleware } from "../utils/jwt.js";

const referRoutes = express.Router();

// referRoutes.post("/",async (req,res)=>{
//   try {
//     let ref_num=req.body.num;
//     let ress=await Referal.create({refer:ref_num});
//     return res.status(200).json({
//       message:"refer number added",
//       ress
//     })
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to add refer", error: err.message });
//   }
// })

referRoutes.get("/",jwtAuthMiddleware,async (req,res)=>{
  try {
    let ref=await Referal.findById('6822fc60e51ea1c803746212');
  
    // console.log(ref_num);

    return res.status(200).json({
      message:"refer number ",
      refer_num:ref.refer
    })
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add refer", error: err.message });
  }
})

referRoutes.put("/update", jwtAuthMiddleware,async (req, res) => {
  try {
    
    let ref_num=req.body.refer_num;

    console.log(ref_num);
    
    let ress=await Referal.findByIdAndUpdate('6822fc60e51ea1c803746212',{
      refer:ref_num
    })

    return res.status(200).json({
      message:"refer number added",
      ress
    })

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update refer", error: err.message });
  }
});

export default referRoutes;
