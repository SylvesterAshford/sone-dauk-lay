import { SoneDaukLay } from "@/components/app/SoneDaukLay";

// The whole guided experience is one client state machine (matches the confirmed
// design's flow): HQ · Learn · See · Name · Build · You + Hub/Lesson + the Lens.
export default function Page() {
  return <SoneDaukLay />;
}
