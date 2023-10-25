import { ObjectId } from "mongodb";
import { connectDB } from "../../util/database";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const db = (await connectDB).db("data");

  //   const date = new Date();

  const data = new ObjectId(String(req.query.id));

  if (req.method === "GET") {
    console.log(req.query.id);
    const result = await db
      .collection("post")
      .findOne({ "list.id": data }, { projection: { "list.$": 1 } });
    console.log(result);

    return res.status(200).json(result);
  }

  if (req.method === "POST") {
    if (req.query.type === "edit") {
      console.log(req.query.idx);
      const filter = { email: req.body.email };
      const update = {
        $set: {
          [`list.${req.query.idx}.title`]: req.body.title,
          [`list.${req.query.idx}.content`]: req.body.content,
        },
      };
      const result = await db.collection("post").updateOne(filter, update);

      return res.status(200).json({ ...result, messeage: "저장 되었습니다" });
    }
  } else {
    return res.status(405).end();
  }
};
