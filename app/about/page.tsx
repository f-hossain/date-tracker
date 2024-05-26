import { Typography } from "@mui/material";
import Header from "../components/header";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center gap-10">
      < Header />
      <div className="flex flex-col items-center gap-5">
        <Typography>
          ♡ about ♡
        </Typography>
      </div>
      <Typography>
        hihihihihi
      </Typography>
    </main>
  );
}
