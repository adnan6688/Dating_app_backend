import cron from "node-cron";
import { Event } from "../modules/Events/event.model";
import { EStatus } from "../modules/Events/event.interface";

export function startEventScheduler() {
  cron.schedule("*/5 * * * *", async () => {
    const nowUTC = new Date(); // already UTC internally
    // eslint-disable-next-line no-console
    console.log("Cron running at UTC:", nowUTC.toISOString());

    try {
      
      // Step 1: latest 150 ta document find koro
      const events = await Event.find({
        status: EStatus.NOSTART,
        openDoor: { $lte: nowUTC },
      })
        .sort({ openDoor: -1 }) // latest first
        .limit(150)
        .select('_id');

      // Step 2: oi gula update koro
      const ids = events.map(e => e._id);

      const res1 = await Event.updateMany(
        { _id: { $in: ids } },
        {
          $set: { status: EStatus.OPPENDOOR },
        }
      );
      // eslint-disable-next-line no-console
      console.log(
        "NOSTART → OPPENDOOR:",
        res1.matchedCount,
        res1.modifiedCount
      );

      // Step 2: OPPENDOOR → GOING (start_date_time)
      const res2 = await Event.updateMany(
        {
          status: EStatus.OPPENDOOR,
          start_date_time: { $lte: nowUTC },
        },
        {
          $set: { status: EStatus.GOING },
        }
      );

      // eslint-disable-next-line no-console
      console.log(
        "OPPENDOOR → GOING:",
        res2.matchedCount,
        res2.modifiedCount
      );

      // Step 3: GOING → END (end_date_time)
      const res3 = await Event.updateMany(
        {
          status: EStatus.GOING,
          end_date_time: { $lte: nowUTC },
        },
        {
          $set: { status: EStatus.END },
        }
      );

      // eslint-disable-next-line no-console
      console.log(
        "GOING → END:",
        res3.matchedCount,
        res3.modifiedCount
      );

    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Error updating event statuses:", err);
    }
  });
}