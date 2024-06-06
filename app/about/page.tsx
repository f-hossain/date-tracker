import { Typography } from "@mui/material";
import Header from "../components/header";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center">
      < Header />
      <div className="flex flex-col grow items-center justify-center gap-8">
        <Typography className="flex flex-col items-center text-stone-800">
        ₓ˚. ୭ ˚○◦˚ welcome to lovelist ˚◦○˚ ୧ .˚ₓ
        </Typography>
        <div className="w-1/2 flex flex-col gap-5 justify-center items-center font-serif text-xs font-thin text-stone-500 p-5">
          <p><b className="font-black">\ove\ist</b> is an app that lets you create and track fun date activities and organize them into different collections based on any kind of context - i.e. dates you want to do with your significant other vs outings you want to experience with your friends, dates you want to have in one city vs another, etc. You can create these collections and share them with your loved ones as well so they can help track it as well. </p>
          <p>I made this app because I noticed I would always be thinking up fun ideas I wanted to do with people, but when it actually came time to plan an activity with someone I would end up <b className="font-black">drawing a blank</b>. So I decided a create a place where I could save them :)</p>
          <p>Sometimes I even noticed that I would be in the mood for a specific type of activity over an other, i.e. maybe I would want something that didn’t break the bank, so I added filters and tags to this date tracker so you can find exactly the <b className="font-black">perfect date</b> to go on next!</p>
          <p>I hope this helps you as much as this helped me :)</p>
        </div>
      </div>
    </main>
  );
}
